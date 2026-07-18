import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("steam_user")?.value;
  if (!cookie) return NextResponse.json({ user: null });
  try {
    const user = JSON.parse(Buffer.from(cookie, "base64").toString());
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("steam_user", "", { maxAge: 0 });
  return res;
}
