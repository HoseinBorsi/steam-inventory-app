"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getSteamLoginUrl } from "@/lib/steam";
import { Button } from "@/components/ui/button";
import { Gamepad2, Search, BarChart3, ArrowRight, Shield } from "lucide-react";
import { t } from "@/i18n";

export default function Home() {
  const [user, setUser] = useState<{ steamId: string; name: string; avatar: string } | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const features = [
    { icon: Gamepad2, key: "games" },
    { icon: Search, key: "search" },
    { icon: BarChart3, key: "stats" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <Navbar user={user} />
      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 text-center">
        <div className="mb-8 p-6 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <Gamepad2 className="w-16 h-16 text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t("home.title")}
        </h1>
        <p className="text-xl text-gray-400 mb-2 max-w-lg">{t("home.subtitle")}</p>
        <p className="text-gray-500 mb-10">{t("home.description")}</p>

        {user ? (
          <a href="/inventory">
            <Button className="text-base px-8 py-4">
              <ArrowRight className="w-5 h-5" /> {t("home.enter")}
            </Button>
          </a>
        ) : (
          <a href={getSteamLoginUrl()}>
            <Button variant="steam" className="text-base px-8 py-4">
              <Shield className="w-5 h-5" /> {t("home.login")}
            </Button>
          </a>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {features.map((f) => (
            <div key={f.key} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="inline-flex p-3 mb-3 rounded-lg bg-cyan-500/10">
                <f.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold mb-1">{t(`home.features.${f.key}.title`)}</h3>
              <p className="text-sm text-gray-400">{t(`home.features.${f.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
