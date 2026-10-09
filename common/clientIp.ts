import { isIP } from "node:net";

/** Only explicit IPs/CIDRs are accepted; never trust all peers or a hop count. */
export function trustedProxyCidrs(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value.split(",").map(entry => {
    const cidr = entry.trim();
    const [address, prefix, extra] = cidr.split("/");
    const family = isIP(address);
    if (!family || extra !== undefined || (prefix !== undefined &&
      (!/^\d+$/.test(prefix) || Number(prefix) <= 0 || Number(prefix) > (family === 4 ? 32 : 128)))) {
      throw new Error("MCP_TRUSTED_PROXY_CIDRS must contain explicit IPs or nonzero CIDRs");
    }
    return cidr;
  });
}

/** Express resolves req.ip from right to left using the configured trusted peers. */
export function clientIp(req: { ip?: string }): string | undefined {
  const ip = req.ip;
  if (!ip || !isIP(ip)) return undefined;
  // Node commonly exposes IPv4 peers as IPv4-mapped IPv6 addresses.
  return ip.startsWith("::ffff:") && isIP(ip.slice(7)) === 4 ? ip.slice(7) : ip;
}
