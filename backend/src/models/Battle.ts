import mongoose, { Schema } from "mongoose";

interface IPokemonState {
  name: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: string[];
  sprite: string;
}

interface ITurn {
  turnNumber: number;
  attacker: string;
  action: string;
  damageDealt: number;
  defenderRemainingHp: number;
  matchStatus: string;
  narrative: string;
}

interface BattleDocument {
  battleId: string;
  userId: string;
  playerPokemon: IPokemonState;
  enemyPokemon: IPokemonState;
  currentTurn: number;
  matchStatus: "ongoing" | "player_victory" | "ai_victory";
  turnHistory: ITurn[];
  createdAt: Date;
}

const pokemonStateSchema = new Schema<IPokemonState>(
  {
    name: {
      type: String,
      required: true,
    },
    currentHp: {
      type: Number,
      required: true,
    },
    maxHp: {
      type: Number,
      required: true,
    },
    attack: {
      type: Number,
      required: true,
    },
    defense: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    moves: {
      type: [String],
      required: true,
    },
    sprite: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const turnSchema = new Schema<ITurn>(
  {
    turnNumber: {
      type: Number,
      required: true,
    },
    attacker: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    damageDealt: {
      type: Number,
      required: true,
    },
    defenderRemainingHp: {
      type: Number,
      required: true,
    },
    matchStatus: {
      type: String,
      required: true,
    },
    narrative: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const battleSchema = new Schema<BattleDocument>(
  {
    battleId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    playerPokemon: {
      type: pokemonStateSchema,
      required: true,
    },
    enemyPokemon: {
      type: pokemonStateSchema,
      required: true,
    },
    currentTurn: {
      type: Number,
      required: true,
      default: 1,
    },
    matchStatus: {
      type: String,
      enum: ["ongoing", "player_victory", "ai_victory"],
      required: true,
      default: "ongoing",
    },
    turnHistory: {
      type: [turnSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Battle = mongoose.model<BattleDocument>("Battle", battleSchema);

export { Battle, BattleDocument, IPokemonState, ITurn };
