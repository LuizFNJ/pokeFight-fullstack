import React from "react";
import { useTranslation } from "react-i18next";

interface BattleStatsProps {
  wins: number;
  losses: number;
}

export const BattleStats: React.FC<BattleStatsProps> = ({ wins, losses }) => {
  const { t } = useTranslation();
  const totalBattles = wins + losses;
  const winRate = totalBattles === 0 ? 0 : Math.round((wins / totalBattles) * 100);

  return (
    <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl p-4 border-4 border-yellow-700 shadow-lg">
      <div className="grid grid-cols-3 gap-4">
        {/* Wins */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-950 mb-1">🎉 {t("battle_victory")}</p>
          <p className="text-3xl font-black text-green-600">{wins}</p>
        </div>

        {/* Losses */}
        <div className="text-center border-l-2 border-r-2 border-yellow-700">
          <p className="text-sm font-bold text-gray-950 mb-1">😢 {t("battle_defeat")}</p>
          <p className="text-3xl font-black text-red-600">{losses}</p>
        </div>

        {/* Win Rate */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-950 mb-1">📊 {t("common_loading")}</p>
          <p className="text-3xl font-black text-gray-950">{winRate}%</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t-2 border-yellow-700">
        <p className="text-xs font-bold text-gray-950 text-center">
          {t("battle_current_turn", { turn: totalBattles })} {t("battle_turn").toLowerCase()}
        </p>
      </div>
    </div>
  );
};
