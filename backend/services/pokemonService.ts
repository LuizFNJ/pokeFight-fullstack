import axios, { AxiosResponse } from "axios";

const POKE_API_URL = "https://pokeapi.co/api/v2";

interface PokemonApiListItem {
  name: string;
  url: string;
}

interface PokemonRootListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonApiListItem[];
}

interface PokemonTypeReference {
  name: string;
  url: string;
}

interface PokemonTypeSlot {
  slot: number;
  type: PokemonTypeReference;
}

interface PokemonStatReference {
  name: string;
  url: string;
}

interface PokemonStatEntry {
  base_stat: number;
  effort: number;
  stat: PokemonStatReference;
}

interface PokemonSpritesOfficialArtwork {
  front_default: string | null;
}

interface PokemonSpritesOther {
  "official-artwork": PokemonSpritesOfficialArtwork;
}

interface PokemonSprites {
  other: PokemonSpritesOther;
  front_default: string | null;
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStatEntry[];
  species: { url: string };
}

interface FlavorTextLanguage {
  name: string;
}

interface FlavorTextEntry {
  language: FlavorTextLanguage;
  flavor_text: string;
}

interface PokemonSpeciesResponse {
  flavor_text_entries: FlavorTextEntry[];
}

type PokemonStatKey = "hp" | "attack" | "defense";
type PokemonStats = Partial<Record<PokemonStatKey, number>>;

interface PokemonListItem {
  id: number;
  name: string;
  image: string | null;
  types: string[];
  description: string;
  stats: PokemonStats;
}

interface PokemonListResult {
  data: PokemonListItem[];
  total: number;
  currentPage: number;
  totalPages: number;
}

let cachedPokemons: PokemonListItem[] = [];

const getPokemons = async (
  nameFilter = "",
  typeFilter = "",
  page = 1,
  limit = 12,
): Promise<PokemonListResult> => {
  try {
    if (cachedPokemons.length === 0) {
      console.log("Empty cache. Fetching 151 Pokémon from PokeAPI...");

      const response: AxiosResponse<PokemonRootListResponse> = await axios.get(
        `${POKE_API_URL}/pokemon?limit=151`,
      );

      const basicList = response.data.results;

      cachedPokemons = await Promise.all(
        basicList.map(async (pokemon) => {
          const detailResponse: AxiosResponse<PokemonDetailResponse> =
            await axios.get(pokemon.url);

          const speciesUrl = detailResponse.data.species.url;
          const speciesDetail: AxiosResponse<PokemonSpeciesResponse> =
            await axios.get(speciesUrl);

          const descriptionEntry = speciesDetail.data.flavor_text_entries.find(
            (entry) => entry.language.name === "en",
          );
          const description = descriptionEntry
            ? descriptionEntry.flavor_text.replace(/\f/g, " ")
            : "No description available.";

          const stats: PokemonStats = {};
          detailResponse.data.stats.forEach((s) => {
            if (["hp", "attack", "defense"].includes(s.stat.name)) {
              stats[s.stat.name as PokemonStatKey] = s.base_stat;
            }
          });

          return {
            id: detailResponse.data.id,
            name: detailResponse.data.name,
            image:
              detailResponse.data.sprites.other["official-artwork"]
                .front_default || detailResponse.data.sprites.front_default,
            types: detailResponse.data.types.map((type) => type.type.name),
            description,
            stats,
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

export default { getPokemons };
