"use client";
import Link from "next/link";
import { LogOut, Gamepad2, User, Globe } from "lucide-react";
import { useLocale, type Locale } from "@/i18n";

const labels: Record<Locale, string> = { en: "EN", fa: "فا", ru: "RU" };
const locales: Locale[] = ["en", "fa", "ru"];

export default function Navbar({ user }: { user?: { name: string; avatar: string } | null }) {
  const { locale, setLocale, t } = useLocale();

  const cycleLocale = () => {
    const idx = locales.indexOf(locale);
    setLocale(locales[(idx + 1) % locales.length]);
  };

  const handleLogout = async () => {
    await fetch("/api/user", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {t("app.title")}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={cycleLocale}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-400 hover:text-white hover:bg-slate-800 transition"
            title={locale}
          >
            <Globe className="w-3.5 h-3.5" />
            {labels[locale]}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
              <span className="text-sm text-gray-300 hidden sm:inline">{user.name}</span>
              <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-400 transition flex items-center gap-1">
                <LogOut className="w-3 h-3" /> {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <User className="w-3 h-3" /> {t("home.notLoggedIn")}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
