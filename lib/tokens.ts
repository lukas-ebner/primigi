import crypto from "crypto";

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateShortCode(): string {
  const bytes = crypto.randomBytes(6);
  return Array.from(bytes).map((b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

export function generateToken(sessionId: string): string {
  const secret = process.env.APP_SECRET;
  if (!secret) throw new Error("APP_SECRET is not set");
  return crypto
    .createHmac("sha256", secret)
    .update(sessionId)
    .digest("hex");
}

export function verifyToken(token: string, sessionId: string): boolean {
  const secret = process.env.APP_SECRET;
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(sessionId)
    .digest("hex");
  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
