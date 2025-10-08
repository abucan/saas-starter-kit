export function sanitizeString(input: unknown): string {
  if (input == null) {
    return '';
  }

  return String(input).trim().replace(/\0/g, '');
}

export function sanitizeEmail(email: unknown): string {
  const sanitized = sanitizeString(email).toLowerCase();

  if (!sanitized.includes('@')) {
    return '';
  }

  return sanitized;
}

export function sanitizeSlug(slug: unknown): string {
  return sanitizeString(slug)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizeHtml(html: unknown): string {
  return sanitizeString(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeNumber(input: unknown): number | null {
  if (input == null) {
    return null;
  }

  const num = typeof input === 'number' ? input : Number(input);

  if (isNaN(num)) {
    return null;
  }

  return num;
}
