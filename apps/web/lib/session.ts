import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "whoopy_session";

export interface SessionPayload {
  accessToken: string;
  expiresAt: string;
  profile: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
  refreshToken: string;
}

// Helper to base64url decode
const base64urlDecode = (str: string): string => {
  let base64 = str.replaceAll("-", "+").replaceAll("_", "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
};

// Secret key import helper
const getSigningKey = (secret: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign", "verify"]
  );
};

// Generate JWT token
export const encrypt = async (
  payload: unknown,
  secret: string
): Promise<string> => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header))
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
  const encodedPayload = btoa(JSON.stringify(payload))
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");

  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  const key = await getSigningKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(tokenInput)
  );

  const signatureArray = [...new Uint8Array(signatureBuffer)];
  const signatureBase64 = btoa(String.fromCodePoint(...signatureArray))
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");

  return `${tokenInput}.${signatureBase64}`;
};

// Verify and decode JWT token
export const decrypt = async (
  token: string,
  secret: string
): Promise<unknown> => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signatureBase64] = parts;
  const tokenInput = `${encodedHeader}.${encodedPayload}`;

  const signatureBin = base64urlDecode(signatureBase64);
  const signatureBytes = new Uint8Array(signatureBin.length);
  for (let i = 0; i < signatureBin.length; i += 1) {
    const codePoint = signatureBin.codePointAt(i);
    signatureBytes[i] = codePoint ?? 0;
  }

  const key = await getSigningKey(secret);
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(tokenInput)
  );

  if (!isValid) {
    return null;
  }

  try {
    const payloadBin = base64urlDecode(encodedPayload);
    const bytes = new Uint8Array(payloadBin.length);
    for (let i = 0; i < payloadBin.length; i += 1) {
      const codePoint = payloadBin.codePointAt(i);
      bytes[i] = codePoint ?? 0;
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
};

export const setSession = async (payload: SessionPayload) => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }

  // Session lasts 30 days
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const token = await encrypt(payload, secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const getSession = async (): Promise<SessionPayload | null> => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const payload = (await decrypt(token, secret)) as SessionPayload | null;
  if (!payload) {
    return null;
  }

  return payload;
};

export const clearSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
};
