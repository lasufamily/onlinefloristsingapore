const canonicalHostname = 'onlinefloristsingapore.com';

export function canonicalHostRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname !== `www.${canonicalHostname}`) return null;

  url.protocol = 'https:';
  url.hostname = canonicalHostname;
  url.port = '';
  return Response.redirect(url, 301);
}
