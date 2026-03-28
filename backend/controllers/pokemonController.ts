import type { Request, Response } from "express";

import pokemonService from "../services/pokemonService";

const listAll = async (req: Request, res: Response) => {
  try {
    const { name, type, page = 1, limit = 12 } = req.query;

    const result = await pokemonService.getPokemons(
      String(name ?? ""),
      String(type ?? ""),
      Number(page),
      Number(limit),
    );

    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: message });
  }
};

export { listAll };
