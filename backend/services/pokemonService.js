const axios = require("axios");
const POKE_API_URL = "https://pokeapi.co/api/v2";

let cachedPokemons = [];

const getPokemons = async (
  nameFilter = "",
  typeFilter = "",
  page = 1,
  limit = 12,
) => {
  try {
    if (cachedPokemons.length === 0) {
      console.log("Empty cache. Fetching 151 Pokémon from PokeAPI...");
      const response = await axios.get(`${POKE_API_URL}/pokemon?limit=151`);
      const basicList = response.data.results;

      cachedPokemons = await Promise.all(
        basicList.map(async (pokemon) => {
          const detail = await axios.get(pokemon.url);

          const speciesUrl = detail.data.species.url;
          const speciesDetail = await axios.get(speciesUrl);

          const descriptionEntry = speciesDetail.data.flavor_text_entries.find(
            (entry) => entry.language.name === "en",
          );
          const description = descriptionEntry
            ? descriptionEntry.flavor_text.replace(/\f/g, " ")
            : "No description available.";

          const stats = {};
          detail.data.stats.forEach((s) => {
            if (["hp", "attack", "defense"].includes(s.stat.name)) {
              stats[s.stat.name] = s.base_stat;
            }
          });

          return {
            id: detail.data.id,
            name: detail.data.name,
            image:
              detail.data.sprites.other["official-artwork"].front_default ||
              detail.data.sprites.front_default,
            types: detail.data.types.map((t) => t.type.name),
            description: description,
            stats: stats,
          };
        }),
      );
      console.log("Cache populated successfully!");
    }

    let filteredList = cachedPokemons;

    if (nameFilter) {
      filteredList = filteredList.filter((p) =>
        p.name.includes(nameFilter.toLowerCase()),
      );
    }

    if (typeFilter) {
      filteredList = filteredList.filter((p) =>
        p.types.includes(typeFilter.toLowerCase()),
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedList = filteredList.slice(startIndex, endIndex);

    return {
      data: paginatedList,
      total: filteredList.length,
      currentPage: Number(page),
      totalPages: Math.ceil(filteredList.length / limit),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error processing advanced Pokémon data");
  }
};

module.exports = { getPokemons };
