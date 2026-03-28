import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { PokemonCard } from "./PokemonCard";
import { MessageManager } from "./GlobalMessage";

interface PokemonState {
  name: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: string[];
  sprite: string;
}

interface SubTurn {
  turnNumber: number;
  attacker: string;
  action: string;
  damageDealt: number;
  defenderRemainingHp: number;
  matchStatus: string;
  narrative: string;
}

interface BattleState {
  currentTurn: number;
  playerPokemon: PokemonState;
  enemyPokemon: PokemonState;
  matchStatus: "ongoing" | "player_victory" | "ai_victory";
}

interface BattleArenaProps {
  battleId: string;
  playerPokemon: PokemonState;
  enemyPokemon: PokemonState;
  onBattleEnd: (winner: "player" | "ai", playerName: string, enemyName: string) => void;
  playerName: string;
  enemyName: string;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  battleId,
  playerPokemon: initialPlayerPokemon,
  enemyPokemon: initialEnemyPokemon,
  onBattleEnd,
  playerName,
  enemyName,
}) => {
  const { t } = useTranslation();
  const [battle, setBattle] = useState<BattleState>({
    currentTurn: 1,
    playerPokemon: initialPlayerPokemon,
    enemyPokemon: initialEnemyPokemon,
    matchStatus: "ongoing",
  });

  const [battleLog, setBattleLog] = useState<SubTurn[]>([]);
  const [selectedMove, setSelectedMove] = useState<string>(
    initialPlayerPokemon?.moves?.[0] || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");

  // Auto-scroll battle log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [battleLog]);

  // Check if battle is over
  useEffect(() => {
    if (battle.matchStatus !== "ongoing") {
      setBattleOver(true);
      if (battle.matchStatus === "player_victory") {
        onBattleEnd("player", playerName, enemyName);
        MessageManager.showMessage(
          "success",
          `${battle.playerPokemon.name} ${t("battle_victory")}`
        );
      } else {
        onBattleEnd("ai", playerName, enemyName);
        MessageManager.showMessage(
          "error",
          `${battle.enemyPokemon.name} ${t("battle_victory")}`
        );
      }
    }
  }, [battle.matchStatus]);

  const handleAttack = async (): Promise<void> => {
    if (isLoading || battleOver || !selectedMove) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/battle/turn",
        {
          battleId,
          chosenMove: selectedMove,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newSubTurns: SubTurn[] = response.data.subTurns;
      setBattleLog((prev) => [...prev, ...newSubTurns]);

      setBattle({
        currentTurn: response.data.currentTurn,
        playerPokemon: response.data.playerPokemon,
        enemyPokemon: response.data.enemyPokemon,
        matchStatus: response.data.matchStatus,
      });
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to process turn";
      MessageManager.showMessage("error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black p-4 sm:p-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-yellow-500 drop-shadow-lg mb-2">
          ⚔️ {t("battle_status")} ⚔️
        </h1>
        <p className="text-lg text-yellow-300 font-bold">{t("battle_current_turn", { turn: battle.currentTurn })}</p>
      </div>

      {/* Pokemon Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PokemonCard
          name={battle.playerPokemon.name}
          sprite={battle.playerPokemon.sprite}
          currentHp={battle.playerPokemon.currentHp}
          maxHp={battle.playerPokemon.maxHp}
          attack={battle.playerPokemon.attack}
          defense={battle.playerPokemon.defense}
          speed={battle.playerPokemon.speed}
          lastMove={
            battleLog.length > 0
              ? battleLog
                  .filter((t) => t.attacker === battle.playerPokemon.name)
                  .pop()?.action
              : undefined
          }
          isPlayer={true}
        />

        <PokemonCard
          name={battle.enemyPokemon.name}
          sprite={battle.enemyPokemon.sprite}
          currentHp={battle.enemyPokemon.currentHp}
          maxHp={battle.enemyPokemon.maxHp}
          attack={battle.enemyPokemon.attack}
          defense={battle.enemyPokemon.defense}
          speed={battle.enemyPokemon.speed}
          lastMove={
            battleLog.length > 0
              ? battleLog
                  .filter((t) => t.attacker === battle.enemyPokemon.name)
                  .pop()?.action
              : undefined
          }
          isPlayer={false}
        />
      </div>

      {/* Battle Log */}
      <div className="flex-grow mb-8 bg-gray-900 border-4 border-yellow-600 rounded-2xl p-6 overflow-y-auto max-h-64 shadow-inner">
        <h2 className="text-xl font-black text-yellow-500 mb-4">⚡ {t("battle_log")}</h2>
        <div className="space-y-3">
          {battleLog.length === 0 ? (
            <p className="text-gray-500 italic">{t("common_loading")}...</p>
          ) : (
            battleLog.map((turn, index) => (
              <div
                key={index}
                className="bg-gray-800 border-l-4 border-yellow-500 p-3 rounded text-sm font-semibold text-gray-100"
              >
                <p className="text-yellow-400 mb-1">
                  {t("battle_turn")} {turn.turnNumber} - {turn.attacker}
                </p>
                <p className="text-white">{turn.narrative}</p>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Controls */}
      {!battleOver ? (
        <div className="bg-gray-900 border-4 border-yellow-600 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-black text-yellow-500 mb-4">🎯 {t("battle_select_move")}</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow">
              <select
                value={selectedMove}
                onChange={(e) => setSelectedMove(e.target.value)}
                disabled={isLoading}
                className="w-full p-3 rounded-xl bg-gray-800 text-white border-2 border-yellow-600 focus:border-yellow-400 outline-none font-bold capitalize disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(battle.playerPokemon.moves || []).map((move) => (
                  <option key={move} value={move} className="capitalize">
                    {move}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAttack}
              disabled={isLoading}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-500 text-gray-950 px-8 py-3 rounded-xl font-black text-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "⏳ " + t("common_loading") : "⚡ " + t("battle_start")}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl p-8 text-center shadow-2xl border-4 border-yellow-700">
          <h2 className="text-3xl font-black text-gray-950 mb-3">
            {battle.matchStatus === "player_victory" ? "🎉 " + t("battle_victory") : "💔 " + t("battle_defeat")}
          </h2>
          <p className="text-xl font-bold text-gray-900 mb-6">
            {battle.matchStatus === "player_victory"
              ? `${battle.playerPokemon.name} ${t("battle_player_wins")}`
              : `${battle.enemyPokemon.name} ${t("battle_player_loses")}`}
          </p>
          <div className="text-2xl font-black text-gray-950 mb-6">
            {battle.matchStatus === "player_victory" ? "🏆 +100 XP" : "0 XP"}
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-gray-950 hover:bg-gray-900 text-yellow-400 px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
          >
            {t("battle_return_home")}
          </button>
        </div>
      )}
    </div>
  );
};
