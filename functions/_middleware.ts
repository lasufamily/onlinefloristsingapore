import { canonicalHostRedirect } from '../src/lib/host-redirect';

export const onRequest: PagesFunction = async ({ request, next }) => {
  return canonicalHostRedirect(request) ?? next();
};
