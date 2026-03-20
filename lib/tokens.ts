import crypto from "crypto";

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
