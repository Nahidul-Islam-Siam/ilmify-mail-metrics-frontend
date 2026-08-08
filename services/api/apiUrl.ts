const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function buildApiUrl(path: string, baseUrl = PUBLIC_API_BASE_URL): string {
  return `${baseUrl.replace(/\/+$/, '')}${path}`;
}
