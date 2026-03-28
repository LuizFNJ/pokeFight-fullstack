import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Battle, BattleDocument, IPokemonState, ITurn } from "../src/models/Battle";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

interface PokeAPIResponse {
  stats: Array<{
    stat: {
      name: string;
    };
    base_stat: number;
  }>;
  moves: Array<{
    move: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string;
  };
}

/**
 * Fetch pokémon data from PokeAPI
 */
async function fetchPokemonData(
  pokemonName: string,
): Promise<{
  stats: PokemonStats;
  moves: string[];
  sprite: string;
}> {
  const response = await axios.get<PokeAPIResponse>(
    `${POKEAPI_BASE}/pokemon/${pokemonName.toLowerCase()}`,
  );

  const statsMap: Record<string, number> = {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
  };

  response.data.stats.forEach((stat) => {
    const statName = stat.stat.name;
    if (statName in statsMap) {
      statsMap[statName] = stat.base_stat;
    }
  });

  const movesList = response.data.moves
    .slice(0, 4)
    .map((moveEntry) => moveEntry.move.name);

  return {
    stats: {
      hp: statsMap.hp,
      attack: statsMap.attack,
      defense: statsMap.defense,
      speed: statsMap.speed,
    },
    moves: movesList.length > 0 ? movesList : ["tackle"],
    sprite: response.data.sprites.front_default || "",
  };
}

/**
 * Get a random pokémon from IDs 1-151
 */
function getRandomPokemonId(): number {
  return Math.floor(Math.random() * 151) + 1;
}

/**
 * Create a PokemonState from PokeAPI data
 */
function createPokemonState(
  name: string,
  stats: PokemonStats,
  moves: string[],
  sprite: string,
): IPokemonState {
  return {
    name,
    currentHp: stats.hp,
    maxHp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    speed: stats.speed,
    moves,
    sprite,
  };
}

/**
 * Calculate damage dealt in a single attack
 */
function calculateDamage(attacker: IPokemonState, defender: IPokemonState): number {
  const randomMultiplier = Math.floor(Math.random() * 16) + 10; // 10-25
  const rawDamage = attacker.attack + randomMultiplier - defender.defense;
  return Math.max(1, rawDamage);
}

/**
 * Get type emoji for narrative
 */
function getTypeEmoji(moveName: string): string {
  const typeMap: Record<string, string> = {
    fire: "🔥",
    water: "💧",
    grass: "🌿",
    electric: "⚡",
    psychic: "🧠",
    ice: "❄️",
    dragon: "🐉",
    dark: "🌑",
    fairy: "✨",
    fighting: "👊",
    flying: "🪶",
    poison: "☠️",
    ground: "🌍",
    rock: "🪨",
    bug: "🐛",
    ghost: "👻",
    steel: "⚙️",
    normal: "⭐",
  };

  for (const [type, emoji] of Object.entries(typeMap)) {
    if (moveName.toLowerCase().includes(type)) {
      return emoji;
    }
  }

  return "⚡";
}

/**
 * Generate narrative for a turn
 */
function generateNarrative(
  attacker: string,
  action: string,
  damageDealt: number,
  defenderRemainingHp: number,
): string {
  const emoji = getTypeEmoji(action);
  const intensity = damageDealt > 30 ? "DEVASTATING" : damageDealt > 15 ? "STRONG" : "quick";
  return `${emoji} ${attacker} unleashes a ${intensity.toUpperCase()} ${action.toUpperCase()}! The opponent staggers back with only ${defenderRemainingHp} HP remaining!`;
}

/**
 * Start a new battle
 */
export async function startBattle(userId: string, playerPokemonName: string): Promise<BattleDocument> {
  try {
    // Fetch player pokémon data
    const playerData = await fetchPokemonData(playerPokemonName);
    const playerPokemon = createPokemonState(
      playerPokemonName,
      playerData.stats,
      playerData.moves,
      playerData.sprite,
    );

    // Fetch enemy pokémon data (random from 1-151)
    const enemyPokemonId = getRandomPokemonId();
    const enemyData = await fetchPokemonData(String(enemyPokemonId));
    const enemyPokemon = createPokemonState(
      `Pokemon #${enemyPokemonId}`,
      enemyData.stats,
      enemyData.moves,
      enemyData.sprite,
    );

    // Create battle document
    const battleId = uuidv4();
    const battle = new Battle({
      battleId,
      userId,
      playerPokemon,
      enemyPokemon,
      currentTurn: 1,
      matchStatus: "ongoing",
      turnHistory: [],
    });

    await battle.save();
    return battle;
  } catch (error) {
    throw new Error(`Failed to start battle: ${error}`);
  }
}

/**
 * Process a player turn
 */
export async function processPlayerTurn(
  battleId: string,
  chosenMove: string,
): Promise<{ subTurns: ITurn[]; battle: BattleDocument }> {
  const battle = await Battle.findOne({ battleId });

  if (!battle) {
    throw new Error("Battle not found");
  }

  if (battle.matchStatus !== "ongoing") {
    throw new Error("Battle is already over");
  }

  // Validate chosen move
  if (!battle.playerPokemon.moves.includes(chosenMove)) {
    throw new Error("Invalid move");
  }

  const subTurns: ITurn[] = [];
  const currentTurn = battle.currentTurn;

  // Player attacks first if player's speed is higher or equal
  let playerAttacksFirst =
    battle.playerPokemon.speed >= battle.enemyPokemon.speed;

  if (playerAttacksFirst) {
    // Player turn
    const playerDamage = calculateDamage(battle.playerPokemon, battle.enemyPokemon);
    battle.enemyPokemon.currentHp = Math.max(0, battle.enemyPokemon.currentHp - playerDamage);

    const playerTurn: ITurn = {
      turnNumber: currentTurn,
      attacker: battle.playerPokemon.name,
      action: chosenMove,
      damageDealt: playerDamage,
      defenderRemainingHp: battle.enemyPokemon.currentHp,
      matchStatus: battle.enemyPokemon.currentHp <= 0 ? "player_victory" : "ongoing",
      narrative: generateNarrative(
        battle.playerPokemon.name,
        chosenMove,
        playerDamage,
        battle.enemyPokemon.currentHp,
      ),
    };

    subTurns.push(playerTurn);
    battle.turnHistory.push(playerTurn);

    // Check if enemy is defeated
    if (battle.enemyPokemon.currentHp <= 0) {
      battle.matchStatus = "player_victory";
      battle.currentTurn += 1;
      await battle.save();
      return { subTurns, battle };
    }

    // AI turn
    const aiMove = battle.enemyPokemon.moves[
      Math.floor(Math.random() * battle.enemyPokemon.moves.length)
    ];
    const aiDamage = calculateDamage(battle.enemyPokemon, battle.playerPokemon);
    battle.playerPokemon.currentHp = Math.max(0, battle.playerPokemon.currentHp - aiDamage);

    const aiTurn: ITurn = {
      turnNumber: currentTurn,
      attacker: battle.enemyPokemon.name,
      action: aiMove,
      damageDealt: aiDamage,
      defenderRemainingHp: battle.playerPokemon.currentHp,
      matchStatus: battle.playerPokemon.currentHp <= 0 ? "ai_victory" : "ongoing",
      narrative: generateNarrative(
        battle.enemyPokemon.name,
        aiMove,
        aiDamage,
        battle.playerPokemon.currentHp,
      ),
    };

    subTurns.push(aiTurn);
    battle.turnHistory.push(aiTurn);

    if (battle.playerPokemon.currentHp <= 0) {
      battle.matchStatus = "ai_victory";
    }
  } else {
    // Enemy attacks first
    const aiMove = battle.enemyPokemon.moves[
      Math.floor(Math.random() * battle.enemyPokemon.moves.length)
    ];
    const aiDamage = calculateDamage(battle.enemyPokemon, battle.playerPokemon);
    battle.playerPokemon.currentHp = Math.max(0, battle.playerPokemon.currentHp - aiDamage);

    const aiTurn: ITurn = {
      turnNumber: currentTurn,
      attacker: battle.enemyPokemon.name,
      action: aiMove,
      damageDealt: aiDamage,
      defenderRemainingHp: battle.playerPokemon.currentHp,
      matchStatus: battle.playerPokemon.currentHp <= 0 ? "ai_victory" : "ongoing",
      narrative: generateNarrative(
        battle.enemyPokemon.name,
        aiMove,
        aiDamage,
        battle.playerPokemon.currentHp,
      ),
    };

    subTurns.push(aiTurn);
    battle.turnHistory.push(aiTurn);

    if (battle.playerPokemon.currentHp <= 0) {
      battle.matchStatus = "ai_victory";
      battle.currentTurn += 1;
      await battle.save();
      return { subTurns, battle };
    }

    // Player turn
    const playerDamage = calculateDamage(battle.playerPokemon, battle.enemyPokemon);
    battle.enemyPokemon.currentHp = Math.max(0, battle.enemyPokemon.currentHp - playerDamage);

    const playerTurn: ITurn = {
      turnNumber: currentTurn,
      attacker: battle.playerPokemon.name,
      action: chosenMove,
      damageDealt: playerDamage,
      defenderRemainingHp: battle.enemyPokemon.currentHp,
      matchStatus: battle.enemyPokemon.currentHp <= 0 ? "player_victory" : "ongoing",
      narrative: generateNarrative(
        battle.playerPokemon.name,
        chosenMove,
        playerDamage,
        battle.enemyPokemon.currentHp,
      ),
    };

    subTurns.push(playerTurn);
    battle.turnHistory.push(playerTurn);

    if (battle.enemyPokemon.currentHp <= 0) {
      battle.matchStatus = "player_victory";
    }
  }

  // Check for turn limit (maximum 5 turns)
  if (battle.currentTurn > 5 && battle.matchStatus === "ongoing") {
    if (battle.playerPokemon.currentHp > battle.enemyPokemon.currentHp) {
      battle.matchStatus = "player_victory";
      const finalDamage = battle.enemyPokemon.currentHp;
      const finalTurn: ITurn = {
        turnNumber: battle.currentTurn,
        attacker: battle.playerPokemon.name,
        action: "final-strike",
        damageDealt: finalDamage,
        defenderRemainingHp: 0,
        matchStatus: "player_victory",
        narrative: `⚡ TIME LIMIT! ${battle.playerPokemon.name} lands a FINAL STRIKE! Victory to the player!`,
      };
      subTurns.push(finalTurn);
      battle.turnHistory.push(finalTurn);
    } else if (battle.enemyPokemon.currentHp > battle.playerPokemon.currentHp) {
      battle.matchStatus = "ai_victory";
      const finalDamage = battle.playerPokemon.currentHp;
      const finalTurn: ITurn = {
        turnNumber: battle.currentTurn,
        attacker: battle.enemyPokemon.name,
        action: "final-strike",
        damageDealt: finalDamage,
        defenderRemainingHp: 0,
        matchStatus: "ai_victory",
        narrative: `⚡ TIME LIMIT! ${battle.enemyPokemon.name} lands a FINAL STRIKE! Victory to the enemy!`,
      };
      subTurns.push(finalTurn);
      battle.turnHistory.push(finalTurn);
    }
  }

  battle.currentTurn += 1;
  await battle.save();

  return { subTurns, battle };
}

/**
 * Get battle details
 */
export async function getBattleDetails(battleId: string): Promise<BattleDocument | null> {
  return await Battle.findOne({ battleId });
}
