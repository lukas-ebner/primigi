import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ valid: false, error: "Ungültiger Zugangscode" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-01-27.acacia" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ valid: false, error: "Zahlung nicht abgeschlossen" });
    }
    const token = generateToken(sessionId);
    return NextResponse.json({ valid: true, token });
  } catch {
    return NextResponse.json({ valid: false, error: "Zugangscode nicht gefunden" });
  }
}
