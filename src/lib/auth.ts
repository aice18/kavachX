// ── KavachX Session Auth ────────────────────────────────────────────────
// For demo purposes, credentials are stored client-side.
// In production, this would be a proper JWT/OAuth2 flow.

const TOKEN_KEY = 'kavachx_soc_token';
const USER_KEY = 'kavachx_soc_user';
export const DEMO_TOKEN = 'kavachx-soc-token-2024';

const VALID_CREDENTIALS: Record<string, { password: string; role: string; name: string }> = {
  'ADMIN_CISO_01': { password: 'kavachx2024', role: 'CISO', name: 'Arjun Mehta' },
  'SOC_ANALYST_01': { password: 'analyst2024', role: 'SOC Analyst', name: 'Priya Sharma' },
  'demo': { password: 'demo', role: 'Demo User', name: 'Demo Account' },
};

export interface SocUser {
  id: string;
  role: string;
  name: string;
}

export function login(id: string, password: string): { success: boolean; error?: string } {
  const credential = VALID_CREDENTIALS[id];
  if (!credential) {
    return { success: false, error: 'SOC ID not found in registry.' };
  }
  if (credential.password !== password) {
    return { success: false, error: 'Invalid passphrase. Access denied.' };
  }
  sessionStorage.setItem(TOKEN_KEY, DEMO_TOKEN);
  sessionStorage.setItem(USER_KEY, JSON.stringify({ id, role: credential.role, name: credential.name }));
  return { success: true };
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(TOKEN_KEY) === DEMO_TOKEN;
}

export function getCurrentUser(): SocUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function getAuthHeaders(): Record<string, string> {
  return { 'x-kavachx-token': DEMO_TOKEN };
}
