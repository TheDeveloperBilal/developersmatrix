import { gamesDatabase } from "@/data/games-database";
import QuickPcCheck from "./quick-pc-check";
import SiteCompare from "./site-compare";

// Games the quick check can answer for: every game whose publisher has
// released PC specs, most searched first. GTA 6 has no PC specs yet, so it
// is left out here and keeps its own card above.
const checkableGames = gamesDatabase
  .filter((g) => g.requirementsStatus !== "unannounced")
  .slice()
  .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0) || a.name.localeCompare(b.name))
  .map((g) => ({ id: g.id, name: g.name, short: g.searchName ?? null }));

export default function TryIt() {
  return (
    <section className="py-16 overflow-hidden lg:py-20" aria-labelledby="try-heading">
      <div className="shell">
        <p className="eyebrow">Try it now</p>
        <h2
          id="try-heading"
          className="mt-4 font-sora text-3xl font-semibold tracking-tight text-ink-950 sm:text-[2.1rem]"
        >
          Two quick answers
        </h2>
        <p className="mt-2 text-[0.95rem] text-ink-500">No signup. Under a minute each.</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          <QuickPcCheck games={checkableGames} />
          <SiteCompare />
        </div>
      </div>
    </section>
  );
}
