# 🎮 Steam Inventory App

Быстрое многоязычное веб-приложение для просмотра библиотеки игр Steam и предметов инвентаря. API-ключ не требуется для просмотра инвентаря.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/i18n-EN_|_FA_|_RU-8b5cf6" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

[📖 English](README.md) | [📖 فارسی](README.fa.md)

---

## ✨ Возможности

- **Вход через Steam OpenID** — безопасно, без хранения паролей
- **Просмотр библиотеки** — все ваши игры с временем игры
- **Инвентарь** — нажмите на игру, чтобы увидеть предметы внутри
- **Поиск и сортировка** — фильтр по названию, сортировка по времени игры или A-Z
- **Многоязычный интерфейс** — English, فارسی, Русский
- **Тёмная тема** — адаптивная, для ПК и мобильных
- **Без API-ключа** для инвентаря — публичный эндпоинт Steam

---

## 🏗️ Как это работает

| Функция | API | Авторизация |
|---------|-----|-------------|
| Вход | Steam OpenID | — |
| Профиль | `ISteamUser/GetPlayerSummaries` | API-ключ |
| Библиотека игр | `IPlayerService/GetOwnedGames` | API-ключ |
| **Инвентарь** | `steamcommunity.com/inventory/{id}/{appid}/2` | Cookie |

Эндпоинт инвентаря возвращает `{ assets, descriptions, success: 1, total_inventory_count }`. Предметы сопоставляются с описаниями через составной ключ `classid_instanceid`. Заголовок `Cookie: birthtime=0; mature_content=1` обходит защиту от ботов Steam (HTTP 403).

Изображения предметов загружаются с CDN Steam:
```
https://community.akamai.steamstatic.com/economy/image/{icon_url}/128x128f
```

---

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- [Ключ Steam Web API](https://steamcommunity.com/dev/apikey) (бесплатно)

### Установка

```bash
git clone https://github.com/HoseinBorsi/steam-inventory-app.git
cd steam-inventory-app
npm install
```

Создайте `.env.local`:
```env
STEAM_API_KEY=ваш_api_ключ
NEXT_PUBLIC_HOST=http://localhost:3000
```

### Запуск

```bash
npm run dev
```

Откройте `http://localhost:3000`, войдите через Steam и смотрите инвентарь.

---

## 📂 Структура проекта

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # Колбэк OpenID
│   │   ├── games/route.ts            # Список игр (API-ключ)
│   │   ├── inventory/route.ts        # Инвентарь (публичный)
│   │   └── user/route.ts             # Сессия
│   ├── inventory/page.tsx            # Главная страница инвентаря
│   ├── layout.tsx                    # Корневой layout
│   └── page.tsx                      # Страница входа
├── components/
│   ├── GameCard.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   └── ui/                           # Базовые компоненты (shadcn)
├── i18n/
│   ├── en.json                       # Английский
│   ├── fa.json                       # Персидский (فارسی)
│   ├── ru.json                       # Русский
│   └── index.ts                      # Движок переводов
└── lib/
    └── steam.ts                      # Хелперы Steam API
```

---

## 🌍 Регионы с ограниченным доступом

Если `steamcommunity.com` заблокирован в вашем регионе, приложение всё равно будет работать, если **сервер развёртывания** имеет доступ к Steam (запросы инвентаря выполняются на стороне сервера, а не клиента).

---

## 📄 Лицензия

MIT © [HoseinBorsi](https://github.com/HoseinBorsi)
