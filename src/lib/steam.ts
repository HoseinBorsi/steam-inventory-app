const STEAM_API_KEY = process.env.STEAM_API_KEY!;
const STEAM_API_BASE = "https://api.steampowered.com";

// --- Steam OpenID Login ---
export function getSteamLoginUrl() {
  const host = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": `${host}/api/auth/callback`,
    "openid.realm": `${host}/`,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `https://steamcommunity.com/openid/login?${params}`;
}

export async function verifySteamLogin(params: URLSearchParams) {
  const claimedId = params.get("openid.claimed_id") || "";
  const steamId = claimedId.match(/\/(\d+)$/)?.[1] || null;
  return steamId;
}

// --- Steam API ---
export async function getPlayerSummary(steamId: string) {
  const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamId}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.response?.players?.[0] || null;
}

export async function getOwnedGames(steamId: string) {
  const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
  const res = await fetch(url);
  const data = await res.json();
  return data.response?.games || [];
}

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url: string;
  img_logo_url: string;
  has_community_visible_stats?: boolean;
}

export function getGameImageUrl(appid: number, hash: string) {
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${hash}.jpg`;
}

export function getGameHeaderImage(appid: number) {
  return `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`;
}
