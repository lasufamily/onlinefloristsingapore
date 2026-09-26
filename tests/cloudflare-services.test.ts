import { describe, expect, it } from 'vitest';
import { formatEnquiryEmail, hashIpAddress } from '../src/lib/cloudflare-services';
import type { StoredEnquiry } from '../src/lib/enquiry-handler';

const enquiry: StoredEnquiry = {
  id: 'enq_test123',
  name: '<script>Alicia</script>',
  phone: '+6591234567',
  email: 'alicia@example.com',
  occasion: 'Birthday',
  product: 'Dawn Chorus',
  budget: 'SGD 120-180',
  deliveryDate: '2026-10-12',
  deliveryPostalCode: '238801',
  message: 'Warm & bright',
  consent: true,
  pagePath: '/collections/birthday',
  referrer: null,
  utmSource: 'google',
  utmMedium: 'organic',
  utmCampaign: null,
  ipHash: 'hashed-ip',
  createdAt: '2026-09-26T08:00:00.000Z',
};

describe('Cloudflare enquiry services', () => {
  it('renders notification HTML without executable user markup', () => {
    const email = formatEnquiryEmail(enquiry);
    expect(email.subject).toContain('enq_test123');
    expect(email.html).toContain('&lt;script&gt;Alicia&lt;/script&gt;');
    expect(email.html).not.toContain('<script>Alicia</script>');
    expect(email.text).toContain('Warm & bright');
  });

  it('hashes one IP deterministically and separates different IPs', async () => {
    const first = await hashIpAddress('203.0.113.10', 'secret-value');
    const repeated = await hashIpAddress('203.0.113.10', 'secret-value');
    const different = await hashIpAddress('203.0.113.11', 'secret-value');
    expect(first).toBe(repeated);
    expect(first).not.toBe(different);
    expect(first).not.toContain('203.0.113.10');
  });
});
