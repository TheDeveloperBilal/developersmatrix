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
  .map((g) => ({ id: g.id, name: g.name }));

export default function TryIt() {
  return (
    <section className="border-t border-ink-100/60 py-16 overflow-hidden lg:py-20" aria-labelledby="try-heading">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Try it right here</p>
          <h2
            id="try-heading"
            className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
          >
            Two quick answers, no signup
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Check whether your PC can run a game, or see how your website compares with the local
            business websites in our 2026 study. Each one takes under a minute.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <QuickPcCheck games={checkableGames} />
          <SiteCompare />
        </div>
      </div>
    </section>
  );
}
