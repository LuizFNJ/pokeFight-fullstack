# 🎴 Prompt: Pokémon Battle Engine & Dungeon Master

## System Context

You are the **battle logic engine** of PokeCollector — a fullstack application built with **React (Vite) + TypeScript** on the frontend and **Node.js + Express** on the backend, using **MongoDB/Mongoose** for persistence and **TailwindCSS** for styling with a TCG (Trading Card Game) aesthetic.

All data logic comes from the **PokeAPI** (`https://pokeapi.co/api/v2`). You must never fabricate attributes that do not exist in this API.

---

## 🧱 Expected Architecture

### Backend — Node.js + Express (Layered)

Create the following routes protected by **JWT** (only authenticated users can battle):

```
POST /api/battle/start
POST /api/battle/turn
GET  /api/battle/:battleId
```

Organize into layers:

- `routes/battle.routes.ts` — route definitions
- `controllers/battle.controller.ts` — receives requests, calls services
- `services/battle.service.ts` — **all** combat logic lives here
- `models/Battle.ts` — Mongoose schema to persist battle state

### Frontend — React + TypeScript + TailwindCSS

Create a `BattleArena` component with a TCG card aesthetic, displaying for each Pokémon:

- Sprite (via PokeAPI `sprites.front_default`)
- Current HP / Max HP (styled health bar)
- Stats: `attack`, `defense`, `speed`
- Name of the last move used

---

## 📦 Mongoose Schema — `Battle`

```typescript
interface IBattle {
  battleId: string;           // UUID generated at start
  userId: string;             // ref to authenticated user
  playerPokemon: IPokemonState;
  enemyPokemon: IPokemonState;
  currentTurn: number;
  matchStatus: 'ongoing' | 'player_victory' | 'ai_victory';
  turnHistory: ITurn[];
  createdAt: Date;
}

interface IPokemonState {
  name: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: string[];            // list of move names from PokeAPI
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
```

---

## ⚔️ Combat Rules — `battle.service.ts`

### 1. Initialization (`startBattle`)

- Receive two Pokémon names (player chooses theirs; enemy is randomly drawn from IDs 1–151).
- Query the PokeAPI to fetch `stats` and `moves` for each one.
- Map the stats: `hp`, `attack`, `defense`, `speed` (use the `base_stat` value from each entry).
- Persist the initial state in MongoDB and return the `battleId`.

### 2. Initiative

- The Pokémon with the highest `speed` attacks first each turn.
- In case of a tie, the player's Pokémon has priority.

### 3. Damage Calculation

```
randomMultiplier = random integer between 10 and 25
rawDamage = (attackerAttack + randomMultiplier) - defenderDefense
damageDealt = Math.max(1, rawDamage)   // minimum always 1
```

### 4. Player Turn

- Receives via `POST /api/battle/turn` the field `{ battleId, chosenMove: string }`.
- Validate that `chosenMove` is in the player's Pokémon `moves` list.

### 5. AI Turn

- After the player's attack (if the enemy is still alive), the AI randomly picks a move from the enemy Pokémon's `moves` list.
- Execute the AI's damage against the player in the same call, returning both sub-turns in the response.

### 6. Victory Condition

- If `currentHp <= 0` after any attack, end the battle.
- Update `matchStatus` to `'player_victory'` or `'ai_victory'`.
- Persist the final result in MongoDB.

### 7. Balance (maximum 5 turns)

- If `currentTurn > 5` and the battle is still `ongoing`, apply a "Final Strike": the Pokémon with the highest current HP wins automatically, with `damageDealt` equal to the opponent's remaining HP.

---

## 📤 Response Format — `POST /api/battle/turn`

Always return an object with this structure:

```json
{
  "currentTurn": 2,
  "subTurns": [
    {
      "turnNumber": 2,
      "attacker": "Pikachu",
      "action": "thunder-shock",
      "damageDealt": 18,
      "defenderRemainingHp": 32,
      "matchStatus": "ongoing",
      "narrative": "⚡ Pikachu unleashes a DEVASTATING THUNDER-SHOCK! Charmander staggers back with only 32 HP remaining!"
    },
    {
      "turnNumber": 2,
      "attacker": "Charmander",
      "action": "ember",
      "damageDealt": 12,
      "defenderRemainingHp": 45,
      "matchStatus": "ongoing",
      "narrative": "🔥 Charmander strikes back with EMBER! The flames lick at Pikachu, who holds on with 45 HP!"
    }
  ],
  "playerPokemon": { "name": "Pikachu", "currentHp": 45, "maxHp": 70 },
  "enemyPokemon": { "name": "Charmander", "currentHp": 32, "maxHp": 65 },
  "matchStatus": "ongoing"
}
```

---

## 🎨 Frontend — `BattleArena` Component

**Style:** Pokémon TCG card aesthetic with TailwindCSS. Use `card` containers with golden/yellow borders, dark textured backgrounds, and bold typography.

Implement in **React + TypeScript**:

```tsx
// Display per Pokémon (two cards side by side):
<PokemonCard
  name={string}
  sprite={string}          // URL from PokeAPI
  currentHp={number}
  maxHp={number}
  attack={number}
  defense={number}
  speed={number}
  lastMove={string}
  isPlayer={boolean}
/>

// HP Bar: changes color (green > yellow > red) as HP drops
// Battle Log: scrollable list of `narrative` from each sub-turn
// Move Button: dropdown with the player's Pokémon moves (disabled during AI turn)
```

Use **Axios** to call the `/api/battle/*` routes, including the `Authorization: Bearer <token>` header (token stored in the existing authentication context of the project).

---

## 🚫 Mandatory Restrictions

| Restriction | Details |
|---|---|
| **No single-letter variables** | Use `damage`, `turn`, `attacker`, `defender`, `result` — never `d`, `t`, `a` |
| **No opinionated frameworks** | Pure Express only, no NestJS or Next.js |
| **Protected routes** | All battle routes require a valid JWT (middleware already exists in the project) |
| **Real PokeAPI data** | Never fabricate stats; always query `https://pokeapi.co/api/v2/pokemon/{name}` |
| **RPG narrator tone** | The `narrative` field must be enthusiastic, with type emojis and epic language |
| **MongoDB persistence** | The complete battle state (including turn history) must be saved/updated every turn |