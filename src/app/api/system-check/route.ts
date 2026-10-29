import { NextRequest, NextResponse } from 'next/server';
import { gamesDatabase, type Game, type GameRequirement } from '@/data/games-database';
import { matchHardware, matchAllHardware, suggestHardware, type HardwareItem, type HardwareKind } from '@/lib/hardware/catalogue';

export const runtime = 'nodejs';

interface SystemSpecs {
  cpu: string;
  gpu: string;
  ram: number;
  storage: number;
}

type Status = 'excellent' | 'good' | 'pass' | 'fail';

// When a publisher describes the minimum part in words rather than naming one
// ("4 core processor", "DirectX 11 card with 1 GB"), the requirement is always
// low end, so it is scored as entry level rather than mid range.
const UNKNOWN_REQUIREMENT_SCORE = 10;

function parseRequirement(req: string): number {
  const match = req.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Storage in GB. Handles figures given in MB (Roblox lists 300 MB) and returns 0
// when no size is stated, so a missing figure never fails the check.
function parseStorageGB(req: string): number {
  const match = req.match(/(\d+(?:\.\d+)?)\s*(GB|MB)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  return match[2].toUpperCase() === 'MB' ? Math.ceil(value / 1024) : value;
}

function ratioStatus(ratio: number): Status {
  if (ratio >= 1.5) return 'excellent';
  if (ratio >= 1.2) return 'good';
  if (ratio >= 1.0) return 'pass';
  return 'fail';
}

// Publishers list several parts they treat as equal ("GTX 1060 / RX 580"), and
// often the parts are not equally fast. Any of them is enough to run the game
// in the publisher's own words, so the visitor is compared with the slowest
// listed part. Comparing only with the first part used to fail visitors whose
// exact processor or graphics card the publisher names.
// One exception: an Intel Arc card on the same line is often far slower than
// the NVIDIA and AMD cards next to it, so it only sets the bar for visitors
// with Intel graphics.
function requiredPart(text: string, kind: HardwareKind, yours: HardwareItem): HardwareItem | null {
  const listed = matchAllHardware(text, kind);
  if (listed.length === 0) return null;
  let pool = listed;
  if (kind === 'gpu') {
    const intel = listed.filter((part) => part.brand === 'Intel');
    const others = listed.filter((part) => part.brand !== 'Intel');
    if (yours.brand === 'Intel' && intel.length > 0) pool = intel;
    else if (others.length > 0) pool = others;
  }
  return pool.reduce((lowest, part) => (part.score < lowest.score ? part : lowest));
}

// The "Min" label shows every listed part we recognise, the visitor's own brand
// first, so it never names only a part the visitor did not need to match.
function requiredLabel(text: string, kind: HardwareKind, yours: HardwareItem): string | null {
  const listed = matchAllHardware(text, kind);
  if (listed.length === 0) return null;
  const ordered = [...listed.filter((p) => p.brand === yours.brand), ...listed.filter((p) => p.brand !== yours.brand)];
  return ordered.map((p) => p.name).join(' or ');
}

function calculatePerformance(cpu: HardwareItem, gpu: HardwareItem, specs: SystemSpecs, game: Game) {
  const req = game.minimumRequirements;
  const minRam = parseRequirement(req.memory);
  const minStorage = parseStorageGB(req.storage);
  const minCpu = requiredPart(req.processor, 'cpu', cpu);
  const minGpu = requiredPart(req.graphics, 'gpu', gpu);
  // Some publishers name a minimum part older than anything in our catalogue
  // (The Sims 4 lists a 2004 GeForce 6600). The game then sets the score that
  // stands for that part, instead of the generic "unknown" score.
  const floor = game.checkerFloor;
  const minCpuScore = minCpu ? minCpu.score : floor?.cpu?.score ?? UNKNOWN_REQUIREMENT_SCORE;
  const minGpuScore = minGpu ? minGpu.score : floor?.gpu?.score ?? UNKNOWN_REQUIREMENT_SCORE;

  const cpuRatio = cpu.score / Math.max(minCpuScore, 1);
  const gpuRatio = gpu.score / Math.max(minGpuScore, 1);

  // The recommended spec, when the publisher gives one we can read, decides the
  // suggested settings. It is a far better guide to "high settings" than a
  // multiple of the minimum spec.
  const rec = game.recommendedPublished !== false ? game.recommendedRequirements : null;
  const recCpu = rec ? requiredPart(rec.processor, 'cpu', cpu) : null;
  const recGpu = rec ? requiredPart(rec.graphics, 'gpu', gpu) : null;
  const recGpuRatio = recGpu && recGpu.score > minGpuScore ? gpu.score / recGpu.score : null;
  const recCpuRatio = recCpu && recCpu.score > minCpuScore ? cpu.score / recCpu.score : null;

  let ram: Status;
  if (specs.ram >= minRam * 1.5) ram = 'excellent';
  else if (specs.ram >= minRam * 1.25) ram = 'good';
  else if (specs.ram >= minRam) ram = 'pass';
  else ram = 'fail';

  let storage: Status;
  if (specs.storage >= minStorage * 1.5) storage = 'excellent';
  else if (specs.storage >= minStorage * 1.2) storage = 'good';
  else if (specs.storage >= minStorage) storage = 'pass';
  else storage = 'fail';

  const part = (ratio: number) =>
    ratio > 2 ? 100 : ratio > 1.5 ? 90 : ratio > 1.2 ? 80 : ratio >= 1 ? 70 : ratio * 60;
  const tier = (s: Status) => (s === 'excellent' ? 100 : s === 'good' ? 85 : s === 'pass' ? 70 : 40);

  const score = Math.round(part(cpuRatio) * 0.3 + part(gpuRatio) * 0.4 + tier(ram) * 0.15 + tier(storage) * 0.15);

  let settings: string;
  let fps_estimate: string;
  if (gpuRatio < 0.7) {
    settings = 'Below minimum';
    fps_estimate = 'Unplayable';
  } else if (gpuRatio < 1 || cpuRatio < 1) {
    settings = 'Low (1080p or lower)';
    fps_estimate = 'under 30 FPS at 1080p Low';
  } else if (recGpuRatio !== null) {
    const cpuMeetsRec = recCpuRatio === null ? cpuRatio >= 1.2 : recCpuRatio >= 1;
    const cpuWellAboveRec = recCpuRatio === null ? cpuRatio >= 1.5 : recCpuRatio >= 1.2;
    if (recGpuRatio >= 1.5 && cpuWellAboveRec) {
      settings = 'High to Ultra (1440p)';
      fps_estimate = '60+ FPS at 1440p High';
    } else if (recGpuRatio >= 1 && cpuMeetsRec) {
      settings = 'High (1080p)';
      fps_estimate = '60 FPS at 1080p High';
    } else if (recGpuRatio >= 1 || (recGpuRatio >= 0.8 && cpuMeetsRec)) {
      // Close to the recommended spec, with one part a little short of it.
      settings = 'Medium (1080p)';
      fps_estimate = '45 to 60 FPS at 1080p Medium';
    } else {
      settings = 'Low to Medium (1080p)';
      fps_estimate = '30 to 60 FPS at 1080p Low to Medium';
    }
  } else if (gpuRatio >= 1.8 && cpuRatio >= 1.5) {
    settings = 'High to Ultra (1440p)';
    fps_estimate = '60+ FPS at 1440p High';
  } else if (gpuRatio >= 1.3 && cpuRatio >= 1.2) {
    settings = 'High (1080p)';
    fps_estimate = '60 FPS at 1080p High';
  } else {
    settings = 'Low to Medium (1080p)';
    fps_estimate = '30 to 60 FPS at 1080p Low to Medium';
  }

  return {
    performance: { cpu: ratioStatus(cpuRatio), gpu: ratioStatus(gpuRatio), ram, storage, score, settings, fps_estimate },
    compared: {
      cpu: { yours: cpu.name, required: requiredLabel(req.processor, 'cpu', cpu) ?? floor?.cpu?.label ?? req.processor },
      gpu: { yours: gpu.name, required: requiredLabel(req.graphics, 'gpu', gpu) ?? floor?.gpu?.label ?? req.graphics },
      ram: { yours: specs.ram, required: minRam },
      storage: { yours: specs.storage, required: minStorage },
    },
  };
}

function invalid(field: 'cpu' | 'gpu' | 'ram' | 'storage' | 'game', error: string, suggestions: string[] = []) {
  return NextResponse.json({ error, field, suggestions }, { status: 422 });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send the game and your hardware as JSON.' }, { status: 400 });
  }

  const { gameId, userSpecs } = (body ?? {}) as { gameId?: string; userSpecs?: Partial<SystemSpecs> };
  if (!gameId || !userSpecs) {
    return NextResponse.json({ error: 'Game ID and user specs are required' }, { status: 400 });
  }

  const game = gamesDatabase.find((g) => g.id === gameId);
  if (!game) {
    return NextResponse.json({ error: 'Game not found in database' }, { status: 404 });
  }
  if (game.requirementsStatus === 'unannounced') {
    return invalid(
      'game',
      `${game.developer} has not published PC requirements for ${game.searchName || game.name}, so there is nothing to check your PC against yet.`
    );
  }

  const cpuText = typeof userSpecs.cpu === 'string' ? userSpecs.cpu.slice(0, 120) : '';
  const gpuText = typeof userSpecs.gpu === 'string' ? userSpecs.gpu.slice(0, 120) : '';
  const ram = Number(userSpecs.ram);
  const storage = Number(userSpecs.storage);

  // Only hardware that exists in the catalogue can be scored. Anything else,
  // including random text, is rejected instead of being given a made up score.
  const cpu = matchHardware(cpuText, 'cpu');
  if (!cpu) {
    return invalid(
      'cpu',
      'We do not recognise that processor. Pick your model from the list.',
      suggestHardware(cpuText, 'cpu', 5).map((h) => h.name)
    );
  }
  const gpu = matchHardware(gpuText, 'gpu');
  if (!gpu) {
    return invalid(
      'gpu',
      'We do not recognise that graphics card. Pick your model from the list.',
      suggestHardware(gpuText, 'gpu', 5).map((h) => h.name)
    );
  }
  if (!Number.isFinite(ram) || ram < 1 || ram > 512) {
    return invalid('ram', 'Enter your memory in GB, between 1 and 512.');
  }
  if (!Number.isFinite(storage) || storage < 0 || storage > 100000) {
    return invalid('storage', 'Enter your free storage in GB.');
  }

  const specs: SystemSpecs = { cpu: cpu.name, gpu: gpu.name, ram, storage };
  const { performance, compared } = calculatePerformance(cpu, gpu, specs, game);
  const hasRecommended = game.recommendedPublished !== false;

  const upgrades: string[] = [];
  if (performance.gpu === 'fail') {
    upgrades.push(`Graphics: you need at least ${game.minimumRequirements.graphics} for playable performance.`);
  } else if (performance.gpu === 'pass' && hasRecommended) {
    upgrades.push(`Graphics: the publisher recommends ${game.recommendedRequirements.graphics} for higher settings.`);
  }
  if (performance.cpu === 'fail') {
    upgrades.push(`Processor: you need at least ${game.minimumRequirements.processor}.`);
  }
  if (performance.ram === 'fail') {
    upgrades.push(`Memory: ${game.name} needs at least ${compared.ram.required} GB.`);
  } else if (performance.ram === 'pass' && hasRecommended) {
    const recRam = parseRequirement(game.recommendedRequirements.memory);
    if (recRam > ram) upgrades.push(`Memory: the recommended spec asks for ${recRam} GB.`);
  }
  if (performance.storage === 'fail') {
    upgrades.push(`Storage: free up at least ${compared.storage.required} GB before installing.`);
  }

  return NextResponse.json({
    game: { id: game.id, name: game.name },
    matched: { cpu: cpu.name, gpu: gpu.name },
    canRun: performance.cpu !== 'fail' && performance.gpu !== 'fail' && performance.ram !== 'fail',
    performance,
    compared,
    upgrades,
    requirements: {
      minimum: game.minimumRequirements,
      recommended: hasRecommended ? game.recommendedRequirements : null,
    },
    note: game.requirementsNote ?? null,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const trending = searchParams.get('trending');

  let games = gamesDatabase;
  if (trending === 'true') games = games.filter((g) => g.trending);
  if (query) {
    const q = query.toLowerCase();
    games = games.filter(
      (g) => g.name.toLowerCase().includes(q) || g.genre.some((genre) => genre.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    games: games.map((g) => ({
      id: g.id,
      name: g.name,
      genre: g.genre,
      releaseDate: g.releaseDate,
      price: g.price,
      imageUrl: g.imageUrl,
      trending: g.trending,
      popularity: g.popularity,
    })),
  });
}
