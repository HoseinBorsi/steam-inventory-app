"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Gamepad2, Search, Clock, ArrowUpDown, FilterX, Loader2,
  Package, ArrowLeft, AlertCircle, LayoutGrid, List, Columns,
  Layers, Tag, Coins
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { LocaleProvider, useLocale } from "@/i18n";
import type { SteamGame } from "@/lib/steam";

type DisplayMode = "grid" | "list" | "compact";
type FilterMode = "all" | "tradable" | "marketable";
type SortMode = "name" | "quantity" | "rarity";

interface SteamItem {
  name: string;
  icon_url: string;
  type: string;
  quantity: number;
  tradable: boolean;
  marketable: boolean;
  rarity: string;
}

const modeIcons: Record<DisplayMode, typeof LayoutGrid> = {
  grid: LayoutGrid, list: List, compact: Columns,
};

function InventoryContent() {
  const { t } = useLocale();
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
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [itemSort, setItemSort] = useState<SortMode>("name");
  const [aggregate, setAggregate] = useState(false);

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

  const processedItems = useMemo(() => {
    let list = [...items];

    // Filter
    if (filterMode === "tradable") list = list.filter((i) => i.tradable);
    if (filterMode === "marketable") list = list.filter((i) => i.marketable);

    // Search
    if (itemSearch.trim()) {
      const q = itemSearch.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }

    // Sort
    list.sort((a, b) => {
      if (itemSort === "quantity") return b.quantity - a.quantity;
      if (itemSort === "rarity") return a.rarity.localeCompare(b.rarity);
      return a.name.localeCompare(b.name);
    });

    // Aggregate
    if (aggregate) {
      const groups = new Map<string, SteamItem & { totalQty: number }>();
      for (const item of list) {
        const existing = groups.get(item.name);
        if (existing) {
          existing.totalQty += item.quantity;
        } else {
          groups.set(item.name, { ...item, totalQty: item.quantity });
        }
      }
      list = Array.from(groups.values());
    }

    return list;
  }, [items, itemSearch, filterMode, itemSort, aggregate]);

  const controlsBar = (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {/* Display modes */}
      {(["grid", "list", "compact"] as DisplayMode[]).map((m) => {
        const Icon = modeIcons[m];
        return (
          <Button key={m} size="sm" variant={displayMode === m ? "default" : "ghost"}
            onClick={() => setDisplayMode(m)} title={t(`inventory.display.${m}`)}>
            <Icon className="w-3.5 h-3.5" />
          </Button>
        );
      })}
      <span className="w-px h-5 bg-slate-700 mx-1" />
      {/* Filter */}
      {(["all", "tradable", "marketable"] as FilterMode[]).map((f) => (
        <Button key={f} size="sm" variant={filterMode === f ? "default" : "ghost"}
          onClick={() => setFilterMode(f)}>
          {f === "tradable" ? <Tag className="w-3 h-3" />
           : f === "marketable" ? <Coins className="w-3 h-3" /> : null}
          <span className="ml-1 text-xs">{t(`inventory.filter.${f}`)}</span>
        </Button>
      ))}
      <span className="w-px h-5 bg-slate-700 mx-1" />
      {/* Sort */}
      {(["name", "quantity", "rarity"] as SortMode[]).map((s) => (
        <Button key={s} size="sm" variant={itemSort === s ? "default" : "ghost"}
          onClick={() => setItemSort(s)}>
          <ArrowUpDown className="w-3 h-3" />
          <span className="ml-1 text-xs">{t(`inventory.sort.${s}`)}</span>
        </Button>
      ))}
      <span className="w-px h-5 bg-slate-700 mx-1" />
      {/* Aggregate toggle */}
      <Button size="sm" variant={aggregate ? "default" : "ghost"}
        onClick={() => setAggregate(!aggregate)}>
        <Layers className="w-3.5 h-3.5" />
        <span className="ml-1 text-xs">{t("inventory.aggregate")}</span>
      </Button>
    </div>
  );

  const renderItems = () => {
    if (displayMode === "list") return renderList();
    if (displayMode === "compact") return renderCompact();
    return renderGrid();
  };

  const renderGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {processedItems.map((item, idx) => (
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
          <div className="flex items-center gap-1 mt-1">
            {(item as unknown as { totalQty?: number }).totalQty !== undefined ? (
              <span className="text-[10px] text-cyan-400">×{(item as unknown as { totalQty: number }).totalQty}</span>
            ) : item.quantity > 1 && (
              <span className="text-[10px] text-gray-500">×{item.quantity}</span>
            )}
            {item.rarity && (
              <span className="text-[10px] text-gray-600 ml-auto truncate">{item.rarity}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-1">
      {processedItems.map((item, idx) => (
        <div key={idx}
          className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/30 rounded-lg px-3 py-2 hover:border-cyan-500/20 transition-all">
          <div className="w-10 h-10 rounded bg-slate-700/40 flex items-center justify-center flex-shrink-0">
            {item.icon_url ? (
              <img src={item.icon_url} alt={item.name} className="w-8 h-8 object-contain" loading="lazy" />
            ) : (
              <Package className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 truncate">{item.name}</p>
            <p className="text-[11px] text-gray-500">{item.type}{item.rarity ? ` · ${item.rarity}` : ""}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {item.tradable && <Tag className="w-3 h-3 text-cyan-400" />}
            {item.marketable && <Coins className="w-3 h-3 text-yellow-400" />}
            <span className="text-xs text-gray-400 font-mono">
              {(item as unknown as { totalQty?: number }).totalQty !== undefined
                ? `×${(item as unknown as { totalQty: number }).totalQty}`
                : `×${item.quantity}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCompact = () => (
    <div className="flex flex-wrap gap-1.5">
      {processedItems.map((item, idx) => (
        <div key={idx} title={`${item.name}${(item as unknown as { totalQty?: number }).totalQty ? ` ×${(item as unknown as { totalQty: number }).totalQty}` : ` ×${item.quantity}`}`}
          className="w-12 h-12 rounded bg-slate-800/40 border border-slate-700/30 flex items-center justify-center hover:border-cyan-500/40 transition-all cursor-default relative">
          {item.icon_url ? (
            <img src={item.icon_url} alt={item.name} className="w-9 h-9 object-contain" loading="lazy" />
          ) : (
            <Package className="w-5 h-5 text-gray-600" />
          )}
          {((item as unknown as { totalQty?: number }).totalQty || item.quantity) > 1 && (
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] bg-slate-900 text-cyan-400 px-1 rounded font-mono">
              {(item as unknown as { totalQty?: number }).totalQty || item.quantity}
            </span>
          )}
        </div>
      ))}
    </div>
  );

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
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" onClick={() => { setSelectedGame(null); setItems([]); setItemsError(""); }}>
                <ArrowLeft className="w-4 h-4" /> {t("inventory.backToGames")}
              </Button>
              <span className="text-lg font-semibold">{selectedGame.name}</span>
              <span className="text-sm text-gray-500">
                ({t("inventory.itemsCount", { count: items.length })})
              </span>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="relative max-w-xs flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type="text" value={itemSearch} onChange={(e) => setItemSearch(e.target.value)}
                    placeholder={t("inventory.searchItems")}
                    className="w-full pl-10 pr-4 py-1.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
            )}

            {items.length > 0 && controlsBar}

            {itemsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : itemsError ? (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-12 h-12 text-gray-600" />
                <p>{itemsError}</p>
              </div>
            ) : processedItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-2">
                <Package className="w-12 h-12 text-gray-600" />
                <p>{itemSearch || filterMode !== "all" ? t("inventory.noItemsSearch") : t("inventory.noItems")}</p>
              </div>
            ) : (
              renderItems()
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

export default function InventoryPage() {
  return (
    <LocaleProvider>
      <InventoryContent />
    </LocaleProvider>
  );
}
