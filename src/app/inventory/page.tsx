"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Search, Clock, ArrowUpDown, FilterX, Loader2, Package, ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n";
import type { SteamGame } from "@/lib/steam";

interface SteamItem {
  name: string;
  icon_url: string;
  type: string;
  quantity: number;
}

export default function InventoryPage() {
  const [user, setUser] = useState<{ steamId: string; name: string; avatar: string } | null>(null);
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "playtime">("playtime");
  const [filterPlayed, setFilterPlayed] = useState(false);
  const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);
  const [items, setItems] = useState<SteamItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((d: { user?: { steamId: string; name: string; avatar: string } }) => {
        if (!d.user) { router.push("/"); return; }
        setUser(d.user);
        fetch("/api/games")
          .then((r) => r.json())
          .then((data: { games?: SteamGame[] }) => {
            if (data?.games) setGames(data.games);
            setLoading(false);
          });
      })
      .catch(() => setLoading(false));
  }, [router]);

  const filtered = useMemo(() => {
    let list = [...games];
    if (filterPlayed) list = list.filter((g) => g.playtime_forever > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => sortBy === "name"
      ? a.name.localeCompare(b.name)
      : b.playtime_forever - a.playtime_forever);
    return list;
  }, [games, search, sortBy, filterPlayed]);

  const loadItems = async (game: SteamGame) => {
    setSelectedGame(game);
    setItemsLoading(true);
    setItemsError("");
    setItemSearch("");
    setItems([]);

    try {
      const res = await fetch(`/api/inventory?steamId=${user!.steamId}&appid=${game.appid}`);
      const data = await res.json();
      if (!res.ok || data.note) {
        setItemsError(data.note || t("errors.fetchFailed"));
      } else {
        setItems(data.items || []);
      }
    } catch {
      setItemsError(t("errors.fetchFailed"));
    }
    setItemsLoading(false);
  };

  const filteredItems = useMemo(() => {
    if (!itemSearch.trim()) return items;
    const q = itemSearch.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, itemSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Gamepad2 className="w-7 h-7 text-cyan-400" />
              {t("inventory.title")}
            </h1>
            <p className="text-gray-400 mt-1">{t("inventory.gamesCount", { count: games.length })}</p>
          </div>
          {!selectedGame && <SearchBar value={search} onChange={setSearch} placeholder={t("inventory.searchGames")} />}
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {!selectedGame && (
            <>
              <Button variant={sortBy === "playtime" ? "default" : "ghost"} onClick={() => setSortBy("playtime")}>
                <Clock className="w-4 h-4" /> {t("inventory.sortMostPlayed")}
              </Button>
              <Button variant={sortBy === "name" ? "default" : "ghost"} onClick={() => setSortBy("name")}>
                <ArrowUpDown className="w-4 h-4" /> {t("inventory.sortAZ")}
              </Button>
              <Button variant={filterPlayed ? "default" : "ghost"} onClick={() => setFilterPlayed(!filterPlayed)}>
                <FilterX className="w-4 h-4" /> {t("inventory.filterPlayed")}
              </Button>
            </>
          )}
        </div>

        {selectedGame ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" onClick={() => { setSelectedGame(null); setItems([]); setItemsError(""); }}>
                <ArrowLeft className="w-4 h-4" /> {t("inventory.backToGames")}
              </Button>
              <span className="text-lg font-semibold">{selectedGame.name}</span>
              <span className="text-sm text-gray-500">
                ({t("inventory.itemsCount", { count: items.length })})
              </span>
            </div>

            {items.length > 0 && (
              <div className="mb-6 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type="text" value={itemSearch} onChange={(e) => setItemSearch(e.target.value)}
                    placeholder={t("inventory.searchItems")}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
            )}

            {itemsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : itemsError ? (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-12 h-12 text-gray-600" />
                <p>{itemsError}</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-2">
                <Package className="w-12 h-12 text-gray-600" />
                <p>{itemSearch ? t("inventory.noItemsSearch") : t("inventory.noItems")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredItems.map((item, idx) => (
                  <div key={idx}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 hover:border-cyan-500/30 transition-all group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-700/30 mb-2 flex items-center justify-center">
                      {item.icon_url ? (
                        <img src={item.icon_url} alt={item.name} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" loading="lazy" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300 truncate font-medium">{item.name}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-500 mt-1">x{item.quantity}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-2">
                <Gamepad2 className="w-12 h-12 text-gray-600" />
                <p>{search ? t("inventory.noGamesSearch") : t("inventory.noGames")}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">{t("inventory.gamesShown", { count: filtered.length })}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filtered.map((game) => (
                    <GameCard key={game.appid} game={game} onSelect={loadItems} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
