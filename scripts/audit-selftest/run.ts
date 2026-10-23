/**
 * Website audit self test.
 *
 *   bun run audit:test
 *
 * Runs every suite in its own process (each one replaces fetch, DNS and TLS
 * with fakes, so nothing here touches the network or a real site) and exits
 * with an error if any check fails. Run it before changing the audit engine.
 */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const suites = ['engine.test.ts', 'page-checks.test.ts', 'site-checks.test.ts', 'round-d.test.ts'];
let failed = 0;

for (const suite of suites) {
  console.log(`\n=== ${suite}`);
  const run = spawnSync(process.execPath, [join(import.meta.dir ?? __dirname, suite)], { stdio: 'inherit' });
  if (run.status !== 0) failed++;
}

console.log(failed === 0 ? '\nAll website audit suites passed.' : `\n${failed} of ${suites.length} suites failed.`);
process.exit(failed === 0 ? 0 : 1);
