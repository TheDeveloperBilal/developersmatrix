// Picks the "Check another game" links for each game page.
//
// Every page used to show the same first six games from the database, so those
// six got a link from every page and the rest got none. Here each page links to
// the games a visitor of that page is most likely to check next: games that
// share its genres and need a similar graphics card.
//
// Two limits keep the links spread across the whole collection: no game is
// linked from more than MAX_INBOUND pages, and every game is linked from at
// least MIN_INBOUND pages. The result is worked out once at build time, so the
// links are the same on every visit.

import { gamesDatabase, type Game } from './games-database';
import { matchHardware } from '@/lib/hardware/catalogue';

const LINKS_PER_PAGE = 6;
const MAX_INBOUND = 8;
const MIN_INBOUND = 3;

// Broad labels that many games share. A match on these says little about
// whether two games are alike, so they count for less than a specific genre.
const BROAD_GENRES = new Set(['Action', 'Adventure', 'Multiplayer']);

/** Score of the minimum graphics card, or null when there is no usable spec. */
function gpuTier(game: Game): number | null {
  if (game.requirementsStatus === 'unannounced') return null;
  return matchHardware(game.minimumRequirements.graphics, 'gpu')?.score ?? null;
}

const tiers = new Map(gamesDatabase.map((g) => [g.id, gpuTier(g)]));

function similarity(a: Game, b: Game): number {
  let score = 0;
  for (const genre of a.genre) {
    if (b.genre.includes(genre)) score += BROAD_GENRES.has(genre) ? 1 : 3;
  }
  const ta = tiers.get(a.id);
  const tb = tiers.get(b.id);
  // Up to 2 points when both games ask for a similar minimum graphics card.
  if (ta != null && tb != null) score += 2 * Math.max(0, 1 - Math.abs(ta - tb) / 20);
  // A small nudge towards titles people search for more, used to break ties.
  score += (b.popularity ?? 0) / 1000;
  return score;
}

function buildLinks(): Map<string, Game[]> {
  const byId = new Map(gamesDatabase.map((g) => [g.id, g]));
  const ranked = new Map(
    gamesDatabase.map((page) => [
      page.id,
      gamesDatabase
        .filter((g) => g.id !== page.id)
        .sort((x, y) => similarity(page, y) - similarity(page, x) || x.id.localeCompare(y.id)),
    ]),
  );
  const inbound = new Map(gamesDatabase.map((g) => [g.id, 0]));
  const links = new Map<string, string[]>();

  // Pages people search for most choose first, so they get their closest matches.
  const order = [...gamesDatabase].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0) || a.id.localeCompare(b.id));
  for (const page of order) {
    const candidates = ranked.get(page.id)!;
    const picks: string[] = [];
    for (const c of candidates) {
      if (picks.length === LINKS_PER_PAGE) break;
      if (inbound.get(c.id)! >= MAX_INBOUND) continue;
      picks.push(c.id);
    }
    // Only when the cap leaves too few games does a page go over it.
    for (const c of candidates) {
      if (picks.length === LINKS_PER_PAGE) break;
      if (!picks.includes(c.id)) picks.push(c.id);
    }
    picks.forEach((id) => inbound.set(id, inbound.get(id)! + 1));
    links.set(page.id, picks);
  }

  // Games still linked from too few pages take the weakest slot on the most
  // similar pages, as long as the game they replace stays above the floor.
  const lowest = [...gamesDatabase].sort((a, b) => inbound.get(a.id)! - inbound.get(b.id)! || a.id.localeCompare(b.id));
  for (const target of lowest) {
    const hosts = gamesDatabase
      .filter((p) => p.id !== target.id && !links.get(p.id)!.includes(target.id))
      .sort((x, y) => similarity(y, target) - similarity(x, target) || x.id.localeCompare(y.id));
    for (const host of hosts) {
      if (inbound.get(target.id)! >= MIN_INBOUND) break;
      const picks = links.get(host.id)!;
      for (let i = picks.length - 1; i >= 0; i--) {
        if (inbound.get(picks[i])! > MIN_INBOUND) {
          inbound.set(picks[i], inbound.get(picks[i])! - 1);
          picks[i] = target.id;
          inbound.set(target.id, inbound.get(target.id)! + 1);
          break;
        }
      }
    }
  }

  const result = new Map<string, Game[]>();
  for (const page of gamesDatabase) {
    const games = links.get(page.id)!.map((id) => byId.get(id)!);
    games.sort((x, y) => similarity(page, y) - similarity(page, x) || x.id.localeCompare(y.id));
    result.set(page.id, games);
  }
  return result;
}

let cache: Map<string, Game[]> | null = null;

/** The games to link from `game`'s page, closest match first. */
export function relatedGames(game: Game): Game[] {
  cache ??= buildLinks();
  return cache.get(game.id) ?? [];
}
