const ADMIN_GATE_STORAGE_KEY = "axevora-admin-gate";
const ADMIN_GATE_TTL_MS = 1000 * 60 * 60 * 12;

interface AdminGateSession {
  expiresAt: number;
}

const getGateHash = () => (import.meta.env.VITE_ADMIN_GATE_HASH || "").trim().toLowerCase();

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

export const hashSecret = async (value: string) => {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toHex(digest);
};

export const isAdminGateConfigured = () => getGateHash().length > 0;

export const isAdminGateUnlocked = () => {
  if (typeof window === "undefined") return false;

  try {
    const raw = window.sessionStorage.getItem(ADMIN_GATE_STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as AdminGateSession;
    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
      window.sessionStorage.removeItem(ADMIN_GATE_STORAGE_KEY);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to parse admin gate session", error);
    return false;
  }
};

export const unlockAdminGate = () => {
  if (typeof window === "undefined") return;
  const session: AdminGateSession = {
    expiresAt: Date.now() + ADMIN_GATE_TTL_MS
  };
  window.sessionStorage.setItem(ADMIN_GATE_STORAGE_KEY, JSON.stringify(session));
};

export const lockAdminGate = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_GATE_STORAGE_KEY);
};

export const verifyAdminSecret = async (secret: string) => {
  const configuredHash = getGateHash();
  if (!configuredHash) return false;
  const incomingHash = await hashSecret(secret.trim());
  return incomingHash === configuredHash;
};
