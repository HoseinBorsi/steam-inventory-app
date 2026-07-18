import { NextRequest, NextResponse } from "next/server";
import { getOwnedGames } from "@/lib/steam";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("steam_user")?.value;
  if (!cookie) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const { steamId } = JSON.parse(Buffer.from(cookie, "base64").toString());
    const games = await getOwnedGames(steamId);
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
