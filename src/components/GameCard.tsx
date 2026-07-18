"use client";
import { Clock, TrendingUp } from "lucide-react";
import { SteamGame, getGameHeaderImage } from "@/lib/steam";

interface Props {
  game: SteamGame;
  onSelect?: (game: SteamGame) => void;
}

const formatTime = (min: number) => {
  const h = Math.floor(min / 60);
  return h > 0 ? `${h}h` : `${min}m`;
};

export default function GameCard({ game, onSelect }: Props) {
  const imgSrc = game.img_logo_url
    ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
    : getGameHeaderImage(game.appid);

  return (
    <button
      onClick={() => onSelect?.(game)}
      className="group bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 text-left w-full"
    >
      <div className="aspect-[460/215] overflow-hidden bg-slate-700/30">
        <img
          src={imgSrc}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{game.name}</h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatTime(game.playtime_forever)}
          </span>
          {game.playtime_2weeks !== undefined && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {formatTime(game.playtime_2weeks)}/2w
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
