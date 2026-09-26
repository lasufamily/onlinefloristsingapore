import { describe, expect, it } from 'vitest';
import { parseEnquiry } from '../src/lib/enquiries';

const validEnquiry = {
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
  referrer: 'https://www.google.com/',
  utmSource: 'google',
  utmMedium: 'organic',
  utmCampaign: '',
  turnstileToken: 'test-token',
};

describe('parseEnquiry', () => {
  it('normalizes a complete valid enquiry', () => {
    const result = parseEnquiry(validEnquiry, new Date('2026-09-26T08:00:00Z'));
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.phone).toBe('+6591234567');
    expect(result.data.deliveryPostalCode).toBe('238801');
    expect(result.data.utmCampaign).toBeNull();
  });

  it('rejects missing consent and contact details', () => {
    const result = parseEnquiry({ ...validEnquiry, consent: false, email: '', phone: '' });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors).toMatchObject({ consent: expect.any(String), contact: expect.any(String) });
  });

  it('rejects invalid Singapore postal codes and dates in the past', () => {
    const result = parseEnquiry(
      { ...validEnquiry, deliveryPostalCode: '123', deliveryDate: '2026-09-25' },
      new Date('2026-09-26T08:00:00Z'),
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors).toMatchObject({ deliveryPostalCode: expect.any(String), deliveryDate: expect.any(String) });
  });

  it('rejects oversized free-text fields', () => {
    const result = parseEnquiry({ ...validEnquiry, message: 'x'.repeat(2001) });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.message).toBeDefined();
  });
});
