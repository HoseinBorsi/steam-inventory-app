import { NextRequest, NextResponse } from "next/server";

const STEAM_CDN = "https://community.akamai.steamstatic.com/economy/image";
const UA = "Chrome/131.0.0.0";
const COOKIE = "birthtime=0; mature_content=1";

export async function GET(req: NextRequest) {
  const steamId = req.nextUrl.searchParams.get("steamId");
  const appid = req.nextUrl.searchParams.get("appid");
  const page = req.nextUrl.searchParams.get("page") || "";
  const headers = { "Access-Control-Allow-Origin": "*" };

  if (!steamId || !appid)
    return NextResponse.json({ items: [], total: 0 }, { status: 400, headers });

  try {
    const qs = `l=english&count=1000${page ? `&start_assetid=${page}` : ""}`;
    const url = `https://steamcommunity.com/inventory/${steamId}/${appid}/2?${qs}`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Cookie: COOKIE },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json({
        items: [], total: 0,
        note: `Steam returned HTTP ${res.status}`,
      }, { headers });
    }

    const data = await res.json();
    if (!data || data.success !== 1) {
      return NextResponse.json({
        items: [], total: 0,
        note: data?.Error || "Inventory is private or empty.",
      }, { headers });
    }

    const descMap: Record<string, Record<string, unknown>> = {};
    for (const key of Object.keys(data.descriptions || {})) {
      const d = data.descriptions[key];
      if (d?.classid) descMap[`${d.classid}_${d.instanceid}`] = d;
    }

    const assets = data.assets || [];
    const items = assets.map((a: Record<string, string>) => {
      const key = `${a.classid}_${a.instanceid}`;
      const desc = descMap[key] || {};
      const tags = (desc.tags as Array<{ category: string; localized_tag_name: string }>) || [];
      return {
        name: (desc.name || desc.market_hash_name || "Unknown Item") as string,
        icon_url: desc.icon_url ? `${STEAM_CDN}/${desc.icon_url}/128x128f` : "",
        type: (desc.type || "Item") as string,
        quantity: parseInt(a.amount, 10) || 1,
        tradable: desc.tradable === 1,
        marketable: desc.marketable === 1,
        rarity: tags.find((t) => t.category === "Rarity")?.localized_tag_name || "",
      };
    });

    return NextResponse.json({
      items,
      total: data.total_inventory_count || items.length,
      more: data.more_items || 0,
      lastAssetId: data.last_assetid || "",
    }, { headers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ items: [], total: 0, note: msg }, { status: 500, headers });
  }
}
