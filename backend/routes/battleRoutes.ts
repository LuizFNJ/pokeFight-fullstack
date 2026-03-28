import { Router } from "express";
import { startBattle, processTurn, getBattle } from "../controllers/battleController";
import { verifyToken } from "../src/middlewares/authMiddleware";

const router = Router();

/**
 * POST /api/battle/start
 * Start a new battle (requires authentication)
 */
router.post("/start", verifyToken, startBattle);

/**
 * POST /api/battle/turn
 * Process a turn in the battle (requires authentication)
 */
router.post("/turn", verifyToken, processTurn);

/**
 * GET /api/battle/:battleId
 * Get battle details (requires authentication)
 */
router.get("/:battleId", verifyToken, getBattle);

export default router;
