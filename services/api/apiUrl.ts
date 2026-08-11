const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export function buildApiUrl(path: string, baseUrl = PUBLIC_API_BASE_URL): string {
  const normalizedBase = (baseUrl || '/api/v1').replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
}
