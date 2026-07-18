# 🎮 Steam Inventory App

Быстрое многоязычное PWA для просмотра библиотеки игр Steam и предметов инвентаря. API-ключ не требуется для инвентаря.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/i18n-EN_|_FA_|_RU-8b5cf6" />
  <img src="https://img.shields.io/badge/PWA-ready-06b6d4" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

[📖 English](README.md) | [📖 فارسی](README.fa.md)

---

## ✨ Возможности

- **Вход через Steam OpenID** — безопасно, без паролей
- **Библиотека игр** — все ваши игры с временем игры
- **Просмотр инвентаря** — нажмите на игру, чтобы увидеть предметы
- **3 режима отображения** — Сетка / Список / Компактно
- **Умные фильтры** — Все / Только обмен / Только продажа
- **Сортировка** — по имени, количеству или редкости
- **Группировка** — объединение одинаковых предметов (×5)
- **Живое переключение языка** — English / فارسی / Русский (сохраняется)
- **PWA** — устанавливается как приложение на Windows и Android
- **Тёмная тема** — адаптивная, для ПК и мобильных
- **Без API-ключа** для инвентаря

---

## 🏗️ Как это работает

| Функция | API | Авторизация |
|---------|-----|-------------|
| Вход | Steam OpenID | — |
| Профиль | `ISteamUser/GetPlayerSummaries` | API-ключ |
| Игры | `IPlayerService/GetOwnedGames` | API-ключ |
| **Инвентарь** | `steamcommunity.com/inventory/{id}/{appid}/2` | Cookie |

Эндпоинт возвращает `{ success: 1, assets[], descriptions{}, total_inventory_count, more_items, last_assetid }`. Предметы сопоставляются через ключ `classid_instanceid`. Заголовок `Cookie: birthtime=0; mature_content=1` обходит защиту Steam.

Пагинация: при `more_items > 0` следующий запрос с `start_assetid=last_assetid`.

Изображения с CDN Steam:
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

Откройте `http://localhost:3000` → Войти через Steam → Просмотр инвентаря.

### Установка как приложение (PWA)

Откройте сайт в Chrome/Edge → значок установки в адресной строке → приложение запускается в отдельном окне.

---

## 📂 Структура проекта

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts    # Колбэк OpenID
│   │   ├── games/route.ts            # Игры (API-ключ)
│   │   ├── inventory/route.ts        # Инвентарь + пагинация
│   │   └── user/route.ts             # Сессия
│   ├── inventory/page.tsx            # Главная страница
│   ├── layout.tsx                    # layout + PWA
│   └── page.tsx                      # Страница входа
├── components/
│   ├── GameCard.tsx                  # Карточка игры
│   ├── Navbar.tsx                    # Навбар + язык
│   ├── SearchBar.tsx                 # Поиск
│   └── ui/                           # Компонент Button
├── i18n/
│   ├── en.json / fa.json / ru.json   # Файлы переводов
│   └── index.tsx                     # Контекст локализации
└── lib/
    └── steam.ts                      # Хелперы Steam API
public/
├── manifest.json                     # PWA манифест
├── sw.js                             # Service worker (офлайн)
└── icons/icon.svg                    # Иконка приложения
```

---

## 📄 Лицензия

MIT © [HoseinBorsi](https://github.com/HoseinBorsi)
