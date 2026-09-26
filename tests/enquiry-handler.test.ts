import { describe, expect, it, vi } from 'vitest';
import { createEnquiryHandler, type EnquiryServices } from '../src/lib/enquiry-handler';

const payload = {
  name: 'Alicia Tan',
  phone: '+65 9123 4567',
  email: 'alicia@example.com',
  occasion: 'Birthday',
  product: 'Dawn Chorus',
  budget: 'SGD 120-180',
  deliveryDate: '2026-10-12',
  deliveryPostalCode: '238801',
  message: 'Warm colours, please.',
  consent: true,
  pagePath: '/collections/birthday',
  referrer: '',
  utmSource: 'google',
  utmMedium: 'organic',
  utmCampaign: '',
  turnstileToken: 'verified-token',
};

function services(overrides: Partial<EnquiryServices> = {}): EnquiryServices {
  return {
    verifyTurnstile: vi.fn().mockResolvedValue(true),
    hashIp: vi.fn().mockResolvedValue('hashed-ip'),
    countRecent: vi.fn().mockResolvedValue(0),
    store: vi.fn().mockResolvedValue(undefined),
    notify: vi.fn().mockResolvedValue(undefined),
    now: () => new Date('2026-09-26T08:00:00Z'),
    createId: () => 'enq_test123',
    ...overrides,
  };
}

function request(body: unknown) {
  return new Request('https://onlinefloristsingapore.com/api/enquiries', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'CF-Connecting-IP': '203.0.113.10' },
    body: JSON.stringify(body),
  });
}

describe('enquiry handler', () => {
  it('returns 201 after verification, persistence, and notification', async () => {
    const deps = services();
    const response = await createEnquiryHandler(deps)(request(payload));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ id: 'enq_test123', status: 'received' });
    expect(deps.store).toHaveBeenCalledOnce();
    expect(deps.notify).toHaveBeenCalledOnce();
  });

  it('returns field errors without calling external services', async () => {
    const deps = services();
    const response = await createEnquiryHandler(deps)(request({ ...payload, consent: false }));
    expect(response.status).toBe(400);
    expect(deps.verifyTurnstile).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({ error: 'invalid_enquiry', fields: { consent: expect.any(String) } });
  });

  it('rejects failed Turnstile verification', async () => {
    const deps = services({ verifyTurnstile: vi.fn().mockResolvedValue(false) });
    const response = await createEnquiryHandler(deps)(request(payload));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'verification_failed' });
  });

  it('rate limits the fourth recent enquiry from one hashed IP', async () => {
    const deps = services({ countRecent: vi.fn().mockResolvedValue(3) });
    const response = await createEnquiryHandler(deps)(request(payload));
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('900');
    expect(deps.store).not.toHaveBeenCalled();
  });

  it('keeps a stored enquiry successful when email notification fails', async () => {
    const deps = services({ notify: vi.fn().mockRejectedValue(new Error('Resend unavailable')) });
    const response = await createEnquiryHandler(deps)(request(payload));
    expect(response.status).toBe(201);
    expect(deps.store).toHaveBeenCalledOnce();
  });

  it('returns a non-revealing 500 when persistence fails', async () => {
    const deps = services({ store: vi.fn().mockRejectedValue(new Error('D1 unavailable')) });
    const response = await createEnquiryHandler(deps)(request(payload));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'service_unavailable' });
  });
});
