export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidSlug(slug: string): boolean {
  if (slug.length < 3 || slug.length > 50) {
    return false;
  }
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isStrongPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

export function isValidUsername(username: string): boolean {
  if (username.length < 3 || username.length > 30) {
    return false;
  }
  const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return usernameRegex.test(username);
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(cleanedPhone);
}

const parseMetadata = (metadata: unknown) => {
  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata);
    } catch {
      return null;
    }
  }
  return metadata;
};

export const isPersonalOrganization = (org: { metadata: unknown }) => {
  const metadata = parseMetadata(org.metadata);
  const isPersonalValue = metadata?.isPersonal;
  return isPersonalValue === true || isPersonalValue === 'true';
};

export const isSoleOwner = (
  members: Array<{ role: string; userId?: string }>,
  userId: string
) => {
  const owners = members.filter((m) => m.role === 'owner');
  return owners.length === 1 && owners[0]?.userId === userId;
};
