import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface BattleResultProps {
  isVictory: boolean;
  playerPokemonName: string;
  enemyPokemonName: string;
  onContinue: () => void;
}

export const BattleResult: React.FC<BattleResultProps> = ({
  isVictory,
  playerPokemonName,
  enemyPokemonName,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        className={`relative max-w-md w-full rounded-3xl p-8 text-center transform transition-all duration-700 ${
          isVictory
            ? "bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 scale-100 animate-bounce"
            : "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 scale-100"
        }`}
      >
        {/* Confetti animation for victory */}
        {isVictory && showConfetti && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `fall ${2 + Math.random() * 2}s linear infinite`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>
        )}

        {/* Result Content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4">
            {isVictory ? "🎉" : "😢"}
          </div>

          <h2
            className={`text-4xl font-black mb-4 ${
              isVictory ? "text-gray-950" : "text-yellow-300"
            }`}
          >
            {isVictory ? t("battle_victory") : t("battle_defeat")}
          </h2>

          <div className="space-y-3 mb-6">
            <p className={`text-xl font-bold ${isVictory ? "text-gray-900" : "text-gray-200"}`}>
              {isVictory
                ? `${playerPokemonName} ${t("battle_player_wins")}`
                : `${enemyPokemonName} ${t("battle_player_loses")}`}
            </p>

            <div
              className={`inline-block px-6 py-3 rounded-xl font-bold text-lg ${
                isVictory
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {isVictory ? `+100 ${t("common_loading")} 🏆` : `0 ${t("common_loading")}`}
            </div>
          </div>

          <button
            onClick={onContinue}
            className={`w-full py-4 rounded-xl font-black text-lg transition-all hover:scale-105 active:scale-95 ${
              isVictory
                ? "bg-gray-950 text-yellow-400 hover:bg-gray-900"
                : "bg-gray-600 text-white hover:bg-gray-500"
            }`}
          >
            {t("battle_play_again")}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(400px) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
