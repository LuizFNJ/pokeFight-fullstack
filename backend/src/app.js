const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../routes/authRoutes");
const pokemonRoutes = require("../routes/pokemonRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonRoutes);

module.exports = app;
