import { NextRequest, NextResponse } from "next/server";

const STEAM_CDN = "https://community.akamai.steamstatic.com/economy/image";
const UA = "Chrome/131.0.0.0";
const COOKIE = "birthtime=0; mature_content=1";

export async function GET(req: NextRequest) {
  const steamId = req.nextUrl.searchParams.get("steamId");
  const appid = req.nextUrl.searchParams.get("appid");
  const headers = { "Access-Control-Allow-Origin": "*" };

  if (!steamId || !appid)
    return NextResponse.json({ items: [] }, { status: 400, headers });

  try {
    // Steam blocks requests without a cookie — even a dummy one works
    const url = `https://steamcommunity.com/inventory/${steamId}/${appid}/2?l=english&count=2000`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Cookie: COOKIE },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json({
        items: [],
        note: `Steam returned HTTP ${res.status}`,
      }, { headers });
    }

    const data = await res.json();

    // success: 1 (number), not boolean
    if (!data || data.success !== 1) {
      return NextResponse.json({
        items: [],
        note: data?.Error || "Inventory is private or empty.",
      }, { headers });
    }

    // Build description lookup: classid_instanceid -> desc
    const descMap: Record<string, { name?: string; icon_url?: string; type?: string }> = {};
    const descriptions = data.descriptions || {};
    for (const key of Object.keys(descriptions)) {
      const d = descriptions[key];
      if (d?.classid) descMap[`${d.classid}_${d.instanceid}`] = d;
    }

    const assets = data.assets || [];
    const items = assets.map((a: { classid: string; instanceid: string; amount: string }) => {
      const key = `${a.classid}_${a.instanceid}`;
      const desc = descMap[key] || {};
      return {
        name: desc.name || "Unknown Item",
        icon_url: desc.icon_url ? `${STEAM_CDN}/${desc.icon_url}/128x128f` : "",
        type: desc.type || "Item",
        quantity: parseInt(a.amount, 10) || 1,
      };
    });

    return NextResponse.json({ items }, { headers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ items: [], note: msg }, { status: 500, headers });
  }
}
