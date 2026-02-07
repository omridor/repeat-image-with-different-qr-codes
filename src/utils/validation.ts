export function isValidUrl(value: string, allowNonHttp: boolean = false): boolean {
  try {
    const url = new URL(value);
    if (allowNonHttp) {
      return true;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function deriveIdFromUrl(url: string, method: 'lastPathSegment' | 'regex', regex?: string): string {
  if (method === 'lastPathSegment') {
    try {
      const urlObj = new URL(url);
      const segments = urlObj.pathname.split('/').filter(s => s.length > 0);
      return segments[segments.length - 1] || '';
    } catch {
      return '';
    }
  } else if (method === 'regex' && regex) {
    try {
      const match = url.match(new RegExp(regex));
      return match?.[1] || '';
    } catch {
      return '';
    }
  }
  return '';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
