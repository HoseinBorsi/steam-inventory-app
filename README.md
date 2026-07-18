# 🎮 Steam Inventory App

A fast, bilingual web application to browse your Steam game library and inspect inventory items per game — no API key required for inventory browsing.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/i18n-EN_|_FA_|_RU-8b5cf6" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

[📖 فارسی](README.fa.md) | [📖 Русский](README.ru.md)

---

## ✨ Features

- **Steam OpenID login** — secure, no passwords stored
- **Game library browser** — see all your owned games with playtime
- **Inventory inspector** — click any game to view your items inside
- **Search & sort** — filter by name, sort by playtime or A-Z
- **Multilingual UI** — English, فارسی, Русский
- **Responsive dark theme** — desktop & mobile
- **No API key** needed for inventory — public Steam Community endpoint

---

## 🏗️ How It Works

| Feature | API Used | Auth |
|---------|----------|------|
| Login | Steam OpenID | — |
| Player profile | `ISteamUser/GetPlayerSummaries` | API key |
| Game library | `IPlayerService/GetOwnedGames` | API key |
| **Inventory items** | `steamcommunity.com/inventory/{id}/{appid}/2` | Cookie |

The inventory endpoint returns `{ assets, descriptions, success: 1, total_inventory_count }`. Assets map to descriptions via the composite key `classid_instanceid`. A `Cookie: birthtime=0; mature_content=1` header bypasses Steam's bot detection (HTTP 403).

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

Open `http://localhost:3000`, log in with Steam, and start browsing.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # OpenID callback
│   │   ├── games/route.ts            # Owned games (API key)
│   │   ├── inventory/route.ts        # Inventory items (public)
│   │   └── user/route.ts             # Session
│   ├── inventory/page.tsx            # Main inventory UI
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Login page
├── components/
│   ├── GameCard.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   └── ui/                           # shadcn-style primitives
├── i18n/
│   ├── en.json                       # English
│   ├── fa.json                       # Persian (فارسی)
│   ├── ru.json                       # Russian (Русский)
│   └── index.ts                      # Translation engine
└── lib/
    └── steam.ts                      # Steam API helpers
```

---

## 🌍 Regions with Restricted Access

If `steamcommunity.com` is blocked in your region, the app still works as long as your **deployment server** can reach Steam (inventory fetch is server-side, not client-side).

---

## 📄 License

MIT © [HoseinBorsi](https://github.com/HoseinBorsi)
