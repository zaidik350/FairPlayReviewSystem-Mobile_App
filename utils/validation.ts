/**
 * Form-level validators used with useForm hook.
 */

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
}

export function validatePassword(password: string, minLength = 6): string | null {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return null;
}

export function validateRequired(value: string, fieldName = 'This field'): string | null {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
}

export function validatePasswordMatch(password: string, confirm: string): string | null {
  if (password !== confirm) return 'Passwords do not match';
  return null;
}
