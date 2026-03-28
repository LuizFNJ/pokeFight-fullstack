import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface PokemonStats {
  hp?: number;
  attack?: number;
  defense?: number;
}

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image?: string;
  description: string;
  stats?: PokemonStats;
}

interface ApiResponse {
  data: Pokemon[];
  totalPages: number;
}

const typeColors: Record<string, string> = {
  fire: "from-orange-400 to-red-600 border-red-700 text-red-950",
  water: "from-blue-400 to-cyan-600 border-cyan-700 text-cyan-950",
  grass: "from-green-400 to-emerald-600 border-emerald-700 text-emerald-950",
  electric: "from-yellow-300 to-yellow-500 border-yellow-600 text-yellow-950",
  bug: "from-lime-400 to-lime-600 border-lime-700 text-lime-950",
  poison: "from-purple-400 to-purple-600 border-purple-700 text-purple-950",
  normal: "from-gray-300 to-gray-500 border-gray-600 text-gray-950",
  ground: "from-yellow-600 to-yellow-800 border-yellow-900 text-yellow-950",
  fairy: "from-pink-300 to-pink-500 border-pink-600 text-pink-950",
  fighting: "from-red-600 to-red-800 border-red-900 text-red-950",
  psychic: "from-pink-500 to-pink-700 border-pink-800 text-pink-950",
  rock: "from-yellow-700 to-yellow-900 border-yellow-950 text-yellow-950",
  ghost: "from-purple-600 to-purple-800 border-purple-900 text-purple-950",
  ice: "from-cyan-200 to-cyan-400 border-cyan-500 text-cyan-950",
  dragon: "from-indigo-500 to-indigo-700 border-indigo-800 text-indigo-950",
};

export default function Home(): JSX.Element {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const isLogged = !!localStorage.getItem("token");

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const loadPokemons = async (
    currentSearch: string,
    currentType: string,
    pageNumber: number = 1,
    isLoadMore: boolean = false,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.get<ApiResponse>(
        `http://localhost:3000/api/pokemons?name=${currentSearch.toLowerCase()}&type=${currentType}&page=${pageNumber}&limit=12`,
        config,
      );

      if (isLoadMore) {
        setPokemons((prev: Pokemon[]) => [...prev, ...response.data.data]);
      } else {
        setPokemons(response.data.data);
      }

      setHasMore(pageNumber < response.data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPokemons("", "", 1, false);
  }, []);

  const handleFilter = (): void => {
    if (!isLogged) return;
    loadPokemons(search, type, 1, false);
  };

  const handleLoadMore = (): void => {
    loadPokemons(search, type, page + 1, true);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-950 text-gray-100 font-sans flex flex-col">
      <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12 max-w-7xl mx-auto w-full border-b border-gray-800 pb-6 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]">
          Poke<span className="text-white">Collector</span>
        </h1>

        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          {isLogged ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400 hidden md:block">
                Logged-in Researcher
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-800 border border-gray-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => navigate("/auth")}
                className="text-gray-300 font-bold hover:text-white transition-colors text-sm sm:text-base px-4 py-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md text-sm sm:text-base flex-1 sm:flex-none"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </nav>

      <header className="mb-12 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-6 bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Pikachu, Charizard..."
            disabled={!isLogged}
            className="w-full md:w-80 p-4 rounded-xl border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-red-500 outline-none transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />

          <select
            disabled={!isLogged}
            className="w-full md:w-60 p-4 rounded-xl border-2 border-gray-700 bg-gray-800 text-white shadow-inner outline-none focus:border-red-500 capitalize disabled:opacity-50 disabled:cursor-not-allowed"
            value={type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            {Object.keys(typeColors).map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>

          <div className="group relative w-full md:w-auto flex justify-center">
            <button
              onClick={handleFilter}
              disabled={!isLogged || isLoading}
              className="w-full bg-red-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && page === 1 ? "Searching..." : "Filter Collection"}
            </button>

            {!isLogged && (
              <div className="absolute bottom-full mb-4 hidden group-hover:block w-max bg-red-950 border border-red-500 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-2xl z-50 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-red-500">
                Only logged-in researchers can use the filters.
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 flex-grow">
        {pokemons.map((pokemon: Pokemon) => {
          const mainType = pokemon.types[0];
          const colorClass = typeColors[mainType] || typeColors.normal;
          const [gradient, border, text] = colorClass.split(" ");

          return (
            <div
              key={`${pokemon.id}-${Math.random()}`}
              className="relative flex flex-col rounded-3xl border-8 border-gray-950 p-2 bg-gray-950 shadow-2xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div
                className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 flex flex-col flex-grow`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className={`text-3xl font-black capitalize ${text} drop-shadow-sm`}
                  >
                    {pokemon.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-950/70">
                      HP
                    </span>
                    <span className="text-2xl font-bold text-gray-950">
                      {" "}
                      {pokemon.stats?.hp || 50}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-2 border-4 border-gray-950/20 shadow-inner flex items-center justify-center mb-4 min-h-56">
                  {pokemon.image ? (
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-48 h-48 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                    />
                  ) : (
                    <div className="text-gray-400 italic">No Image</div>
                  )}
                </div>

                <div className="bg-gray-950/80 rounded-xl p-4 border border-gray-950 flex flex-col flex-grow mb-4">
                  <p className="text-xs italic text-gray-300 leading-relaxed mb-4 min-h-16">
                    "{pokemon.description}"
                  </p>

                  <div className="space-y-3 mt-auto">
                    {[
                      {
                        label: "ATK",
                        value: pokemon.stats?.attack,
                        color: "bg-red-500",
                      },
                      {
                        label: "DEF",
                        value: pokemon.stats?.defense,
                        color: "bg-blue-500",
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-8">
                          {stat.label}
                        </span>
                        <div className="flex-grow bg-gray-700 rounded-full h-2 overflow-hidden border border-gray-600">
                          <div
                            className={`${stat.color} h-2 rounded-full`}
                            style={{ width: `${((stat.value || 0) / 150) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-300 w-8 text-right">
                          {stat.value || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-sm font-bold text-gray-950/70">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                  <div className="flex gap-2">
                    {pokemon.types.map((t: string) => (
                      <span
                        key={t}
                        className={`text-xs ${border} bg-white/20 px-3 py-1 rounded-full font-bold uppercase border text-gray-950`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center pb-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-transparent border-2 border-red-600 text-red-500 px-12 py-4 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Searching..." : "Load More"}
          </button>
        </div>
      )}

      {!hasMore && pokemons.length > 0 && (
        <div className="mt-12 text-center text-gray-500 font-bold pb-8">
          You've captured all results!
        </div>
      )}
    </div>
  );
}
