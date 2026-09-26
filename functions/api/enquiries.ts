import { createCloudflareServices, type CloudflareEnv } from '../../src/lib/cloudflare-services';
import { createEnquiryHandler } from '../../src/lib/enquiry-handler';

export const onRequestPost: PagesFunction<CloudflareEnv> = async ({ request, env }) => {
  return createEnquiryHandler(createCloudflareServices(env))(request);
};

export const onRequestGet: PagesFunction<CloudflareEnv> = async () => {
  return Response.json({ error: 'method_not_allowed' }, { status: 405, headers: { allow: 'POST' } });
};
