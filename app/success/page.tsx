import { redirect } from "next/navigation";
import Stripe from "stripe";
import { generateToken } from "@/lib/tokens";
import SuccessClient from "./SuccessClient";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect("/");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <div
        style={{
          background: "#08080f",
          color: "#e2e8f0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <h1 style={{ color: "#38bdf8", marginBottom: 12 }}>
            Zahlung wird verarbeitet...
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Bitte warte einen Moment. Diese Seite nicht schließen.
          </p>
        </div>
      </div>
    );
  }

  const token = generateToken(sessionId);
  const code = (session.metadata?.code ?? "").toUpperCase();

  return <SuccessClient token={token} sessionId={sessionId} code={code} />;
}
