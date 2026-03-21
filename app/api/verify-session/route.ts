import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateToken } from "@/lib/tokens";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, error: "Kein Code angegeben" }, { status: 400 });
  }

  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(normalized)) {
    return NextResponse.json({ valid: false, error: "Ungültiger Code — bitte 6 Zeichen eingeben" });
  }

  // Admin bypass via ADMIN_CODE env variable
  const adminCode = process.env.ADMIN_CODE?.toUpperCase();
  if (adminCode && normalized === adminCode) {
    const token = generateToken("admin-" + adminCode);
    return NextResponse.json({ valid: true, token, sessionId: "admin-" + adminCode });
  }

  try {
    // stripe-node v16 types don't expose .search() on checkout sessions,
    // but the underlying Stripe API supports it at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await (stripe.checkout.sessions as any).search({
      query: `metadata["code"]:"${normalized}"`,
      limit: 5,
    });

    const paid = (results.data as { id: string; payment_status: string }[])
      .find((s) => s.payment_status === "paid");
    if (!paid) {
      return NextResponse.json({ valid: false, error: "Code nicht gefunden oder Zahlung nicht abgeschlossen" });
    }

    const token = generateToken(paid.id);
    return NextResponse.json({ valid: true, token, sessionId: paid.id });
  } catch (err) {
    console.error("verify-session error", err);
    return NextResponse.json({ valid: false, error: "Serverfehler — bitte erneut versuchen" });
  }
}
