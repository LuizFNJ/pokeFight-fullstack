import type { Request, Response } from "express";
import * as battleService from "../services/battle.service";

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * POST /api/battle/start
 * Start a new battle
 */
export const startBattle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { playerPokemonName } = req.body;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!playerPokemonName) {
      res.status(400).json({ message: "playerPokemonName is required" });
      return;
    }

    const battle = await battleService.startBattle(userId, playerPokemonName);

    res.status(201).json({
      message: "Battle started successfully!",
      battleId: battle.battleId,
      playerPokemon: battle.playerPokemon,
      enemyPokemon: battle.enemyPokemon,
      currentTurn: battle.currentTurn,
      matchStatus: battle.matchStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Failed to start battle", error: message });
  }
};

/**
 * POST /api/battle/turn
 * Process a turn in the battle
 */
export const processTurn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { battleId, chosenMove } = req.body;

    if (!battleId) {
      res.status(400).json({ message: "battleId is required" });
      return;
    }

    if (!chosenMove) {
      res.status(400).json({ message: "chosenMove is required" });
      return;
    }

    const result = await battleService.processPlayerTurn(battleId, chosenMove);

    res.status(200).json({
      currentTurn: result.battle.currentTurn - 1,
      subTurns: result.subTurns,
      playerPokemon: {
        name: result.battle.playerPokemon.name,
        currentHp: result.battle.playerPokemon.currentHp,
        maxHp: result.battle.playerPokemon.maxHp,
      },
      enemyPokemon: {
        name: result.battle.enemyPokemon.name,
        currentHp: result.battle.enemyPokemon.currentHp,
        maxHp: result.battle.enemyPokemon.maxHp,
      },
      matchStatus: result.battle.matchStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Failed to process turn", error: message });
  }
};

/**
 * GET /api/battle/:battleId
 * Get battle details
 */
export const getBattle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const battleId = req.params.battleId;

    if (!battleId || typeof battleId !== "string") {
      res.status(400).json({ message: "battleId is required" });
      return;
    }

    const battle = await battleService.getBattleDetails(battleId);

    if (!battle) {
      res.status(404).json({ message: "Battle not found" });
      return;
    }

    res.status(200).json({
      battleId: battle.battleId,
      currentTurn: battle.currentTurn,
      matchStatus: battle.matchStatus,
      playerPokemon: battle.playerPokemon,
      enemyPokemon: battle.enemyPokemon,
      turnHistory: battle.turnHistory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Failed to fetch battle", error: message });
  }
};
