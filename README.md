# 🎮 Steam Inventory App

A fast, multilingual PWA to browse your Steam game library and inspect inventory items per game. No API key required for inventory browsing.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/i18n-EN_|_FA_|_RU-8b5cf6" />
  <img src="https://img.shields.io/badge/PWA-ready-06b6d4" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

[📖 فارسی](README.fa.md) | [📖 Русский](README.ru.md)

---

## ✨ Features

- **Steam OpenID login** — secure, no passwords stored
- **Game library browser** — all owned games with playtime stats
- **Inventory inspector** — click any game to see its items
- **3 display modes** — Grid / List / Compact toggle
- **Smart filters** — All items, Tradable only, Marketable only
- **Sort options** — by Name, Quantity, or Rarity
- **Aggregate view** — group identical items with count badge (×5)
- **Live language switch** — English, فارسی, Русский (persists across sessions)
- **PWA installable** — works as a standalone app on Windows & Android
- **Dark theme** — responsive, works on all screen sizes
- **No API key** for inventory — public Steam Community endpoint

---

## 🏗️ How It Works

| Feature | API / Method | Auth |
|---------|-------------|------|
| Login | Steam OpenID | — |
| Player profile | `ISteamUser/GetPlayerSummaries` | API key |
| Game library | `IPlayerService/GetOwnedGames` | API key |
| **Inventory** | `steamcommunity.com/inventory/{id}/{appid}/2` | Cookie |

The inventory endpoint returns `{ success: 1, assets[], descriptions{}, total_inventory_count, more_items, last_assetid }`. Items are mapped to their descriptions via `classid_instanceid` composite key. A `Cookie: birthtime=0; mature_content=1` header bypasses Steam's bot detection.

Pagination is supported — when `more_items > 0`, the next request uses `start_assetid=last_assetid`.

Item images are served from Steam's Akamai CDN:
```
https://community.akamai.steamstatic.com/economy/image/{icon_url}/128x128f
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Steam Web API key](https://steamcommunity.com/dev/apikey) (free)

### Setup

```bash
git clone https://github.com/HoseinBorsi/steam-inventory-app.git
cd steam-inventory-app
npm install
```

Create `.env.local`:
```env
STEAM_API_KEY=your_api_key_here
NEXT_PUBLIC_HOST=http://localhost:3000
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000` → Login with Steam → Browse inventory.

### Install as App (PWA)

Open the site in Chrome/Edge → click the install icon in the address bar → the app runs standalone with its own window.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # Steam OpenID callback
│   │   ├── games/route.ts            # Owned games (requires API key)
│   │   ├── inventory/route.ts        # Public inventory + pagination
│   │   └── user/route.ts             # Session cookie
│   ├── inventory/page.tsx            # Full inventory UI
│   ├── layout.tsx                    # Root layout + PWA
│   └── page.tsx                      # Login page
├── components/
│   ├── GameCard.tsx                  # Game card with header image
│   ├── Navbar.tsx                    # Navbar + language switcher
│   ├── SearchBar.tsx                 # Reusable search input
│   └── ui/                           # shadcn-style Button
├── i18n/
│   ├── en.json / fa.json / ru.json   # Translation files
│   └── index.tsx                     # React Context locale provider
└── lib/
    └── steam.ts                      # Steam API helpers
public/
├── manifest.json                     # PWA manifest
├── sw.js                             # Service worker (offline cache)
└── icons/icon.svg                    # App icon
```

---

## 📄 License

MIT © [HoseinBorsi](https://github.com/HoseinBorsi)
