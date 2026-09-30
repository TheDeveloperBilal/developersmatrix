// Games database with PC system requirements.
//
// RULE FOR THIS FILE: every requirement below is copied from the publisher's own
// listing (Steam store page, or the publisher's support site) and each entry names
// that source in requirementsSource. Never fill a field with an estimate. If a
// publisher does not state a value, write "Not listed" rather than guessing.
// If a publisher has not released PC specs at all, set requirementsStatus to
// 'unannounced' (see GTA 6). If it publishes a minimum spec only, set
// recommendedPublished to false.
//
// All official entries were checked against their sources on 30 September 2026.

export interface GameRequirement {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  directX: string;
  storage: string;
}

export interface Game {
  id: string;
  name: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  genre: string[];
  rating: number;
  price: string;
  platforms: string[];
  imageUrl: string;
  description: string;
  minimumRequirements: GameRequirement;
  recommendedRequirements: GameRequirement;
  features: string[];
  tags: string[];
  trending?: boolean;
  popularity?: number; // 0-100 score, only used to order the picker
  // Short name people actually type into search, e.g. 'GTA 6' for Grand Theft Auto VI.
  searchName?: string;
  // 'unannounced' means the publisher has not released PC specs for this title.
  // Never fill the requirement fields with estimates when this is set: the page
  // renders an honest "not published" answer instead, and the checker skips it.
  requirementsStatus?: 'official' | 'unannounced';
  requirementsSource?: { label: string; url: string };
  // Date the requirements were last compared against the source.
  requirementsCheckedOn?: string;
  // false when the publisher lists a minimum spec only (Counter-Strike 2, Roblox).
  // The recommended fields then hold placeholders and the page says so.
  recommendedPublished?: boolean;
  // Replaces the default "no recommended spec" wording when that wording would
  // not fit the publisher's own framing (Roblox calls its only figures "recommended").
  recommendedMissingText?: string;
  // Extra conditions from the publisher's listing: SSD required, TPM, fps targets.
  requirementsNote?: string;
  // Hand written quick answer for titles whose specs do not fit the generic
  // sentence template (vague or tiered publisher wording).
  quickAnswer?: string;
  platformNote?: string;
}

const CHECKED = 'September 30, 2026';

const NOT_PUBLISHED = (who: string): GameRequirement => ({
  os: `Not published by ${who}`,
  processor: `Not published by ${who}`,
  memory: `Not published by ${who}`,
  graphics: `Not published by ${who}`,
  directX: `Not published by ${who}`,
  storage: `Not published by ${who}`,
});

export const gamesDatabase: Game[] = [
  // ==================== RECENT AND UPCOMING ====================
  {
    id: 'arc-raiders',
    name: 'ARC Raiders',
    developer: 'Embark Studios',
    publisher: 'Embark Studios',
    releaseDate: 'October 30, 2025',
    genre: ['Action', 'Extraction Shooter', 'Multiplayer'],
    rating: 0,
    price: '$39.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'ARC Raiders is a multiplayer extraction shooter from Embark Studios. You scavenge a ruined future Earth, fight the machines of ARC and other players, and try to get out alive with what you found.',
    minimumRequirements: {
      os: 'Windows 10 or later, 64 bit',
      processor: 'Intel Core i5-6600K / AMD Ryzen 5 1600',
      memory: '12 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 580 / Intel Arc A380',
      directX: 'Version 12',
      storage: 'Not listed by Embark Studios'
    },
    recommendedRequirements: {
      os: 'Windows 10 or later, 64 bit',
      processor: 'Intel Core i5-9600K / AMD Ryzen 5 3600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2070 / AMD Radeon RX 5700 XT / Intel Arc B570',
      directX: 'Version 12',
      storage: 'Not listed by Embark Studios'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'ARC Raiders on Steam', url: 'https://store.steampowered.com/app/1808500/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'A broadband internet connection is required. Embark Studios does not state an install size on its Steam listing.',
    features: [
      'PvPvE extraction gameplay',
      'Solo or squad play',
      'Scavenging and crafting between raids'
    ],
    tags: ['Extraction', 'Shooter', 'Action', 'Multiplayer', 'Cooperative'],
    trending: true,
    popularity: 85
  },
  {
    id: 'battlefield-6',
    name: 'Battlefield 6',
    developer: 'Battlefield Studios',
    publisher: 'Electronic Arts',
    releaseDate: 'October 10, 2025',
    genre: ['FPS', 'Military', 'Multiplayer'],
    rating: 0,
    price: '$69.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Battlefield 6 is the 2025 entry in the Battlefield series, built around large scale combined arms warfare, destructible environments and a modern military setting.',
    minimumRequirements: {
      os: 'Windows 10',
      processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5600 XT 6GB / Intel Arc A380',
      directX: 'Version 12',
      storage: '55 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 11',
      processor: 'Intel Core i7-10700 / AMD Ryzen 7 3700X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 3060 Ti / AMD Radeon RX 6700 XT / Intel Arc B580',
      directX: 'Version 12',
      storage: '80 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Battlefield 6 on Steam', url: 'https://store.steampowered.com/app/2807960/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'TPM 2.0 and UEFI Secure Boot must be enabled, and the PC must be HVCI and VBS capable. These are anti cheat requirements, so an older PC can fail to launch the game even when its graphics card and processor are fast enough. A broadband internet connection is required.',
    features: [
      'Large scale multiplayer battles',
      'Destructible environments',
      'Modern military setting',
      'Single player campaign'
    ],
    tags: ['FPS', 'Multiplayer', 'Military', 'Action', 'Competitive'],
    trending: true,
    popularity: 95
  },
  {
    id: 'split-fiction',
    name: 'Split Fiction',
    developer: 'Hazelight Studios',
    publisher: 'Electronic Arts',
    releaseDate: 'March 6, 2025',
    genre: ['Action', 'Adventure', 'Cooperative'],
    rating: 0,
    price: '$49.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Split Fiction is a two player cooperative adventure from Hazelight Studios, the team behind It Takes Two. Two writers are trapped inside their own stories and jump between science fiction and fantasy worlds.',
    minimumRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i5-6600K / AMD Ryzen 5 2600X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 970 4GB / AMD Radeon RX 470 4GB',
      directX: 'Version 12',
      storage: '85 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i7-11700K / AMD Ryzen 7 5800X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 3070 8GB / AMD Radeon RX 6700 XT 12GB',
      directX: 'Version 12',
      storage: '85 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Split Fiction on Steam', url: 'https://store.steampowered.com/app/2001120/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'Hazelight rates the minimum spec at 1080p and 30 fps on the Low preset, and the recommended spec at 1440p and 60 fps on the High preset. A broadband internet connection is required.',
    features: [
      'Two player cooperative play only',
      'Online and split screen play',
      'Friend Pass lets a second player join free'
    ],
    tags: ['Cooperative', 'Adventure', 'Action', 'Multiplayer', 'Story Rich'],
    trending: true,
    popularity: 88
  },
  {
    id: 'clair-obscur-expedition-33',
    name: 'Clair Obscur: Expedition 33',
    developer: 'Sandfall Interactive',
    publisher: 'Kepler Interactive',
    releaseDate: 'April 24, 2025',
    genre: ['RPG', 'Turn Based', 'Fantasy'],
    rating: 0,
    price: '$49.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Clair Obscur: Expedition 33 is a turn based RPG with real time reactions, set in a dark fantasy world inspired by Belle Époque France. You lead Expedition 33 on a mission to destroy the Paintress.',
    minimumRequirements: {
      os: 'Windows 10',
      processor: 'Intel Core i7-8700K / AMD Ryzen 5 1600X',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 5600 XT 6GB / Intel Arc A380 6GB',
      directX: 'Version 12',
      storage: '55 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 11',
      processor: 'Intel Core i7-12700K / AMD Ryzen 7 5800X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 3060 Ti 8GB / AMD Radeon RX 6800 XT 16GB',
      directX: 'Version 12',
      storage: '55 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Clair Obscur: Expedition 33 on Steam', url: 'https://store.steampowered.com/app/1903340/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'An SSD is required. Sandfall rates the minimum spec at 1080p and 30 fps on low settings, and the recommended spec at 1080p and 60 fps on high settings.',
    features: [
      'Turn based combat with real time dodges and parries',
      'Party of distinct characters',
      'Hand crafted world inspired by Belle Époque France'
    ],
    tags: ['RPG', 'Turn Based', 'Fantasy', 'Story Rich'],
    trending: true,
    popularity: 78
  },
  {
    id: 'path-of-exile-2',
    name: 'Path of Exile 2',
    developer: 'Grinding Gear Games',
    publisher: 'Grinding Gear Games',
    releaseDate: 'December 6, 2024 (early access)',
    genre: ['Action RPG', 'Dark Fantasy', 'Online'],
    rating: 0,
    price: '$29.99 (early access)',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Path of Exile 2 is the sequel to Grinding Gear Games’ online action RPG, currently in early access, with a new campaign, new classes and a reworked combat system.',
    minimumRequirements: {
      os: 'Windows 10',
      processor: 'Intel Core i7-7700 / AMD Ryzen 5 2500X',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 960 3GB / AMD Radeon RX 470 / Intel Arc A380',
      directX: 'Version 12',
      storage: '100 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10',
      processor: 'Intel Core i5-10500 / AMD Ryzen 5 3700X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5600 XT / Intel Arc A770',
      directX: 'Version 12',
      storage: '100 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Path of Exile 2 on Steam', url: 'https://store.steampowered.com/app/2694490/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'A graphics card with at least 3 GB of video memory is required, and an SSD is recommended. A broadband internet connection is required. The AMD recommended processor is shown exactly as Grinding Gear Games lists it.',
    features: [
      'New campaign and classes',
      'Reworked skill gem system',
      'Online cooperative play'
    ],
    tags: ['Action RPG', 'Loot', 'Dark Fantasy', 'Multiplayer'],
    trending: true,
    popularity: 92
  },
  {
    id: 'gta-6',
    name: 'Grand Theft Auto VI',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    searchName: 'GTA 6',
    releaseDate: 'November 19, 2026',
    genre: ['Action', 'Adventure', 'Open World'],
    rating: 0,
    price: '$69.99',
    platforms: ['PS5', 'Xbox Series X|S'],
    platformNote: 'Rockstar lists PlayStation 5 and Xbox Series X|S only. No PC version has been announced.',
    imageUrl: '/images/games/gta6.png',
    description: 'Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond in the biggest, most immersive evolution of the Grand Theft Auto series yet.',
    requirementsStatus: 'unannounced',
    requirementsSource: { label: 'Rockstar Games', url: 'https://www.rockstargames.com/VI' },
    // Rockstar has published no PC specs for this title. These placeholders exist
    // so the type stays consistent. Do not replace them with estimates.
    minimumRequirements: {
      os: 'Not announced',
      processor: 'Not announced',
      memory: 'Not announced',
      graphics: 'Not announced',
      directX: 'Not announced',
      storage: 'Not announced'
    },
    recommendedRequirements: {
      os: 'Not announced',
      processor: 'Not announced',
      memory: 'Not announced',
      graphics: 'Not announced',
      directX: 'Not announced',
      storage: 'Not announced'
    },
    features: [
      'Massive open world map covering Vice City and beyond',
      'Dual protagonist system with Lucia and Jason',
      'Next-gen graphics with ray tracing support',
      'Enhanced physics and destruction system',
      'Expanded multiplayer with GTA Online integration',
      'Dynamic weather and day/night cycle',
      'Hundreds of vehicles including cars, boats, and aircraft'
    ],
    tags: ['Open World', 'Action', 'Crime', 'Multiplayer', 'Third-Person'],
    trending: true,
    popularity: 100
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    developer: 'Mojang Studios',
    publisher: 'Microsoft',
    releaseDate: 'November 18, 2011',
    genre: ['Sandbox', 'Survival', 'Adventure'],
    rating: 4.9,
    price: '$29.99',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X|S', 'Xbox One', 'Switch', 'Mobile'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Minecraft is a sandbox game about exploring, gathering and building in procedurally generated worlds. These requirements are for Minecraft: Java Edition on PC.',
    minimumRequirements: {
      os: '64 bit operating system',
      processor: '4 core processor',
      memory: '8 GB RAM (12 GB with integrated graphics)',
      graphics: 'Vulkan 1.3 capable GPU with at least 2 GB VRAM',
      directX: 'Not listed (Java Edition uses Vulkan)',
      storage: 'Not listed by Mojang'
    },
    recommendedRequirements: {
      os: '64 bit operating system',
      processor: 'A stronger modern processor (no model named)',
      memory: '16 GB RAM',
      graphics: 'Graphics card with 6 GB VRAM',
      directX: 'Not listed (Java Edition uses Vulkan)',
      storage: 'Not listed by Mojang'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Minecraft.net: Java Edition system requirements', url: 'https://www.minecraft.net/en-us/article/minecraft-java-edition-system-requirements' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'Mojang rates the minimum spec at 1080p and 30 fps on the Fast preset, and the recommended spec at 1080p and 60 fps on the Fancy preset. Mojang says Java Edition should still launch on weaker hardware, but performance and visuals are no longer guaranteed there. These figures are for Java Edition, not Bedrock Edition.',
    quickAnswer: 'Mojang updated the Minecraft: Java Edition requirements in July 2026. At minimum you need a 64 bit system with a 4 core processor, 8 GB of memory with a dedicated graphics card or 12 GB with integrated graphics, and a Vulkan 1.3 capable GPU with at least 2 GB of video memory. That targets 1080p at 30 fps on the Fast preset. For 1080p at 60 fps on Fancy, Mojang recommends 16 GB of memory and a graphics card with 6 GB of video memory.',
    features: [
      'Procedurally generated worlds',
      'Creative and Survival modes',
      'Multiplayer support',
      'Large modding community'
    ],
    tags: ['Sandbox', 'Survival', 'Creative', 'Multiplayer', 'Family Friendly'],
    trending: false,
    popularity: 96
  },
  {
    id: 'roblox',
    name: 'Roblox',
    developer: 'Roblox Corporation',
    publisher: 'Roblox Corporation',
    releaseDate: 'September 1, 2006',
    genre: ['Sandbox', 'Platform', 'Social'],
    rating: 4.5,
    price: 'Free to Play',
    platforms: ['PC', 'Mac', 'Mobile', 'Xbox', 'PlayStation'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Roblox is a platform where players join millions of experiences made by other users, or build their own with Roblox Studio.',
    minimumRequirements: {
      os: 'Windows 10 or Windows 11, 64 bit',
      processor: '1.6 GHz or faster processor made in 2005 or later',
      memory: '1 GB RAM',
      graphics: 'Graphics card with DirectX 10 feature level support',
      directX: 'Version 10 feature level or higher',
      storage: '300 MB available space'
    },
    recommendedRequirements: NOT_PUBLISHED('Roblox'),
    recommendedPublished: false,
    recommendedMissingText: 'Roblox publishes one set of figures, not separate minimum and recommended tiers. The specs shown here are its own suggested figures. Apart from the operating system, Roblox sets no hard minimum.',
    requirementsStatus: 'official',
    requirementsSource: { label: 'Roblox Support: computer hardware and operating system requirements', url: 'https://en.help.roblox.com/hc/en-us/articles/203312800-Computer-Hardware-Operating-System-Requirements' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'Roblox also suggests a computer less than five years old with a dedicated graphics card, and an internet connection of 4 to 8 Mb/s.',
    quickAnswer: 'Roblox needs very little. It runs on 64 bit Windows 10 or Windows 11, and Roblox recommends at least 1 GB of memory, a 1.6 GHz or faster processor made in 2005 or later, a graphics card with DirectX 10 support and 300 MB of free storage. For the smoothest play Roblox suggests a computer less than five years old with a dedicated graphics card.',
    features: [
      'Millions of user created experiences',
      'Built in creation tools',
      'Avatar customization',
      'Cross platform play'
    ],
    tags: ['Sandbox', 'Social', 'Platform', 'Free to Play', 'Family Friendly'],
    trending: false,
    popularity: 94
  },
  // ==================== ESTABLISHED TITLES ====================
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    releaseDate: 'December 10, 2020',
    genre: ['RPG', 'Action', 'Open World'],
    rating: 4.2,
    price: '$59.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/cyberpunk.png',
    description: 'Cyberpunk 2077 is an open world action RPG set in the megalopolis of Night City. You play as V, a mercenary chasing a one of a kind implant that is the key to immortality.',
    minimumRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i7-6700 / AMD Ryzen 5 1600',
      memory: '12 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB / Intel Arc A380',
      directX: 'Version 12',
      storage: '70 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i7-12700 / AMD Ryzen 7 7800X3D',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2060 SUPER / AMD Radeon RX 5700 XT / Intel Arc A770',
      directX: 'Version 12',
      storage: '70 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Cyberpunk 2077 on Steam', url: 'https://store.steampowered.com/app/1091500/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'An SSD is required at both minimum and recommended settings.',
    features: [
      'Deep character customization',
      'Branching storylines with multiple endings',
      'Ray tracing and upscaling support',
      'Phantom Liberty expansion available'
    ],
    tags: ['RPG', 'Sci Fi', 'Open World', 'FPS', 'Story Rich'],
    trending: false,
    popularity: 82
  },
  {
    id: 'elden-ring',
    name: 'Elden Ring',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: 'February 25, 2022',
    genre: ['Action RPG', 'Open World', 'Soulslike'],
    rating: 4.8,
    price: '$59.99',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X|S', 'Xbox One'],
    imageUrl: '/images/games/eldenring.png',
    description: 'Elden Ring is an open world action RPG from FromSoftware. Rise, Tarnished, and be guided by grace to become an Elden Lord in the Lands Between.',
    minimumRequirements: {
      os: 'Windows 10',
      processor: 'Intel Core i5-8400 / AMD Ryzen 3 3300X',
      memory: '12 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB',
      directX: 'Version 12',
      storage: '60 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10/11',
      processor: 'Intel Core i7-8700K / AMD Ryzen 5 3600X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX Vega 56 8GB',
      directX: 'Version 12',
      storage: '60 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Elden Ring on Steam', url: 'https://store.steampowered.com/app/1245620/' },
    requirementsCheckedOn: CHECKED,
    features: [
      'Vast open world',
      'Many viable builds',
      'Online cooperative and PvP play',
      'Shadow of the Erdtree expansion available'
    ],
    tags: ['Soulslike', 'Open World', 'Difficult', 'RPG', 'Fantasy'],
    trending: false,
    popularity: 91
  },
  {
    id: 'baldurs-gate-3',
    name: "Baldur's Gate 3",
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    releaseDate: 'August 3, 2023',
    genre: ['RPG', 'Turn Based', 'Strategy'],
    rating: 4.9,
    price: '$59.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S', 'Mac'],
    imageUrl: '/images/games/bg3.png',
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    minimumRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i5-4690 / AMD FX 8350',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 970 / AMD Radeon RX 480 / Intel Arc A380 (4 GB VRAM or more)',
      directX: 'Version 11',
      storage: '150 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i7-8700K / AMD Ryzen 5 3600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2060 Super / AMD Radeon RX 5700 XT / Intel Arc A580 (8 GB VRAM or more)',
      directX: 'Version 11',
      storage: '150 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: "Baldur's Gate 3 on Steam", url: 'https://store.steampowered.com/app/1086940/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'An SSD is required at both minimum and recommended settings.',
    features: [
      'D&D 5th Edition ruleset',
      'Online cooperative play for up to 4 players',
      'Choices with lasting consequences'
    ],
    tags: ['Turn Based', 'RPG', 'Fantasy', 'Cooperative', 'Story Rich'],
    trending: false,
    popularity: 93
  },
  {
    id: 'hogwarts-legacy',
    name: 'Hogwarts Legacy',
    developer: 'Avalanche Software',
    publisher: 'Warner Bros. Games',
    releaseDate: 'February 10, 2023',
    genre: ['Action RPG', 'Adventure', 'Open World'],
    rating: 4.5,
    price: '$59.99',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X|S', 'Xbox One', 'Switch'],
    imageUrl: '/images/games/hogwarts.png',
    description: 'Hogwarts Legacy is an open world action RPG set in the wizarding world of the 1800s, where you play a student who holds the key to an ancient secret.',
    minimumRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i5-6600 / AMD Ryzen 5 1400',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 960 4GB / AMD Radeon RX 470 4GB',
      directX: 'Version 12',
      storage: '85 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i7-8700 / AMD Ryzen 5 3600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1080 Ti / AMD Radeon RX 5700 XT / Intel Arc A770',
      directX: 'Version 12',
      storage: '85 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Hogwarts Legacy on Steam', url: 'https://store.steampowered.com/app/990080/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'The minimum spec targets 720p and 30 fps on low settings, where a hard drive is supported but an SSD is preferred. The recommended spec targets 1080p and 60 fps on high settings with an SSD.',
    features: [
      'Explore Hogwarts castle and the surrounding highlands',
      'Spells, potions and magical beasts',
      'Choices that shape your story'
    ],
    tags: ['Magic', 'Open World', 'RPG', 'Adventure', 'Fantasy'],
    trending: false,
    popularity: 85
  },
  {
    id: 'starfield',
    name: 'Starfield',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    releaseDate: 'September 6, 2023',
    genre: ['RPG', 'Space Sim', 'Open World'],
    rating: 4.0,
    price: '$49.99',
    platforms: ['PC', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Starfield is a space RPG from Bethesda Game Studios, the creators of The Elder Scrolls V: Skyrim and Fallout 4, and the studio’s first new universe in over 25 years.',
    minimumRequirements: {
      os: 'Windows 10 version 21H1 or newer',
      processor: 'Intel Core i7-6800K / AMD Ryzen 5 2600X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1070 Ti / AMD Radeon RX 5700',
      directX: 'Version 12',
      storage: '125 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10/11 with updates',
      processor: 'Intel Core i5-10600K / AMD Ryzen 5 3600X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2080 / AMD Radeon RX 6800 XT',
      directX: 'Version 12',
      storage: '125 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Starfield on Steam', url: 'https://store.steampowered.com/app/1716740/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'An SSD is required at both minimum and recommended settings. The recommended spec also lists a broadband internet connection.',
    features: [
      'Explore over 1000 planets',
      'Build and customize spaceships',
      'Multiple factions and storylines',
      'Mod support via Creation Kit'
    ],
    tags: ['Space', 'RPG', 'Open World', 'Sci Fi', 'Exploration'],
    trending: false,
    popularity: 75
  },
  {
    id: 'alan-wake-2',
    name: 'Alan Wake 2',
    developer: 'Remedy Entertainment',
    publisher: 'Epic Games Publishing',
    releaseDate: 'October 27, 2023',
    genre: ['Horror', 'Action', 'Adventure'],
    rating: 4.7,
    price: '$49.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Alan Wake 2 is a survival horror game from Remedy Entertainment. FBI agent Saga Anderson investigates ritualistic murders in Bright Falls while Alan Wake tries to write his way out of the Dark Place.',
    minimumRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i5-7600K / AMD equivalent',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1070 / AMD Radeon RX 5600 XT',
      directX: 'Not listed',
      storage: '90 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'AMD Ryzen 7 3700X / Intel equivalent',
      memory: '16 GB RAM or more',
      graphics: 'NVIDIA GeForce RTX 3060 / AMD Radeon RX 6600 XT',
      directX: 'Not listed',
      storage: '90 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Epic Games Support: Alan Wake 2 system requirements', url: 'https://www.epicgames.com/help/alan-wake-2-c-202300000001644/c-Trending_0/what-are-the-minimum-system-requirements-for-alan-wake-2-a202300000012420' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'An SSD is required at both minimum and recommended settings.',
    features: [
      'Two playable protagonists',
      'Psychological survival horror',
      'Ray tracing and upscaling support'
    ],
    tags: ['Horror', 'Thriller', 'Mystery', 'Third Person', 'Psychological'],
    trending: false,
    popularity: 86
  },
  {
    id: 'counter-strike-2',
    name: 'Counter-Strike 2',
    developer: 'Valve Corporation',
    publisher: 'Valve Corporation',
    releaseDate: 'September 27, 2023',
    genre: ['FPS', 'Competitive', 'Tactical'],
    rating: 4.5,
    price: 'Free to Play',
    platforms: ['PC'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Counter-Strike 2 is Valve’s free to play tactical shooter and the successor to CS:GO, rebuilt on the Source 2 engine.',
    minimumRequirements: {
      os: 'Windows 10',
      processor: 'Intel Core i5 750 or better, with 4 hardware CPU threads',
      memory: '8 GB RAM',
      graphics: 'DirectX 11 compatible card with 1 GB VRAM or more and Shader Model 5.0 support',
      directX: 'Version 11',
      storage: '85 GB available space'
    },
    recommendedRequirements: NOT_PUBLISHED('Valve'),
    recommendedPublished: false,
    requirementsStatus: 'official',
    requirementsSource: { label: 'Counter-Strike 2 on Steam', url: 'https://store.steampowered.com/app/730/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'Valve publishes a minimum spec only. There is no official recommended spec for Counter-Strike 2.',
    quickAnswer: 'Counter-Strike 2 has low official requirements. Valve asks for Windows 10, a processor with 4 hardware threads at the level of an Intel Core i5 750 or better, 8 GB of memory, a DirectX 11 graphics card with at least 1 GB of video memory and Shader Model 5.0 support, and 85 GB of free storage. Valve does not publish a recommended spec, so there is no official target for high frame rates.',
    features: [
      'Built on the Source 2 engine',
      'Sub tick server architecture',
      'Premier competitive mode',
      'CS Rating system'
    ],
    tags: ['FPS', 'Competitive', 'Esports', 'Free to Play', 'Tactical'],
    trending: false,
    popularity: 90
  },
  // ==================== ADDED 30 SEPTEMBER 2026 ====================
  {
    id: 'gta-5',
    name: 'Grand Theft Auto V Enhanced',
    searchName: 'GTA 5',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    releaseDate: 'March 4, 2025 (Enhanced edition on PC)',
    genre: ['Action', 'Adventure', 'Open World'],
    rating: 0,
    price: 'Varies by edition',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Grand Theft Auto V Enhanced is the current generation PC version of GTA V and GTA Online, with the visual and loading upgrades from the PS5 and Xbox Series X|S release.',
    minimumRequirements: {
      os: 'Windows 10 (build 1909 or newer)',
      processor: 'Intel Core i7-4770 / AMD FX-9590',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1630 4GB / AMD Radeon RX 6400 4GB',
      directX: 'Not listed',
      storage: '105 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 11',
      processor: 'Intel Core i5-9600K / AMD Ryzen 5 3600',
      memory: '16 GB RAM (dual channel)',
      graphics: 'NVIDIA GeForce RTX 3060 8GB / AMD Radeon RX 6600 XT 8GB',
      directX: 'Not listed',
      storage: '105 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Rockstar Support: GTA V PC system requirements', url: 'https://support.rockstargames.com/articles/lMQXeP2Z1mN3g9oZiBZFR/grand-theft-auto-v-pc-system-requirements' },
    requirementsCheckedOn: CHECKED,
    quickAnswer: 'To run Grand Theft Auto V Enhanced at minimum settings you need an Intel Core i7-4770 or AMD FX-9590, 8 GB of memory, an NVIDIA GeForce GTX 1630 or AMD Radeon RX 6400 with 4 GB of video memory, and 105 GB of free space on an SSD. For comfortable frame rates Rockstar recommends an Intel Core i5-9600K or AMD Ryzen 5 3600, 16 GB of dual channel memory and an NVIDIA GeForce RTX 3060 or AMD Radeon RX 6600 XT.',
    requirementsNote: 'An SSD is required even at minimum, and Rockstar recommends a DirectStorage compatible drive. These are the requirements for the Enhanced edition. The older Legacy edition of GTA V on PC has lower requirements.',
    features: [
      'GTA V story mode and GTA Online',
      'Current generation visual upgrades',
      'Faster loading on SSDs'
    ],
    tags: ['Open World', 'Action', 'Crime', 'Multiplayer'],
    trending: true,
    popularity: 97
  },
  {
    id: 'red-dead-redemption-2',
    name: 'Red Dead Redemption 2',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    releaseDate: 'November 5, 2019 (PC)',
    genre: ['Action', 'Adventure', 'Open World'],
    rating: 0,
    price: '$59.99',
    platforms: ['PC', 'PS4', 'Xbox One'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Red Dead Redemption 2 follows outlaw Arthur Morgan and the Van der Linde gang across a vast open world at the end of the American frontier era.',
    minimumRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i5-2500K / AMD FX-6300',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 770 2GB / AMD Radeon R9 280 3GB',
      directX: 'Not listed',
      storage: '150 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i7-4770K / AMD Ryzen 5 1500X',
      memory: '12 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB',
      directX: 'Not listed',
      storage: '150 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Red Dead Redemption 2 on Steam', url: 'https://store.steampowered.com/app/1174180/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'A broadband internet connection is listed at both tiers. The same figures appear on Rockstar’s own support site.',
    features: [
      'Story mode and Red Dead Online',
      'Large open world',
      'Detailed simulation of camp life and wildlife'
    ],
    tags: ['Open World', 'Western', 'Action', 'Story Rich'],
    trending: false,
    popularity: 89
  },
  {
    id: 'valorant',
    name: 'Valorant',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    releaseDate: 'June 2, 2020',
    genre: ['FPS', 'Competitive', 'Tactical'],
    rating: 0,
    price: 'Free to Play',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Valorant is Riot Games’ free to play 5 versus 5 tactical shooter, mixing precise gunplay with character abilities.',
    minimumRequirements: {
      os: 'Windows 10 (build 19041 or newer) or Windows 11, 64 bit',
      processor: 'Intel Core i3-540 / AMD Athlon 200GE',
      memory: '4 GB RAM',
      graphics: 'Intel HD 4000 / AMD Radeon R5 220 (1 GB VRAM if dedicated)',
      directX: 'Version 11',
      storage: 'Not listed by Riot'
    },
    recommendedRequirements: {
      os: 'Windows 10 (build 19041 or newer) or Windows 11, 64 bit',
      processor: 'Intel Core i3-4150 / AMD Ryzen 3 1200',
      memory: 'Not listed separately (4 GB minimum)',
      graphics: 'NVIDIA GeForce GT 730 / AMD Radeon R7 240',
      directX: 'Version 11',
      storage: 'Not listed by Riot'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Riot Games Support: Valorant PC specs', url: 'https://support.riotgames.com/en-us/valorant/support-tools/minimum-recommended-pc-specs' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'Riot rates the minimum spec at 30 fps and the recommended spec at 60 fps. For 144 fps it lists an Intel Core i5-9400F or AMD Ryzen 5 2600X with an NVIDIA GeForce GTX 1050 Ti, AMD Radeon R7 370 or Intel Arc A310. The processor must support SSE 4.2 or AVX, and on Windows 11 the Vanguard anti cheat needs TPM 2.0 and UEFI Secure Boot. Virtual machines and cloud gaming are not supported.',
    quickAnswer: 'Valorant runs on very modest hardware. For 30 fps Riot asks for an Intel Core i3-540 or AMD Athlon 200GE, 4 GB of memory and Intel HD 4000 or AMD Radeon R5 220 graphics. For 60 fps it recommends an Intel Core i3-4150 or AMD Ryzen 3 1200 with an NVIDIA GeForce GT 730 or AMD Radeon R7 240. For 144 fps it suggests an Intel Core i5-9400F or AMD Ryzen 5 2600X with a GTX 1050 Ti class card.',
    features: [
      '5 versus 5 tactical rounds',
      'Agents with unique abilities',
      'Ranked competitive mode'
    ],
    tags: ['FPS', 'Competitive', 'Esports', 'Free to Play', 'Tactical'],
    trending: true,
    popularity: 94
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    developer: 'Epic Games',
    publisher: 'Epic Games',
    releaseDate: 'July 25, 2017',
    genre: ['Battle Royale', 'Shooter', 'Multiplayer'],
    rating: 0,
    price: 'Free to Play',
    platforms: ['PC', 'Mac', 'PS5', 'PS4', 'Xbox Series X|S', 'Xbox One', 'Switch', 'Mobile'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Fortnite is Epic Games’ free to play battle royale, with building, creative modes and a large library of player made islands.',
    minimumRequirements: {
      os: 'Windows 10 version 22H2, 64 bit',
      processor: 'Intel Core i3-3225 3.3 GHz',
      memory: '8 GB RAM',
      graphics: 'Intel HD 4000 / AMD Radeon Vega 8',
      directX: 'Not listed',
      storage: 'Not listed by Epic'
    },
    recommendedRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i5-7300U 3.5 GHz / AMD Ryzen 3 3300U',
      memory: '16 GB RAM or more',
      graphics: 'NVIDIA GeForce GTX 960 / AMD Radeon R9 280 (2 GB VRAM, DirectX 11)',
      directX: 'Version 11',
      storage: 'NVMe SSD'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Epic Games Support: Fortnite system requirements', url: 'https://www.epicgames.com/help/fortnite-c5719335176219/technical-support-c5719372265755/what-are-the-system-requirements-for-fortnite-on-pc-and-mac-a5720377103003' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'Epic does not state an install size for Fortnite on PC. It recommends an NVMe SSD.',
    quickAnswer: 'Fortnite runs on almost any modern PC. The minimum is an Intel Core i3-3225, 8 GB of memory and Intel HD 4000 or AMD Radeon Vega 8 graphics on 64 bit Windows 10. For smoother play Epic recommends an Intel Core i5-7300U or AMD Ryzen 3 3300U, 16 GB of memory, an NVIDIA GeForce GTX 960 or AMD Radeon R9 280 with 2 GB of video memory, and an NVMe SSD.',
    features: [
      'Battle royale with building',
      'Zero Build modes',
      'Creative islands made by players'
    ],
    tags: ['Battle Royale', 'Shooter', 'Free to Play', 'Multiplayer'],
    trending: true,
    popularity: 96
  },
  {
    id: 'marvel-rivals',
    name: 'Marvel Rivals',
    developer: 'NetEase Games',
    publisher: 'NetEase Games',
    releaseDate: 'December 6, 2024',
    genre: ['Hero Shooter', 'Multiplayer', 'Action'],
    rating: 0,
    price: 'Free to Play',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Marvel Rivals is a free to play 6 versus 6 team shooter where you play as Marvel heroes and villains on destructible maps.',
    minimumRequirements: {
      os: 'Windows 10, 64 bit (1909 or newer)',
      processor: 'Intel Core i5-6600K / AMD Ryzen 5 1600X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 / AMD Radeon RX 580 / Intel Arc A380',
      directX: 'Version 12',
      storage: '70 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10, 64 bit (1909 or newer)',
      processor: 'Intel Core i5-10400 / AMD Ryzen 5 5600X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2060 Super / AMD Radeon RX 5700 XT / Intel Arc A750',
      directX: 'Version 12',
      storage: '70 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Marvel Rivals on Steam', url: 'https://store.steampowered.com/app/2767030/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'NetEase recommends installing the game on an SSD. A broadband internet connection is required.',
    features: [
      '6 versus 6 team battles',
      'Destructible environments',
      'Team up abilities between heroes'
    ],
    tags: ['Hero Shooter', 'Free to Play', 'Multiplayer', 'Competitive'],
    trending: true,
    popularity: 90
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    developer: 'Respawn Entertainment',
    publisher: 'Electronic Arts',
    releaseDate: 'February 4, 2019',
    genre: ['Battle Royale', 'FPS', 'Multiplayer'],
    rating: 0,
    price: 'Free to Play',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X|S', 'Xbox One', 'Switch'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Apex Legends is a free to play battle royale shooter from Respawn Entertainment, built around squads of Legends with distinct abilities.',
    minimumRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i3-6300 / AMD FX-4350',
      memory: '6 GB RAM',
      graphics: 'NVIDIA GeForce GTX 950 / AMD Radeon HD 7790 2GB',
      directX: 'Version 12',
      storage: '75 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'AMD Ryzen 5 / equivalent',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 970 / AMD Radeon R9 290',
      directX: 'Version 12',
      storage: '75 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Apex Legends on Steam', url: 'https://store.steampowered.com/app/1172470/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'Each additional language pack adds roughly 3.8 GB. A broadband internet connection is required.',
    features: [
      'Squad based battle royale',
      'Legends with unique abilities',
      'Ranked and casual modes'
    ],
    tags: ['Battle Royale', 'FPS', 'Free to Play', 'Multiplayer'],
    trending: false,
    popularity: 87
  },
  {
    id: 'monster-hunter-wilds',
    name: 'Monster Hunter Wilds',
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: 'February 28, 2025',
    genre: ['Action RPG', 'Hunting', 'Cooperative'],
    rating: 0,
    price: '$39.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Monster Hunter Wilds is Capcom’s open world hunting action RPG. You track and fight large monsters alone or with up to three other hunters.',
    minimumRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i5-10400 / Intel Core i3-12100 / AMD Ryzen 5 3600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1660 6GB / AMD Radeon RX 5500 XT 8GB',
      directX: 'Version 12',
      storage: '75 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i5-10400 / Intel Core i3-12100 / AMD Ryzen 5 3600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2060 Super 8GB / AMD Radeon RX 6600 8GB',
      directX: 'Version 12',
      storage: '75 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Monster Hunter Wilds on Steam', url: 'https://store.steampowered.com/app/2246340/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'An SSD is required. Capcom rates the minimum spec at 1080p upscaled from 720p at 30 fps on the Lowest preset, and the recommended spec at 1080p and 60 fps on Medium with frame generation turned on.',
    features: [
      'Open world hunting grounds',
      'Cooperative hunts for up to four players',
      'Fourteen weapon types'
    ],
    tags: ['Action RPG', 'Cooperative', 'Hunting', 'Multiplayer'],
    trending: true,
    popularity: 86
  },
  {
    id: 'black-myth-wukong',
    name: 'Black Myth: Wukong',
    developer: 'Game Science',
    publisher: 'Game Science',
    releaseDate: 'August 20, 2024',
    genre: ['Action RPG', 'Adventure', 'Mythology'],
    rating: 0,
    price: '$59.99',
    platforms: ['PC', 'PS5'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Black Myth: Wukong is an action RPG based on the Chinese classic Journey to the West, where you play as the Destined One.',
    minimumRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i5-8400 / AMD Ryzen 5 1600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB',
      directX: 'Version 11',
      storage: '130 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10, 64 bit',
      processor: 'Intel Core i7-9700 / AMD Ryzen 5 5500',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT / Intel Arc A750',
      directX: 'Version 12',
      storage: '130 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Black Myth: Wukong on Steam', url: 'https://store.steampowered.com/app/2358720/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'At minimum a hard drive is supported and an SSD is recommended. At the recommended tier an SSD is required. Game Science tested both specs with DLSS, FSR or XeSS upscaling turned on.',
    features: [
      'Boss focused combat',
      'Transformations and spells',
      'Based on Journey to the West'
    ],
    tags: ['Action RPG', 'Soulslike', 'Mythology', 'Story Rich'],
    trending: false,
    popularity: 84
  },
  {
    id: 'hollow-knight-silksong',
    name: 'Hollow Knight: Silksong',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    releaseDate: 'September 4, 2025',
    genre: ['Metroidvania', 'Action', 'Indie'],
    rating: 0,
    price: '$19.99',
    platforms: ['PC', 'Mac', 'Linux', 'Switch', 'PS5', 'PS4', 'Xbox Series X|S', 'Xbox One'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Hollow Knight: Silksong is the sequel to Hollow Knight. You play as Hornet, climbing through a new kingdom of silk and song.',
    minimumRequirements: {
      os: 'Windows 10 version 21H1 or newer',
      processor: 'Intel Core i3-3240 / AMD FX-4300',
      memory: '4 GB RAM',
      graphics: 'NVIDIA GeForce GTX 560 Ti 1GB / AMD Radeon HD 7750 1GB',
      directX: 'Version 10',
      storage: '8 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10 version 21H1 or newer',
      processor: 'Intel Core i5-3470',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1050 2GB / AMD Radeon R9 380 2GB',
      directX: 'Version 10',
      storage: '8 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Hollow Knight: Silksong on Steam', url: 'https://store.steampowered.com/app/1030300/' },
    requirementsCheckedOn: CHECKED,
    features: [
      'Hand drawn 2D world',
      'Fast, acrobatic combat',
      'Large interconnected map'
    ],
    tags: ['Metroidvania', 'Indie', 'Platformer', 'Difficult'],
    trending: true,
    popularity: 83
  },
  {
    id: 'borderlands-4',
    name: 'Borderlands 4',
    developer: 'Gearbox Software',
    publisher: '2K',
    releaseDate: 'September 12, 2025',
    genre: ['Looter Shooter', 'Action RPG', 'Cooperative'],
    rating: 0,
    price: '$69.99',
    platforms: ['PC', 'PS5', 'Xbox Series X|S'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Borderlands 4 is the next looter shooter from Gearbox Software, set on the new planet Kairos, with solo or cooperative play.',
    minimumRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i7-9700 / AMD Ryzen 7 2700X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 2070 / AMD Radeon RX 5700 XT / Intel Arc A580',
      directX: 'Not listed',
      storage: '100 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 10/11, 64 bit',
      processor: 'Intel Core i7-12700 / AMD Ryzen 7 5800X',
      memory: '32 GB RAM',
      graphics: 'NVIDIA GeForce RTX 3080 / AMD Radeon RX 6800 XT / Intel Arc B580',
      directX: 'Not listed',
      storage: '100 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Borderlands 4 on Steam', url: 'https://store.steampowered.com/app/1285190/' },
    requirementsCheckedOn: CHECKED,
    requirementsNote: 'At minimum Gearbox requires 8 CPU cores and 8 GB of video memory. An SSD is required at both tiers.',
    features: [
      'Procedurally generated loot',
      'Four new Vault Hunters',
      'Online and split screen cooperative play'
    ],
    tags: ['Looter Shooter', 'Cooperative', 'FPS', 'RPG'],
    trending: true,
    popularity: 84
  },
  {
    id: 'elden-ring-nightreign',
    name: 'Elden Ring Nightreign',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: 'May 30, 2025',
    genre: ['Action RPG', 'Cooperative', 'Roguelike'],
    rating: 0,
    price: '$39.99',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X|S', 'Xbox One'],
    imageUrl: '/images/games/generic-game.png',
    description: 'Elden Ring Nightreign is a standalone cooperative spin off of Elden Ring, where teams of three survive a shrinking map and face a boss as each night falls.',
    minimumRequirements: {
      os: 'Windows 10',
      processor: 'Intel Core i5-10600 / AMD Ryzen 5 5500',
      memory: '12 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB',
      directX: 'Version 12',
      storage: '30 GB available space'
    },
    recommendedRequirements: {
      os: 'Windows 11',
      processor: 'Intel Core i5-11500 / AMD Ryzen 5 5600',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX Vega 56 8GB',
      directX: 'Version 12',
      storage: '30 GB available space'
    },
    requirementsStatus: 'official',
    requirementsSource: { label: 'Elden Ring Nightreign on Steam', url: 'https://store.steampowered.com/app/2622380/' },
    requirementsCheckedOn: CHECKED,
    features: [
      'Three player cooperative runs',
      'New playable characters',
      'Standalone, no Elden Ring purchase needed'
    ],
    tags: ['Soulslike', 'Cooperative', 'Roguelike', 'Action RPG'],
    trending: false,
    popularity: 82
  }
];

// Helper functions
export const getTrendingGames = () => gamesDatabase.filter(game => game.trending);
export const getGameById = (id: string) => gamesDatabase.find(game => game.id === id);
export const searchGames = (query: string) =>
  gamesDatabase.filter(game =>
    game.name.toLowerCase().includes(query.toLowerCase()) ||
    game.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
    game.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );
export const getGamesByGenre = (genre: string) =>
  gamesDatabase.filter(game =>
    game.genre.some(g => g.toLowerCase() === genre.toLowerCase())
  );

// Export for backward compatibility
export const popularGames = gamesDatabase;
// Game is declared above in this file, so it needs no re-export.
