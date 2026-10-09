import { isIP } from "node:net";

/** The hosted service is behind ingress, which overwrites X-Real-IP. */
export function clientIp(req: {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}): string | undefined {
  const realIp = req.headers['x-real-ip'];
  const candidate = typeof realIp === 'string' ? realIp.trim() : undefined;
  // Do not choose an arbitrary entry from the caller-supplied XFF chain.
  const ip = candidate && isIP(candidate) ? candidate : req.socket?.remoteAddress;
  if (!ip || !isIP(ip)) return undefined;
  return ip.startsWith("::ffff:") && isIP(ip.slice(7)) === 4 ? ip.slice(7) : ip;
}
