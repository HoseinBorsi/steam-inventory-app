# 🎮 اپلیکیشن اینونتوری استیم

یه PWA سریع و چند زبانه برای دیدن بازی‌های استیم و آیتم‌های اینونتوری. برای مشاهده آیتم‌ها نیاز به API Key نداری.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/i18n-EN_|_FA_|_RU-8b5cf6" />
  <img src="https://img.shields.io/badge/PWA-ready-06b6d4" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

[📖 English](README.md) | [📖 Русский](README.ru.md)

---

## ✨ امکانات

- **ورود با OpenID استیم** — امن، بدون ذخیره رمز عبور
- **مشاهده کتابخانه بازی‌ها** — همه بازی‌ها با ساعت بازی
- **بازرسی آیتم‌ها** — روی هر بازی کلیک کن، آیتم‌هاش رو ببین
- **۳ حالت نمایش** — شبکه‌ای / لیستی / فشرده
- **فیلتر هوشمند** — همه / فقط Tradable / فقط Marketable
- **مرتب‌سازی** — بر اساس اسم، تعداد، یا کمیابی
- **نمای تجمیعی** — گروه‌بندی آیتم‌های تکراری (×۵)
- **تغییر زبان زنده** — English / فارسی / Русский (ذخیره در مرورگر)
- **قابل نصب (PWA)** — مثل یه اپ واقعی روی ویندوز و اندروید
- **تم تاریک واکنش‌گرا** — کار روی دسکتاپ و موبایل
- **بدون API Key** برای آیتم‌ها

---

## 🏗️ نحوه کار

| قابلیت | API | احراز هویت |
|--------|-----|------------|
| ورود | Steam OpenID | — |
| پروفایل | `ISteamUser/GetPlayerSummaries` | API Key |
| بازی‌ها | `IPlayerService/GetOwnedGames` | API Key |
| **آیتم‌ها** | `steamcommunity.com/inventory/{id}/{appid}/2` | Cookie |

API اینونتوری جواب رو به صورت `{ success: 1, assets[], descriptions{}, total_inventory_count, more_items, last_assetid }` برمی‌گردونه. آیتم‌ها با کلید `classid_instanceid` به توضیحات وصل می‌شن. هدر `Cookie: birthtime=0; mature_content=1` برای رد شدن از bot detection استیم لازمه.

Pagination پشتیبانی میشه — وقتی `more_items > 0` باشه، درخواست بعدی با `start_assetid=last_assetid` ارسال میشه.

عکس‌های آیتم‌ها از CDN استیم:
```
https://community.akamai.steamstatic.com/economy/image/{icon_url}/128x128f
```

---

## 🚀 راه‌اندازی

### پیش‌نیازها
- Node.js نسخه ۱۸+
- [کلید API استیم](https://steamcommunity.com/dev/apikey) (رایگان)

### نصب

```bash
git clone https://github.com/HoseinBorsi/steam-inventory-app.git
cd steam-inventory-app
npm install
```

فایل `.env.local`:
```env
STEAM_API_KEY=کلید_API_خودت
NEXT_PUBLIC_HOST=http://localhost:3000
```

### اجرا

```bash
npm run dev
```

باز کن `http://localhost:3000` → ورود با استیم → دیدن اینونتوری.

### نصب به عنوان اپ (PWA)

سایت رو توی Chrome/Edge باز کن → روی آیکون install توی نوار آدرس کلیک کن → برنامه به صورت مستقل با پنجره خودش اجرا میشه.

---

## 📂 ساختار پروژه

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # callback احراز هویت
│   │   ├── games/route.ts            # بازی‌ها (نیاز به API Key)
│   │   ├── inventory/route.ts        # آیتم‌ها + pagination
│   │   └── user/route.ts             # نشست کاربر
│   ├── inventory/page.tsx            # صفحه اصلی اینونتوری
│   ├── layout.tsx                    # layout اصلی + PWA
│   └── page.tsx                      # صفحه ورود
├── components/
│   ├── GameCard.tsx                  # کارت بازی
│   ├── Navbar.tsx                    # نوبار + دکمه تغییر زبان
│   ├── SearchBar.tsx                 # جستجو
│   └── ui/                           # کامپوننت Button
├── i18n/
│   ├── en.json / fa.json / ru.json   # فایل‌های ترجمه
│   └── index.tsx                     # Context زنده برای زبان
└── lib/
    └── steam.ts                      # توابع کمکی API
public/
├── manifest.json                     # PWA manifest
├── sw.js                             # Service worker (آفلاین)
└── icons/icon.svg                    # آیکون برنامه
```

---

## 📄 مجوز

MIT © [HoseinBorsi](https://github.com/HoseinBorsi)
