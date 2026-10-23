import { NextRequest, NextResponse } from 'next/server';
import { gamesDatabase, type GameRequirement } from '@/data/games-database';
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

function calculatePerformance(cpu: HardwareItem, gpu: HardwareItem, specs: SystemSpecs, req: GameRequirement) {
  const minRam = parseRequirement(req.memory);
  const minStorage = parseStorageGB(req.storage);
  const minCpu = requiredPart(req.processor, 'cpu', cpu);
  const minGpu = requiredPart(req.graphics, 'gpu', gpu);
  const minCpuScore = minCpu ? minCpu.score : UNKNOWN_REQUIREMENT_SCORE;
  const minGpuScore = minGpu ? minGpu.score : UNKNOWN_REQUIREMENT_SCORE;

  const cpuRatio = cpu.score / Math.max(minCpuScore, 1);
  const gpuRatio = gpu.score / Math.max(minGpuScore, 1);

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
  if (gpuRatio >= 1.8 && cpuRatio >= 1.5) settings = 'Ultra (4K 60+ FPS)';
  else if (gpuRatio >= 1.4 && cpuRatio >= 1.2) settings = 'High (1440p 60+ FPS)';
  else if (gpuRatio >= 1.0 && cpuRatio >= 1.0) settings = 'Medium (1080p 60 FPS)';
  else if (gpuRatio >= 0.7) settings = 'Low (1080p 30 to 45 FPS)';
  else settings = 'Below minimum';

  let fps_estimate: string;
  if (gpuRatio >= 1.8) fps_estimate = '100+ FPS at 1440p Ultra';
  else if (gpuRatio >= 1.4) fps_estimate = '60 to 80 FPS at 1440p High';
  else if (gpuRatio >= 1.0) fps_estimate = '50 to 60 FPS at 1080p Medium';
  else if (gpuRatio >= 0.7) fps_estimate = '30 to 45 FPS at 1080p Low';
  else fps_estimate = 'Unplayable';

  return {
    performance: { cpu: ratioStatus(cpuRatio), gpu: ratioStatus(gpuRatio), ram, storage, score, settings, fps_estimate },
    compared: {
      cpu: { yours: cpu.name, required: minCpu?.name ?? req.processor },
      gpu: { yours: gpu.name, required: minGpu?.name ?? req.graphics },
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
  const { performance, compared } = calculatePerformance(cpu, gpu, specs, game.minimumRequirements);
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
