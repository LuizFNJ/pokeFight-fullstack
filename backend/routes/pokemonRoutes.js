const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemonController");
const { requireAuthForFilters } = require("../src/middlewares/authMiddleware");

router.get("/", requireAuthForFilters, pokemonController.listAll);

module.exports = router;
