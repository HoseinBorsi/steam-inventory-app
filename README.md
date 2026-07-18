# 🎮 Steam Inventory App

A fast, bilingual (English / فارسی) web application to browse your Steam game library and inspect inventory items per game — no API key required for inventory browsing.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

---

## ✨ Features

- **Steam OpenID login** — secure, no passwords stored
- **Game library browser** — see all your owned games with playtime
- **Inventory inspector** — click any game to view your items inside
- **Search & sort** — filter by name, sort by playtime or alphabetically
- **Bilingual UI** — English and فارسی (Farsi), auto-detected
- **Responsive dark theme** — works on desktop & mobile
- **No API key needed** for inventory — uses Steam's public Community endpoint

---

## 🏗️ How It Works

| Feature | API Used | Auth Required |
|---------|----------|---------------|
| Login | Steam OpenID | No |
| Player profile | `ISteamUser/GetPlayerSummaries` | API key |
| Game library | `IPlayerService/GetOwnedGames` | API key |
| **Inventory items** | `steamcommunity.com/inventory/{id}/{appid}/2` | **No** |

The inventory endpoint returns `{ assets, descriptions, success, total_inventory_count }`. Assets are mapped to descriptions via `classid_instanceid` composite key. A `Cookie: birthtime=0; mature_content=1` header is required to bypass Steam's bot detection (403).

Item images are served from Steam's Akamai CDN:
```
https://community.akamai.steamstatic.com/economy/image/{icon_url}/128x128f
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Steam Web API key](https://steamcommunity.com/dev/apikey) (free — for player profile & game list)

### Setup

```bash
# Clone
git clone https://github.com/HoseinBorsi/steam-inventory-app.git
cd steam-inventory-app

# Install
npm install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:
```env
STEAM_API_KEY=your_api_key_here
NEXT_PUBLIC_HOST=http://localhost:3000
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`, click **Login with Steam**, authorize, and start browsing.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # OpenID callback
│   │   ├── games/route.ts            # Owned games (API key)
│   │   ├── inventory/route.ts        # Inventory items (public)
│   │   └── user/route.ts             # Session user
│   ├── inventory/page.tsx            # Main inventory UI
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Login page
├── components/
│   ├── GameCard.tsx                  # Game card with header image
│   ├── Navbar.tsx                    # Top navigation + user menu
│   ├── SearchBar.tsx                 # Reusable search input
│   └── ui/                           # shadcn-style primitives
├── i18n/
│   ├── en.json                       # English strings
│   └── index.ts                      # Translation hook
└── lib/
    └── steam.ts                      # Steam API helpers
```

---

## 🌍 Regions with Restricted Access

Steam Community (`steamcommunity.com`) may be blocked in some regions. The inventory API runs **server-side** — if your deployment server can reach Steam, the app works. For local development in restricted regions, ensure your network can resolve Steam domains.

---

## 📄 License

MIT © [HoseinBorsi](https://github.com/HoseinBorsi)

---

# 🎮 اپلیکیشن اینونتوری استیم

یه برنامه تحت وب سریع و دو زبانه (فارسی / English) برای دیدن بازی‌های استیم و آیتم‌های داخل هر بازی. بدون نیاز به API Key برای بخش آیتم‌ها.

## ✨ امکانات

- **ورود با OpenID استیم** — امن، بدون ذخیره رمز عبور
- **مشاهده کتابخانه بازی‌ها** — همه بازی‌هایی که داری با ساعت بازی
- **بازرسی آیتم‌ها** — روی هر بازی کلیک کن، آیتم‌هاش رو ببین
- **جستجو و مرتب‌سازی** — فیلتر بر اساس اسم، مرتب‌سازی بر اساس زمان بازی یا الفبا
- **رابط کاربری دو زبانه** — فارسی و انگلیسی
- **تم تاریک واکنش‌گرا** — کار روی دسکتاپ و موبایل
- **بدون نیاز به API Key** برای آیتم‌ها

## 🏗️ نحوه کار

برای دریافت آیتم‌ها از API عمومی خود استیم استفاده می‌شه:
```
steamcommunity.com/inventory/{steamId}/{appId}/2
```
این API جواب رو به صورت `{ assets, descriptions }` برمی‌گردونه. با کلید ترکیبی `classid_instanceid` آیتم‌ها به توضیحاتشون وصل می‌شن. هدر `Cookie: birthtime=0; mature_content=1` برای رد شدن از bot detection استیم (خطای ۴۰۳) لازمه.

## 🚀 راه‌اندازی

```bash
git clone https://github.com/HoseinBorsi/steam-inventory-app.git
cd steam-inventory-app
npm install
# فایل .env.local رو با کلید API استیم خودت بساز
echo "STEAM_API_KEY=کلید_API_خودت" > .env.local
echo "NEXT_PUBLIC_HOST=http://localhost:3000" >> .env.local
npm run dev
```

برو به `http://localhost:3000`، با استیم لاگین کن و آیتم‌هات رو ببین.
