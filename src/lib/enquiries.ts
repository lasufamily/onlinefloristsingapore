import { z } from 'zod';

export type Enquiry = {
  name: string;
  phone: string | null;
  email: string | null;
  occasion: string | null;
  product: string | null;
  budget: string | null;
  deliveryDate: string;
  deliveryPostalCode: string;
  message: string | null;
  consent: true;
  pagePath: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  turnstileToken: string;
};

export type EnquiryParseResult =
  | { success: true; data: Enquiry }
  | { success: false; errors: Record<string, string> };

const optionalText = (max: number) => z.string().trim().max(max).optional().default('');

function createEnquirySchema(now: Date) {
  return z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80),
  phone: optionalText(30),
  email: optionalText(160).refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email.'),
  occasion: optionalText(80),
  product: optionalText(120),
  budget: optionalText(80),
  deliveryDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid delivery date.'),
  deliveryPostalCode: z.string().trim().regex(/^\d{6}$/, 'Enter a 6-digit Singapore postal code.'),
  message: optionalText(2000),
  consent: z.literal(true, { error: 'Consent is required.' }),
  pagePath: optionalText(300),
  referrer: optionalText(500),
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(100),
  turnstileToken: z.string().trim().min(1, 'Verification is required.').max(2048),
  }).superRefine((value, context) => {
    if (normalizePhone(value.phone) === '' && value.email === '') {
      context.addIssue({ code: 'custom', path: ['contact'], message: 'Enter a phone number or email address.' });
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.deliveryDate) && value.deliveryDate < now.toISOString().slice(0, 10)) {
      context.addIssue({ code: 'custom', path: ['deliveryDate'], message: 'Delivery date cannot be in the past.' });
    }
  });
}

function nullable(value: string): string | null {
  return value === '' ? null : value;
}

function normalizePhone(value: string): string {
  return value.replace(/[^+\d]/g, '').replace(/(?!^)\+/g, '');
}

export function parseEnquiry(input: unknown, now = new Date()): EnquiryParseResult {
  const parsed = createEnquirySchema(now).safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      errors[key] ??= issue.message;
    }
    if (typeof input === 'object' && input !== null) {
      const raw = input as Record<string, unknown>;
      const phone = typeof raw.phone === 'string' ? normalizePhone(raw.phone) : '';
      const email = typeof raw.email === 'string' ? raw.email.trim() : '';
      if (phone === '' && email === '') {
        errors.contact = 'Enter a phone number or email address.';
      }
    }
    return { success: false, errors };
  }

  const value = parsed.data;
  const phone = normalizePhone(value.phone);

  return {
    success: true,
    data: {
      name: value.name,
      phone: nullable(phone),
      email: nullable(value.email.toLowerCase()),
      occasion: nullable(value.occasion),
      product: nullable(value.product),
      budget: nullable(value.budget),
      deliveryDate: value.deliveryDate,
      deliveryPostalCode: value.deliveryPostalCode,
      message: nullable(value.message),
      consent: true,
      pagePath: nullable(value.pagePath),
      referrer: nullable(value.referrer),
      utmSource: nullable(value.utmSource),
      utmMedium: nullable(value.utmMedium),
      utmCampaign: nullable(value.utmCampaign),
      turnstileToken: value.turnstileToken,
    },
  };
}
