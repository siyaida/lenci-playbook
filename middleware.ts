export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/((?!api/auth|auth/login|auth/register|_next/static|_next/image|favicon.ico).*)']
};
