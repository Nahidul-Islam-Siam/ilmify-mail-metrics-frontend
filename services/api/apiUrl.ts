const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

function normalizeApiBaseUrl(baseUrl: string): string {
  const normalizedBase = (baseUrl || '/api/v1').replace(/\/+$/, '');

  if (normalizedBase.endsWith('/api/v1')) return normalizedBase;
  if (normalizedBase.endsWith('/api')) return `${normalizedBase}/v1`;
  return `${normalizedBase}/api/v1`;
}

export function buildApiUrl(path: string, baseUrl = PUBLIC_API_BASE_URL): string {
  const normalizedBase = normalizeApiBaseUrl(baseUrl);
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
}
