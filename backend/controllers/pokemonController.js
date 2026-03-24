const pokemonService = require("../services/pokemonService");

const listAll = async (req, res) => {
  try {
    const { name, type, page = 1, limit = 12 } = req.query;

    const result = await pokemonService.getPokemons(name, type, page, limit);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { listAll };
