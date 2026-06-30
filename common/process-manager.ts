import cluster from "node:cluster";
import { availableParallelism } from "node:os";

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
    console.error(`[worker ${process.pid}] Uncaught exception:`, err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error(`[worker ${process.pid}] Unhandled rejection:`, reason);
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
      console.error("Fatal error:", err);
      process.exit(1);
    });
    return;
  }

  if (cluster.isPrimary) {
    const numWorkers = cfg.workers || 1;
    console.log(
      `[primary ${process.pid}] Starting ${numWorkers} worker(s)...`,
    );

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
        console.log(
          `[primary] Worker ${worker.process.pid} exited on ${signal}, not restarting`,
        );
        workerStates.delete(idx);
        if (allWorkersExited()) process.exit(0);
        return;
      }

      console.error(
        `[primary] Worker ${worker.process.pid} exited (code=${code}, signal=${signal})`,
      );

      const now = Date.now();
      state.restartTimestamps.push(now);
      state.restartTimestamps = state.restartTimestamps.filter(
        (t) => now - t < RAPID_RESTART_WINDOW_MS,
      );
      state.consecutiveFailures++;
      workerStates.set(idx, state);

      if (state.restartTimestamps.length >= MAX_RAPID_RESTARTS) {
        console.error(
          `[primary] Worker ${idx} crashed ${MAX_RAPID_RESTARTS} times in ${RAPID_RESTART_WINDOW_MS / 1000}s, giving up`,
        );
        workerStates.delete(idx);
        if (allWorkersExited()) {
          console.error("[primary] All workers failed, exiting");
          process.exit(1);
        }
        return;
      }

      const delay = getBackoffMs(state.consecutiveFailures);
      console.log(
        `[primary] Restarting worker ${idx} in ${delay}ms (failure #${state.consecutiveFailures})`,
      );
      setTimeout(() => forkWorker(idx), delay);
    });

    const shutdown = (sig: string) => {
      console.log(`[primary] Received ${sig}, shutting down workers...`);
      for (const id in cluster.workers) {
        cluster.workers[id]?.process.kill("SIGTERM");
      }
      setTimeout(() => {
        console.error("[primary] Forcing exit after timeout");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } else {
    setupWorkerGuards();
    console.log(`[worker ${process.pid}] Starting...`);
    workerMain().catch((err) => {
      console.error(`[worker ${process.pid}] Fatal error:`, err);
      process.exit(1);
    });
  }
}

function forkWorker(idx: number): void {
  const w = cluster.fork();
  console.log(`[primary] Forked worker ${idx} (pid=${w.process.pid})`);
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
