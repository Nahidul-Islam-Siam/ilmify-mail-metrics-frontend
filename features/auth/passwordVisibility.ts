export function togglePasswordVisibility(visible: boolean): boolean {
  return !visible;
}

export function getPasswordInputType(visible: boolean): 'text' | 'password' {
  return visible ? 'text' : 'password';
}
