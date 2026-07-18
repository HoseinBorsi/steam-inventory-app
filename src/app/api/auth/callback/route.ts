import { NextRequest, NextResponse } from "next/server";
import { verifySteamLogin, getPlayerSummary } from "@/lib/steam";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const steamId = await verifySteamLogin(params);
  if (!steamId) return NextResponse.redirect(new URL("/?error=login_failed", req.url));

  const player = await getPlayerSummary(steamId);
  const avatar = player?.avatarmedium || "";
  const name = player?.personaname || "Unknown";
  const profileUrl = player?.profileurl || "";

  // Store in session cookie (simple approach)
  const userData = JSON.stringify({ steamId, name, avatar, profileUrl });
  const encoded = Buffer.from(userData).toString("base64");

  const res = NextResponse.redirect(new URL("/inventory", req.url));
  res.cookies.set("steam_user", encoded, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24h
  });
  return res;
}
