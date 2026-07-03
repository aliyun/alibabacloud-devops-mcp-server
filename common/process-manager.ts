import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import { logger } from "./logger.js";

export interface ClusterConfig {
  enabled: boolean;
  workers: number;
}

const MAX_RAPID_RESTARTS = 5;
const RAPID_RESTART_WINDOW_MS = 10_000;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

interface WorkerState {
  restartTimestamps: number[];
  consecutiveFailures: number;
}

const workerStates = new Map<number, WorkerState>();

function getBackoffMs(failures: number): number {
  return Math.min(BASE_BACKOFF_MS * 2 ** (failures - 1), MAX_BACKOFF_MS);
}

export function setupWorkerGuards(): void {
  process.on("uncaughtException", (err) => {
    logger.error({ err }, "uncaught exception");
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error({ err: reason }, "unhandled rejection");
    process.exit(1);
  });
}

export function runWithCluster(
  cfg: ClusterConfig,
  workerMain: () => Promise<void>,
): void {
  if (!cfg.enabled) {
    setupWorkerGuards();
    workerMain().catch((err) => {
      logger.error({ err }, "fatal error");
      process.exit(1);
    });
    return;
  }

  if (cluster.isPrimary) {
    const numWorkers = cfg.workers || 1;
    logger.info({ numWorkers }, "primary starting workers");

    for (let i = 0; i < numWorkers; i++) {
      forkWorker(i);
    }

    cluster.on("exit", (worker, code, signal) => {
      const idx = worker.id - 1;
      const state = workerStates.get(idx) ?? {
        restartTimestamps: [],
        consecutiveFailures: 0,
      };

      if (signal === "SIGTERM" || signal === "SIGINT") {
        logger.info(
          { workerPid: worker.process.pid, signal },
          "worker exited on signal, not restarting",
        );
        workerStates.delete(idx);
        if (allWorkersExited()) process.exit(0);
        return;
      }

      logger.error(
        { workerPid: worker.process.pid, code, signal },
        "worker exited",
      );

      const now = Date.now();
      state.restartTimestamps.push(now);
      state.restartTimestamps = state.restartTimestamps.filter(
        (t) => now - t < RAPID_RESTART_WINDOW_MS,
      );
      state.consecutiveFailures++;
      workerStates.set(idx, state);

      if (state.restartTimestamps.length >= MAX_RAPID_RESTARTS) {
        logger.error(
          { workerIdx: idx, max: MAX_RAPID_RESTARTS, windowMs: RAPID_RESTART_WINDOW_MS },
          "worker crash-looping, giving up",
        );
        workerStates.delete(idx);
        if (allWorkersExited()) {
          logger.error("all workers failed, exiting");
          process.exit(1);
        }
        return;
      }

      const delay = getBackoffMs(state.consecutiveFailures);
      logger.info(
        { workerIdx: idx, delay, failure: state.consecutiveFailures },
        "restarting worker",
      );
      setTimeout(() => forkWorker(idx), delay);
    });

    const shutdown = (sig: string) => {
      logger.info({ signal: sig }, "primary received signal, shutting down workers");
      for (const id in cluster.workers) {
        cluster.workers[id]?.process.kill("SIGTERM");
      }
      setTimeout(() => {
        logger.error("forcing exit after timeout");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } else {
    setupWorkerGuards();
    logger.info("worker starting");
    workerMain().catch((err) => {
      logger.error({ err }, "worker fatal error");
      process.exit(1);
    });
  }
}

function forkWorker(idx: number): void {
  const w = cluster.fork();
  logger.info({ workerIdx: idx, workerPid: w.process.pid }, "forked worker");
}

function allWorkersExited(): boolean {
  const workers = cluster.workers ?? {};
  return Object.keys(workers).length === 0;
}

export function resolveWorkerCount(input: number | string | undefined): number {
  if (input === undefined || input === "" || input === 0) return 1;
  const s = String(input);
  if (s === "auto") return Math.max(1, availableParallelism() - 1);
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}
