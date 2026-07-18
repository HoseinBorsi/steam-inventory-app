# 🎮 اپلیکیشن اینونتوری استیم

یه برنامه تحت وب سریع و چند زبانه برای دیدن بازی‌های استیم و آیتم‌های داخل هر بازی. برای بخش آیتم‌ها نیاز به API Key نداری.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/i18n-EN_|_FA_|_RU-8b5cf6" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

[📖 English](README.md) | [📖 Русский](README.ru.md)

---

## ✨ امکانات

- **ورود با OpenID استیم** — امن، بدون ذخیره رمز عبور
- **مشاهده کتابخانه بازی‌ها** — همه بازی‌ها با ساعت بازی
- **بازرسی آیتم‌ها** — روی هر بازی کلیک کن، آیتم‌هاش رو ببین
- **جستجو و مرتب‌سازی** — فیلتر اسم، مرتب‌سازی با زمان بازی یا الفبا
- **رابط کاربری چند زبانه** — فارسی، English، Русский
- **تم تاریک واکنش‌گرا** — دسکتاپ و موبایل
- **بدون API Key** برای آیتم‌ها — از API عمومی استیم

---

## 🏗️ نحوه کار

| قابلیت | API | احراز هویت |
|--------|-----|------------|
| ورود | Steam OpenID | — |
| پروفایل کاربر | `ISteamUser/GetPlayerSummaries` | API Key |
| لیست بازی‌ها | `IPlayerService/GetOwnedGames` | API Key |
| **آیتم‌های اینونتوری** | `steamcommunity.com/inventory/{id}/{appid}/2` | Cookie |

API اینونتوری جواب رو به صورت `{ assets, descriptions, success: 1, total_inventory_count }` برمی‌گردونه. آیتم‌ها با کلید ترکیبی `classid_instanceid` به توضیحاتشون وصل می‌شن. هدر `Cookie: birthtime=0; mature_content=1` برای رد شدن از bot detection استیم (خطای ۴۰۳) لازمه.

عکس‌های آیتم‌ها از CDN اختصاصی استیم لود می‌شن:
```
https://community.akamai.steamstatic.com/economy/image/{icon_url}/128x128f
```

---

## 🚀 راه‌اندازی

### پیش‌نیازها
- Node.js نسخه ۱۸ به بالا
- [کلید API استیم](https://steamcommunity.com/dev/apikey) (رایگان)

### نصب

```bash
git clone https://github.com/HoseinBorsi/steam-inventory-app.git
cd steam-inventory-app
npm install
```

فایل `.env.local` رو بساز:
```env
STEAM_API_KEY=کلید_API_خودت
NEXT_PUBLIC_HOST=http://localhost:3000
```

### اجرا

```bash
npm run dev
```

برو به `http://localhost:3000`، با استیم لاگین کن و آیتم‌هات رو ببین.

---

## 📂 ساختار پروژه

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # callback احراز هویت
│   │   ├── games/route.ts            # لیست بازی‌ها (API Key)
│   │   ├── inventory/route.ts        # آیتم‌های اینونتوری (عمومی)
│   │   └── user/route.ts             # نشست کاربر
│   ├── inventory/page.tsx            # صفحه اصلی اینونتوری
│   ├── layout.tsx                    # layout ریشه
│   └── page.tsx                      # صفحه ورود
├── components/
│   ├── GameCard.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   └── ui/                           # کامپوننت‌های پایه
├── i18n/
│   ├── en.json                       # انگلیسی
│   ├── fa.json                       # فارسی
│   ├── ru.json                       # روسی
│   └── index.ts                      # موتور ترجمه
└── lib/
    └── steam.ts                      # توابع کمکی API استیم
```

---

## 🌍 مناطق با دسترسی محدود

اگه `steamcommunity.com` توی منطقه شما فیلتر باشه، برنامه همچنان کار می‌کنه به شرطی که **سرور deployment** بتونه به استیم وصل بشه (دریافت آیتم‌ها سمت سروره، نه سمت کلاینت).

---

## 📄 مجوز

MIT © [HoseinBorsi](https://github.com/HoseinBorsi)
