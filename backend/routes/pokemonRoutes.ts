import { Router } from "express";
import { listAll } from "../controllers/pokemonController";
import { requireAuthForFilters } from "../src/middlewares/authMiddleware";

const router = Router();
router.get("/", requireAuthForFilters, listAll);

export default router;
