import type { EnquiryServices, StoredEnquiry } from './enquiry-handler';

export interface CloudflareEnv {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  ENQUIRY_TO_EMAIL: string;
  IP_HASH_SECRET: string;
}

export function formatEnquiryEmail(_enquiry: StoredEnquiry) {
  const rows: Array<[string, string | null]> = [
    ['Reference', _enquiry.id],
    ['Name', _enquiry.name],
    ['Phone', _enquiry.phone],
    ['Email', _enquiry.email],
    ['Occasion', _enquiry.occasion],
    ['Product', _enquiry.product],
    ['Budget', _enquiry.budget],
    ['Delivery date', _enquiry.deliveryDate],
    ['Postal code', _enquiry.deliveryPostalCode],
    ['Message', _enquiry.message],
    ['Source page', _enquiry.pagePath],
    ['UTM source', _enquiry.utmSource],
    ['UTM medium', _enquiry.utmMedium],
    ['UTM campaign', _enquiry.utmCampaign],
  ];
  const present = rows.filter((row): row is [string, string] => Boolean(row[1]));
  return {
    subject: `New florist enquiry ${_enquiry.id}`,
    html: `<h1>New florist enquiry</h1><table>${present
      .map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
      .join('')}</table>`,
    text: present.map(([label, value]) => `${label}: ${value}`).join('\n'),
  };
}

export async function hashIpAddress(_ip: string, _secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(_secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(_ip));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

export function createCloudflareServices(
  env: CloudflareEnv,
  fetcher: typeof fetch = fetch,
): EnquiryServices {
  return {
    async verifyTurnstile(token, ip) {
      const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip });
      const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body,
      });
      if (!response.ok) return false;
      const result = (await response.json()) as { success?: boolean };
      return result.success === true;
    },
    hashIp(ip) {
      return hashIpAddress(ip, env.IP_HASH_SECRET);
    },
    async countRecent(ipHash, since) {
      const row = await env.DB.prepare(
        'SELECT COUNT(*) AS total FROM enquiries WHERE ip_hash = ?1 AND created_at >= ?2',
      )
        .bind(ipHash, since)
        .first<{ total: number }>();
      return Number(row?.total ?? 0);
    },
    async store(enquiry) {
      await env.DB.prepare(
        `INSERT INTO enquiries (
          id, name, phone, email, occasion, product, budget, delivery_date,
          delivery_postal_code, message, consent, page_path, referrer,
          utm_source, utm_medium, utm_campaign, ip_hash, created_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)`,
      )
        .bind(
          enquiry.id,
          enquiry.name,
          enquiry.phone,
          enquiry.email,
          enquiry.occasion,
          enquiry.product,
          enquiry.budget,
          enquiry.deliveryDate,
          enquiry.deliveryPostalCode,
          enquiry.message,
          enquiry.consent ? 1 : 0,
          enquiry.pagePath,
          enquiry.referrer,
          enquiry.utmSource,
          enquiry.utmMedium,
          enquiry.utmCampaign,
          enquiry.ipHash,
          enquiry.createdAt,
        )
        .run();
    },
    async notify(enquiry) {
      const email = formatEnquiryEmail(enquiry);
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: [env.ENQUIRY_TO_EMAIL],
          subject: email.subject,
          html: email.html,
          text: email.text,
        }),
      });
      if (!response.ok) throw new Error(`Resend returned ${response.status}`);
    },
    now: () => new Date(),
    createId: () => `enq_${crypto.randomUUID().replaceAll('-', '').slice(0, 16)}`,
  };
}
