import React from "react";
import { useTranslation } from "react-i18next";

interface PokemonCardProps {
  name: string;
  sprite: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  lastMove?: string;
  isPlayer: boolean;
}

/**
 * getHpColor - Returns color class based on HP percentage
 */
function getHpColor(currentHp: number, maxHp: number): string {
  const percentage = (currentHp / maxHp) * 100;
  if (percentage > 66) return "bg-green-500";
  if (percentage > 33) return "bg-yellow-500";
  return "bg-red-500";
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  name,
  sprite,
  currentHp,
  maxHp,
  attack,
  defense,
  speed,
  lastMove,
  isPlayer,
}) => {
  const { t } = useTranslation();
  const hpPercentage = (currentHp / maxHp) * 100;
  const hpColor = getHpColor(currentHp, maxHp);

  return (
    <div
      className={`relative flex flex-col rounded-3xl border-8 border-yellow-600 p-4 bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl w-full max-w-sm ${
        isPlayer ? "order-1" : "order-2"
      }`}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-black text-white capitalize drop-shadow-md">
            {name}
          </h2>
          <p className="text-xs text-gray-400 font-bold">
            {isPlayer ? t("battle_player_pokemon") : t("battle_enemy_pokemon")}
          </p>
        </div>
        <div className="bg-yellow-600 text-gray-950 rounded-lg px-3 py-1 font-bold text-sm">
          {isPlayer ? "★ " + t("battle_player_pokemon") : "✗ " + t("battle_enemy_pokemon")}
        </div>
      </div>

      {/* Sprite Container */}
      <div className="bg-white rounded-xl p-4 border-4 border-yellow-600 shadow-inner flex items-center justify-center mb-4 min-h-40">
        {sprite ? (
          <img
            src={sprite}
            alt={name}
            className="w-32 h-32 object-contain drop-shadow-lg"
          />
        ) : (
          <div className="text-gray-400 italic">{t("common_error")} - {t("pokemon_name")}</div>
        )}
      </div>

      {/* HP Section */}
      <div className="mb-4 bg-gray-800 rounded-xl p-3 border-2 border-yellow-600">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-yellow-400">{t("pokemon_stats_hp")}</span>
          <span className="text-sm font-bold text-white">
            {currentHp}/{maxHp}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 border-2 border-yellow-600 overflow-hidden">
          <div
            className={`${hpColor} h-full rounded-full transition-all duration-300`}
            style={{ width: `${Math.max(0, hpPercentage)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Container */}
      <div className="bg-gray-800 rounded-xl p-3 border-2 border-yellow-600 mb-4">
        <p className="text-xs font-bold text-yellow-400 mb-2">{t("pokemon_moves")}</p>
        <div className="space-y-2">
          {[
            { label: "ATK", value: attack, color: "bg-red-500" },
            { label: "DEF", value: defense, color: "bg-blue-500" },
            { label: "SPD", value: speed, color: "bg-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 w-8">
                {stat.label}
              </span>
              <div className="flex-grow bg-gray-700 rounded-full h-2 border border-gray-600">
                <div
                  className={`${stat.color} h-2 rounded-full`}
                  style={{ width: `${(stat.value / 150) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-300 w-8 text-right">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Move (if exists) */}
      {lastMove && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-3 border-2 border-yellow-600 text-center">
          <p className="text-xs font-bold text-yellow-300 mb-1">{t("pokemon_last_move")}</p>
          <p className="text-sm font-bold text-white capitalize">{lastMove}</p>
        </div>
      )}

      {/* Card badge */}
      <div className="absolute top-2 right-2 bg-yellow-600 text-gray-950 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">
        {isPlayer ? "P" : "E"}
      </div>
    </div>
  );
};
