import { describe, expect, it } from 'vitest';
import indexHtml from '../../index.html?raw';
import headers from '../../public/_headers?raw';

describe('vague 1.111 — Cloudflare Web Analytics CSP connect-src (QP-305)', () => {
  it('allows rum beacon host in meta connect-src (keeps static.)', () => {
    const cspMatch = indexHtml.match(
      /http-equiv="Content-Security-Policy"\s+content="([^"]+)"/
    );
    expect(cspMatch).not.toBeNull();
    const csp = cspMatch![1]!;
    const connect = csp.split(';').map((p) => p.trim()).find((p) => p.startsWith('connect-src'));
    expect(connect).toBeDefined();
    expect(connect).toContain('https://static.cloudflareinsights.com');
    expect(connect).toContain('https://cloudflareinsights.com');
    // script-src still loads beacon.min.js from static.
    expect(csp).toMatch(/script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
  });

  it('does not invent a conflicting HTTP CSP in _headers; beacon token stays out of repo', () => {
    expect(headers).not.toMatch(/Content-Security-Policy/i);
    expect(indexHtml).not.toContain('c870a96339f841b2b8ffff7375aa5b21');
    expect(indexHtml).not.toContain('cdn-cgi/rum');
  });
});
