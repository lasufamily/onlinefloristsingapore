import type { Enquiry } from './enquiries';
import { parseEnquiry } from './enquiries';

export type StoredEnquiry = Omit<Enquiry, 'turnstileToken'> & {
  id: string;
  ipHash: string;
  createdAt: string;
};

export type EnquiryServices = {
  verifyTurnstile(token: string, ip: string): Promise<boolean>;
  hashIp(ip: string): Promise<string>;
  countRecent(ipHash: string, since: string): Promise<number>;
  store(enquiry: StoredEnquiry): Promise<void>;
  notify(enquiry: StoredEnquiry): Promise<void>;
  now(): Date;
  createId(): string;
};

export function createEnquiryHandler(_services: EnquiryServices) {
  return async (request: Request): Promise<Response> => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    const now = _services.now();
    const parsed = parseEnquiry(body, now);
    if (!parsed.success) {
      return json({ error: 'invalid_enquiry', fields: parsed.errors }, 400);
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const verified = await _services.verifyTurnstile(parsed.data.turnstileToken, ip);
    if (!verified) {
      return json({ error: 'verification_failed' }, 400);
    }

    const ipHash = await _services.hashIp(ip);
    const since = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
    if ((await _services.countRecent(ipHash, since)) >= 3) {
      return json({ error: 'rate_limited' }, 429, { 'retry-after': '900' });
    }

    const { turnstileToken: _, ...enquiry } = parsed.data;
    const stored: StoredEnquiry = {
      ...enquiry,
      id: _services.createId(),
      ipHash,
      createdAt: now.toISOString(),
    };

    try {
      await _services.store(stored);
    } catch {
      return json({ error: 'service_unavailable' }, 500);
    }

    try {
      await _services.notify(stored);
    } catch {
      // The lead is durable in D1; notification can be retried operationally.
    }

    return json({ id: stored.id, status: 'received' }, 201);
  };
}

function json(body: unknown, status: number, headers: HeadersInit = {}): Response {
  return Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store', ...headers },
  });
}
