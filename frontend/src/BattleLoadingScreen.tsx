import React from "react";
import { useTranslation } from "react-i18next";

export const BattleLoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Pokéball */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            <div
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-white rounded-full animate-spin"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-white to-red-600 rounded-full animate-spin"
              style={{
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                animationDirection: "reverse",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-950 rounded-full border-4 border-white" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-black text-yellow-400 mb-4 animate-pulse">
          ⚡ {t("battle_status")} ⚡
        </h1>
        <p className="text-2xl font-bold text-yellow-300 animate-bounce">
          {t("common_loading")}...
        </p>

        {/* Dots animation */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
