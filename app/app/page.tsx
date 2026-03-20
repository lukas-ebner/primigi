import { redirect } from "next/navigation";
import Stripe from "stripe";
import { verifyToken } from "@/lib/tokens";
import BleApp from "@/components/BleApp";

interface AppPageProps {
  searchParams: { token?: string; session?: string };
}

export default async function AppPage({ searchParams }: AppPageProps) {
  const { token, session } = searchParams;

  // If no token/session in URL, render client component that checks localStorage
  if (!token || !session) {
    return <BleApp requireAuth />;
  }

  // Verify HMAC token
  const isValid = verifyToken(token, session);
  if (!isValid) {
    redirect("/");
  }

  // Verify session is paid via Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  let stripeSession;
  try {
    stripeSession = await stripe.checkout.sessions.retrieve(session);
  } catch {
    redirect("/");
  }

  if (stripeSession.payment_status !== "paid") {
    redirect("/");
  }

  return <BleApp />;
}
