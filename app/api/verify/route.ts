import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const session = searchParams.get("session");

  if (!token || !session) {
    return NextResponse.json({ valid: false });
  }

  const valid = verifyToken(token, session);
  return NextResponse.json({ valid });
}
