const AUTH_KEY = "henley_admin_auth";
const ADMIN_PASSWORD = "henley2024"; // In production, this would be an env variable

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}
