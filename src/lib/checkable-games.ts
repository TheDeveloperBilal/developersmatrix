import { gamesDatabase } from "@/data/games-database";

export type CheckableGame = { id: string; name: string; short: string | null };

// Games a quick check can answer for: every game whose publisher has released
// PC specs, most searched first. GTA 6 has no PC specs yet, so it is left out
// (it keeps its own card and hub). Server only: pass the list to client parts
// so they never load the whole games database.
export const checkableGames: CheckableGame[] = gamesDatabase
  .filter((g) => g.requirementsStatus !== "unannounced")
  .slice()
  .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0) || a.name.localeCompare(b.name))
  .map((g) => ({ id: g.id, name: g.name, short: g.searchName ?? null }));
