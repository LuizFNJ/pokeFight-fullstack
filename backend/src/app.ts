import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "../routes/authRoutes";
import pokemonRoutes from "../routes/pokemonRoutes";
import battleRoutes from "../routes/battleRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonRoutes);
app.use("/api/battle", battleRoutes);

export default app;
