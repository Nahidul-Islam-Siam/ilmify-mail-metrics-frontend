export const AUTH_MARKER_COOKIE = 'mm_authenticated';

export function hasAuthMarker(value: string | undefined): boolean {
  return value === '1';
}

function secureSuffix(secure: boolean): string {
  return secure ? '; Secure' : '';
}

export function authMarkerCookie(secure: boolean): string {
  return `${AUTH_MARKER_COOKIE}=1; Path=/; Max-Age=2592000; SameSite=Lax${secureSuffix(secure)}`;
}

export function clearAuthMarkerCookie(secure: boolean): string {
  return `${AUTH_MARKER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secureSuffix(secure)}`;
}
