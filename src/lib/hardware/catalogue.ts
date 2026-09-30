// Hardware catalogue for the Can You Run It checker.
//
// Scores are relative gaming performance on one shared scale per component type
// (RTX 4090 = 100 for graphics, Core i9-14900K = 100 for processors). They are our
// own estimates for ranking hardware against each other, not benchmark results,
// and the page says so. Keep new entries consistent with their neighbours.
//
// The same catalogue does two jobs:
// 1. It is the only list a visitor can pick from, so nonsense input is rejected.
// 2. It reads the hardware named in a publisher's requirement text.

export type HardwareKind = 'cpu' | 'gpu';

export interface HardwareItem {
  name: string;
  score: number;
  brand: 'NVIDIA' | 'AMD' | 'Intel';
  integrated?: boolean;
}

export const GPUS: HardwareItem[] = [
  // NVIDIA RTX 50
  { name: 'NVIDIA GeForce RTX 5090', score: 125, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 5080', score: 102, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 5070 Ti', score: 92, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 5070', score: 78, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 5060 Ti', score: 62, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 5060', score: 56, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 5050', score: 42, brand: 'NVIDIA' },
  // NVIDIA RTX 40
  { name: 'NVIDIA GeForce RTX 4090', score: 100, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4080 Super', score: 95, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4080', score: 90, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4070 Ti Super', score: 85, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4070 Ti', score: 80, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4070 Super', score: 75, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4070', score: 70, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4060 Ti', score: 60, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 4060', score: 55, brand: 'NVIDIA' },
  // NVIDIA RTX 30
  { name: 'NVIDIA GeForce RTX 3090 Ti', score: 88, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3090', score: 85, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3080 Ti', score: 82, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3080', score: 78, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3070 Ti', score: 70, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3070', score: 65, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3060 Ti', score: 60, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3060', score: 50, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 3050', score: 35, brand: 'NVIDIA' },
  // NVIDIA RTX 20
  { name: 'NVIDIA GeForce RTX 2080 Ti', score: 65, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 2080 Super', score: 60, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 2080', score: 55, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 2070 Super', score: 50, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 2070', score: 45, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 2060 Super', score: 42, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce RTX 2060', score: 40, brand: 'NVIDIA' },
  // NVIDIA GTX 16
  { name: 'NVIDIA GeForce GTX 1660 Ti', score: 38, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1660 Super', score: 35, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1660', score: 32, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1650 Super', score: 26, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1650', score: 20, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1630', score: 10, brand: 'NVIDIA' },
  // NVIDIA GTX 10
  { name: 'NVIDIA GeForce GTX 1080 Ti', score: 50, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1080', score: 45, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1070 Ti', score: 40, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1070', score: 38, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1060', score: 28, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1050 Ti', score: 18, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 1050', score: 15, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GT 1030', score: 7, brand: 'NVIDIA' },
  // NVIDIA older
  { name: 'NVIDIA GeForce GTX 980 Ti', score: 34, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 980', score: 30, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 970', score: 22, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 960', score: 14, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 950', score: 12, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 780 Ti', score: 16, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 770', score: 11, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 760', score: 9, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 750 Ti', score: 8, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 750', score: 7, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GTX 560 Ti', score: 5, brand: 'NVIDIA' },
  { name: 'NVIDIA GeForce GT 730', score: 4, brand: 'NVIDIA' },
  // AMD RX 9000
  { name: 'AMD Radeon RX 9070 XT', score: 90, brand: 'AMD' },
  { name: 'AMD Radeon RX 9070', score: 82, brand: 'AMD' },
  { name: 'AMD Radeon RX 9060 XT', score: 58, brand: 'AMD' },
  // AMD RX 7000
  { name: 'AMD Radeon RX 7900 XTX', score: 98, brand: 'AMD' },
  { name: 'AMD Radeon RX 7900 XT', score: 92, brand: 'AMD' },
  { name: 'AMD Radeon RX 7900 GRE', score: 85, brand: 'AMD' },
  { name: 'AMD Radeon RX 7800 XT', score: 78, brand: 'AMD' },
  { name: 'AMD Radeon RX 7700 XT', score: 70, brand: 'AMD' },
  { name: 'AMD Radeon RX 7600 XT', score: 58, brand: 'AMD' },
  { name: 'AMD Radeon RX 7600', score: 55, brand: 'AMD' },
  // AMD RX 6000
  { name: 'AMD Radeon RX 6950 XT', score: 85, brand: 'AMD' },
  { name: 'AMD Radeon RX 6900 XT', score: 82, brand: 'AMD' },
  { name: 'AMD Radeon RX 6800 XT', score: 75, brand: 'AMD' },
  { name: 'AMD Radeon RX 6800', score: 70, brand: 'AMD' },
  { name: 'AMD Radeon RX 6750 XT', score: 55, brand: 'AMD' },
  { name: 'AMD Radeon RX 6700 XT', score: 52, brand: 'AMD' },
  { name: 'AMD Radeon RX 6700', score: 48, brand: 'AMD' },
  { name: 'AMD Radeon RX 6650 XT', score: 45, brand: 'AMD' },
  { name: 'AMD Radeon RX 6600 XT', score: 42, brand: 'AMD' },
  { name: 'AMD Radeon RX 6600', score: 40, brand: 'AMD' },
  { name: 'AMD Radeon RX 6500 XT', score: 24, brand: 'AMD' },
  { name: 'AMD Radeon RX 6400', score: 14, brand: 'AMD' },
  // AMD RX 5000
  { name: 'AMD Radeon RX 5700 XT', score: 46, brand: 'AMD' },
  { name: 'AMD Radeon RX 5700', score: 42, brand: 'AMD' },
  { name: 'AMD Radeon RX 5600 XT', score: 38, brand: 'AMD' },
  { name: 'AMD Radeon RX 5500 XT', score: 26, brand: 'AMD' },
  // AMD older
  { name: 'AMD Radeon RX Vega 64', score: 40, brand: 'AMD' },
  { name: 'AMD Radeon RX Vega 56', score: 36, brand: 'AMD' },
  { name: 'AMD Radeon RX 590', score: 30, brand: 'AMD' },
  { name: 'AMD Radeon RX 580', score: 28, brand: 'AMD' },
  { name: 'AMD Radeon RX 570', score: 22, brand: 'AMD' },
  { name: 'AMD Radeon RX 560', score: 14, brand: 'AMD' },
  { name: 'AMD Radeon RX 550', score: 9, brand: 'AMD' },
  { name: 'AMD Radeon RX 480', score: 26, brand: 'AMD' },
  { name: 'AMD Radeon RX 470', score: 20, brand: 'AMD' },
  { name: 'AMD Radeon RX 460', score: 12, brand: 'AMD' },
  { name: 'AMD Radeon R9 390', score: 24, brand: 'AMD' },
  { name: 'AMD Radeon R9 380', score: 14, brand: 'AMD' },
  { name: 'AMD Radeon R9 290', score: 20, brand: 'AMD' },
  { name: 'AMD Radeon R9 280', score: 13, brand: 'AMD' },
  { name: 'AMD Radeon R7 370', score: 12, brand: 'AMD' },
  { name: 'AMD Radeon R7 240', score: 4, brand: 'AMD' },
  { name: 'AMD Radeon R5 220', score: 2, brand: 'AMD' },
  { name: 'AMD Radeon HD 7790', score: 10, brand: 'AMD' },
  { name: 'AMD Radeon HD 7750', score: 5, brand: 'AMD' },
  // Intel Arc
  { name: 'Intel Arc B580', score: 52, brand: 'Intel' },
  { name: 'Intel Arc B570', score: 45, brand: 'Intel' },
  { name: 'Intel Arc A770', score: 48, brand: 'Intel' },
  { name: 'Intel Arc A750', score: 42, brand: 'Intel' },
  { name: 'Intel Arc A580', score: 35, brand: 'Intel' },
  { name: 'Intel Arc A380', score: 18, brand: 'Intel' },
  { name: 'Intel Arc A310', score: 12, brand: 'Intel' },
  // Integrated graphics
  { name: 'AMD Radeon 890M', score: 24, brand: 'AMD', integrated: true },
  { name: 'AMD Radeon 780M', score: 20, brand: 'AMD', integrated: true },
  { name: 'AMD Radeon 680M', score: 16, brand: 'AMD', integrated: true },
  { name: 'AMD Radeon Vega 8', score: 6, brand: 'AMD', integrated: true },
  { name: 'Intel Arc Graphics (integrated)', score: 14, brand: 'Intel', integrated: true },
  { name: 'Intel Iris Xe Graphics', score: 8, brand: 'Intel', integrated: true },
  { name: 'Intel UHD Graphics 770', score: 5, brand: 'Intel', integrated: true },
  { name: 'Intel UHD Graphics 630', score: 4, brand: 'Intel', integrated: true },
  { name: 'Intel HD Graphics 4000', score: 2, brand: 'Intel', integrated: true },
];

export const CPUS: HardwareItem[] = [
  // Intel Core Ultra 200S
  { name: 'Intel Core Ultra 9 285K', score: 98, brand: 'Intel' },
  { name: 'Intel Core Ultra 7 265K', score: 90, brand: 'Intel' },
  { name: 'Intel Core Ultra 5 245K', score: 75, brand: 'Intel' },
  // Intel 14th gen
  { name: 'Intel Core i9-14900K', score: 100, brand: 'Intel' },
  { name: 'Intel Core i7-14700K', score: 92, brand: 'Intel' },
  { name: 'Intel Core i5-14600K', score: 80, brand: 'Intel' },
  { name: 'Intel Core i5-14400F', score: 58, brand: 'Intel' },
  { name: 'Intel Core i5-14400', score: 58, brand: 'Intel' },
  { name: 'Intel Core i3-14100F', score: 44, brand: 'Intel' },
  { name: 'Intel Core i3-14100', score: 44, brand: 'Intel' },
  // Intel 13th gen
  { name: 'Intel Core i9-13900K', score: 98, brand: 'Intel' },
  { name: 'Intel Core i7-13700K', score: 88, brand: 'Intel' },
  { name: 'Intel Core i5-13600K', score: 75, brand: 'Intel' },
  { name: 'Intel Core i5-13400F', score: 55, brand: 'Intel' },
  { name: 'Intel Core i5-13400', score: 55, brand: 'Intel' },
  { name: 'Intel Core i3-13100F', score: 42, brand: 'Intel' },
  { name: 'Intel Core i3-13100', score: 42, brand: 'Intel' },
  // Intel 12th gen
  { name: 'Intel Core i9-12900K', score: 85, brand: 'Intel' },
  { name: 'Intel Core i7-12700K', score: 75, brand: 'Intel' },
  { name: 'Intel Core i7-12700', score: 72, brand: 'Intel' },
  { name: 'Intel Core i5-12600K', score: 65, brand: 'Intel' },
  { name: 'Intel Core i5-12400F', score: 50, brand: 'Intel' },
  { name: 'Intel Core i5-12400', score: 50, brand: 'Intel' },
  { name: 'Intel Core i3-12100F', score: 40, brand: 'Intel' },
  { name: 'Intel Core i3-12100', score: 40, brand: 'Intel' },
  // Intel 11th gen
  { name: 'Intel Core i9-11900K', score: 70, brand: 'Intel' },
  { name: 'Intel Core i7-11700K', score: 60, brand: 'Intel' },
  { name: 'Intel Core i7-11700', score: 58, brand: 'Intel' },
  { name: 'Intel Core i5-11600K', score: 50, brand: 'Intel' },
  { name: 'Intel Core i5-11500', score: 44, brand: 'Intel' },
  { name: 'Intel Core i5-11400F', score: 40, brand: 'Intel' },
  { name: 'Intel Core i5-11400', score: 40, brand: 'Intel' },
  // Intel 10th gen
  { name: 'Intel Core i9-10900K', score: 68, brand: 'Intel' },
  { name: 'Intel Core i7-10700K', score: 58, brand: 'Intel' },
  { name: 'Intel Core i7-10700', score: 56, brand: 'Intel' },
  { name: 'Intel Core i5-10600K', score: 48, brand: 'Intel' },
  { name: 'Intel Core i5-10600', score: 46, brand: 'Intel' },
  { name: 'Intel Core i5-10500', score: 42, brand: 'Intel' },
  { name: 'Intel Core i5-10400F', score: 38, brand: 'Intel' },
  { name: 'Intel Core i5-10400', score: 38, brand: 'Intel' },
  { name: 'Intel Core i3-10100F', score: 28, brand: 'Intel' },
  { name: 'Intel Core i3-10100', score: 28, brand: 'Intel' },
  // Intel 9th gen
  { name: 'Intel Core i9-9900K', score: 60, brand: 'Intel' },
  { name: 'Intel Core i7-9700K', score: 52, brand: 'Intel' },
  { name: 'Intel Core i7-9700', score: 50, brand: 'Intel' },
  { name: 'Intel Core i5-9600K', score: 42, brand: 'Intel' },
  { name: 'Intel Core i5-9600', score: 40, brand: 'Intel' },
  { name: 'Intel Core i5-9400F', score: 36, brand: 'Intel' },
  { name: 'Intel Core i5-9400', score: 36, brand: 'Intel' },
  { name: 'Intel Core i3-9100F', score: 24, brand: 'Intel' },
  // Intel 8th gen
  { name: 'Intel Core i7-8700K', score: 45, brand: 'Intel' },
  { name: 'Intel Core i7-8700', score: 43, brand: 'Intel' },
  { name: 'Intel Core i5-8600K', score: 38, brand: 'Intel' },
  { name: 'Intel Core i5-8400', score: 35, brand: 'Intel' },
  { name: 'Intel Core i3-8100', score: 20, brand: 'Intel' },
  // Intel 7th gen
  { name: 'Intel Core i7-7700K', score: 36, brand: 'Intel' },
  { name: 'Intel Core i7-7700', score: 34, brand: 'Intel' },
  { name: 'Intel Core i5-7600K', score: 30, brand: 'Intel' },
  { name: 'Intel Core i5-7600', score: 29, brand: 'Intel' },
  { name: 'Intel Core i5-7500', score: 27, brand: 'Intel' },
  { name: 'Intel Core i5-7300U', score: 10, brand: 'Intel' },
  { name: 'Intel Core i3-7100', score: 16, brand: 'Intel' },
  // Intel 6th gen
  { name: 'Intel Core i7-6800K', score: 38, brand: 'Intel' },
  { name: 'Intel Core i7-6700K', score: 34, brand: 'Intel' },
  { name: 'Intel Core i7-6700', score: 32, brand: 'Intel' },
  { name: 'Intel Core i5-6600K', score: 28, brand: 'Intel' },
  { name: 'Intel Core i5-6600', score: 26, brand: 'Intel' },
  { name: 'Intel Core i5-6500', score: 24, brand: 'Intel' },
  { name: 'Intel Core i3-6300', score: 15, brand: 'Intel' },
  { name: 'Intel Core i3-6100', score: 14, brand: 'Intel' },
  // Intel 4th and older
  { name: 'Intel Core i7-4790K', score: 27, brand: 'Intel' },
  { name: 'Intel Core i7-4770K', score: 25, brand: 'Intel' },
  { name: 'Intel Core i7-4770', score: 24, brand: 'Intel' },
  { name: 'Intel Core i5-4690K', score: 21, brand: 'Intel' },
  { name: 'Intel Core i5-4690', score: 20, brand: 'Intel' },
  { name: 'Intel Core i5-4590', score: 18, brand: 'Intel' },
  { name: 'Intel Core i5-4460', score: 16, brand: 'Intel' },
  { name: 'Intel Core i5-4430', score: 15, brand: 'Intel' },
  { name: 'Intel Core i3-4150', score: 10, brand: 'Intel' },
  { name: 'Intel Core i7-3770K', score: 18, brand: 'Intel' },
  { name: 'Intel Core i7-3770', score: 17, brand: 'Intel' },
  { name: 'Intel Core i5-3570K', score: 15, brand: 'Intel' },
  { name: 'Intel Core i5-3470', score: 14, brand: 'Intel' },
  { name: 'Intel Core i3-3240', score: 8, brand: 'Intel' },
  { name: 'Intel Core i3-3225', score: 7, brand: 'Intel' },
  { name: 'Intel Core i7-2600K', score: 15, brand: 'Intel' },
  { name: 'Intel Core i5-2500K', score: 12, brand: 'Intel' },
  { name: 'Intel Core i5 750', score: 4, brand: 'Intel' },
  { name: 'Intel Core i3-540', score: 3, brand: 'Intel' },
  // AMD Ryzen 9000
  { name: 'AMD Ryzen 7 9800X3D', score: 100, brand: 'AMD' },
  { name: 'AMD Ryzen 9 9950X3D', score: 100, brand: 'AMD' },
  { name: 'AMD Ryzen 9 9950X', score: 98, brand: 'AMD' },
  { name: 'AMD Ryzen 9 9900X', score: 95, brand: 'AMD' },
  { name: 'AMD Ryzen 7 9700X', score: 82, brand: 'AMD' },
  { name: 'AMD Ryzen 5 9600X', score: 72, brand: 'AMD' },
  // AMD Ryzen 7000
  { name: 'AMD Ryzen 9 7950X3D', score: 98, brand: 'AMD' },
  { name: 'AMD Ryzen 9 7950X', score: 95, brand: 'AMD' },
  { name: 'AMD Ryzen 9 7900X3D', score: 90, brand: 'AMD' },
  { name: 'AMD Ryzen 9 7900X', score: 88, brand: 'AMD' },
  { name: 'AMD Ryzen 7 7800X3D', score: 90, brand: 'AMD' },
  { name: 'AMD Ryzen 7 7700X', score: 72, brand: 'AMD' },
  { name: 'AMD Ryzen 7 7700', score: 70, brand: 'AMD' },
  { name: 'AMD Ryzen 5 7600X', score: 58, brand: 'AMD' },
  { name: 'AMD Ryzen 5 7600', score: 55, brand: 'AMD' },
  { name: 'AMD Ryzen 5 7500F', score: 54, brand: 'AMD' },
  // AMD Ryzen 5000
  { name: 'AMD Ryzen 9 5950X', score: 82, brand: 'AMD' },
  { name: 'AMD Ryzen 9 5900X', score: 78, brand: 'AMD' },
  { name: 'AMD Ryzen 7 5800X3D', score: 80, brand: 'AMD' },
  { name: 'AMD Ryzen 7 5800X', score: 62, brand: 'AMD' },
  { name: 'AMD Ryzen 7 5700X3D', score: 72, brand: 'AMD' },
  { name: 'AMD Ryzen 7 5700X', score: 58, brand: 'AMD' },
  { name: 'AMD Ryzen 7 5700G', score: 46, brand: 'AMD' },
  { name: 'AMD Ryzen 5 5600X', score: 50, brand: 'AMD' },
  { name: 'AMD Ryzen 5 5600G', score: 44, brand: 'AMD' },
  { name: 'AMD Ryzen 5 5600', score: 48, brand: 'AMD' },
  { name: 'AMD Ryzen 5 5500', score: 42, brand: 'AMD' },
  // AMD Ryzen 3000
  { name: 'AMD Ryzen 9 3950X', score: 65, brand: 'AMD' },
  { name: 'AMD Ryzen 9 3900X', score: 60, brand: 'AMD' },
  { name: 'AMD Ryzen 7 3800X', score: 52, brand: 'AMD' },
  { name: 'AMD Ryzen 7 3700X', score: 48, brand: 'AMD' },
  { name: 'AMD Ryzen 5 3600X', score: 40, brand: 'AMD' },
  { name: 'AMD Ryzen 5 3600', score: 38, brand: 'AMD' },
  { name: 'AMD Ryzen 5 3500', score: 30, brand: 'AMD' },
  { name: 'AMD Ryzen 5 3400G', score: 24, brand: 'AMD' },
  { name: 'AMD Ryzen 3 3300X', score: 32, brand: 'AMD' },
  { name: 'AMD Ryzen 3 3200G', score: 20, brand: 'AMD' },
  { name: 'AMD Ryzen 3 3100', score: 26, brand: 'AMD' },
  { name: 'AMD Ryzen 3 3300U', score: 9, brand: 'AMD' },
  // AMD Ryzen 2000 and 1000
  { name: 'AMD Ryzen 7 2700X', score: 40, brand: 'AMD' },
  { name: 'AMD Ryzen 7 2700', score: 37, brand: 'AMD' },
  { name: 'AMD Ryzen 5 2600X', score: 32, brand: 'AMD' },
  { name: 'AMD Ryzen 5 2600', score: 30, brand: 'AMD' },
  { name: 'AMD Ryzen 5 2500X', score: 26, brand: 'AMD' },
  { name: 'AMD Ryzen 5 2400G', score: 20, brand: 'AMD' },
  { name: 'AMD Ryzen 3 2200G', score: 16, brand: 'AMD' },
  { name: 'AMD Ryzen 7 1800X', score: 35, brand: 'AMD' },
  { name: 'AMD Ryzen 7 1700', score: 32, brand: 'AMD' },
  { name: 'AMD Ryzen 5 1600X', score: 27, brand: 'AMD' },
  { name: 'AMD Ryzen 5 1600', score: 25, brand: 'AMD' },
  { name: 'AMD Ryzen 5 1500X', score: 22, brand: 'AMD' },
  { name: 'AMD Ryzen 5 1400', score: 20, brand: 'AMD' },
  { name: 'AMD Ryzen 3 1200', score: 15, brand: 'AMD' },
  // AMD older
  { name: 'AMD FX-9590', score: 16, brand: 'AMD' },
  { name: 'AMD FX-8350', score: 12, brand: 'AMD' },
  { name: 'AMD FX-6300', score: 9, brand: 'AMD' },
  { name: 'AMD FX-4350', score: 7, brand: 'AMD' },
  { name: 'AMD FX-4300', score: 6, brand: 'AMD' },
  { name: 'AMD Athlon 200GE', score: 6, brand: 'AMD' },
];

// Words that carry no model information. Removing them lets "GeForce RTX 3060",
// "NVIDIA RTX 3060" and "rtx3060" all reduce to the same key.
const NOISE_WORDS = /\b(nvidia|geforce|amd|radeon|intel|graphics|core|processor|cpu|gpu|desktop|series|\(r\)|\(tm\)|®|™)\b/gi;

export function normalizeHardware(text: string, kind?: HardwareKind): string {
  let t = text.toLowerCase();
  // "R5 3600" is common shorthand for Ryzen 5 3600. Only for processors, because
  // "R5 220" is also the name of an old Radeon graphics card.
  if (kind === 'cpu') t = t.replace(/\br([3579])\s*(\d{4})/g, 'ryzen $1 $2');
  return t.replace(NOISE_WORDS, ' ').replace(/[^a-z0-9]/g, '');
}

type Key = { key: string; item: HardwareItem };

function buildKeys(items: HardwareItem[], kind: HardwareKind): Key[] {
  const keys: Key[] = [];
  for (const item of items) {
    const key = normalizeHardware(item.name);
    if (key) keys.push({ key, item });
    // Publishers sometimes drop the GTX or RTX prefix ("GeForce 1070 Ti").
    if (kind === 'gpu' && item.brand === 'NVIDIA') {
      const bare = key.replace(/^(rtx|gtx|gt)/, '');
      if (/^\d{4}/.test(bare)) keys.push({ key: bare, item });
    }
  }
  // Longest first, so "rtx4070tisuper" wins over "rtx4070" when both fit.
  return keys.sort((a, b) => b.key.length - a.key.length);
}

const GPU_KEYS = buildKeys(GPUS, 'gpu');
const CPU_KEYS = buildKeys(CPUS, 'cpu');

function keysFor(kind: HardwareKind) {
  return kind === 'gpu' ? GPU_KEYS : CPU_KEYS;
}

function matchSegment(segment: string, kind: HardwareKind): HardwareItem | null {
  const n = normalizeHardware(segment, kind);
  if (n.length < 3) return null;
  const keys = keysFor(kind);
  const exact = keys.find((k) => k.key === n);
  if (exact) return exact.item;
  const contained = keys.find((k) => k.key.length >= 4 && n.includes(k.key));
  return contained ? contained.item : null;
}

/**
 * Finds the hardware named in a piece of text. Returns null when nothing in the
 * catalogue is named, which is how made up input like "adsasd" is rejected.
 * Publisher strings list alternatives ("GTX 1060 / RX 580"), so the first
 * alternative that matches is used.
 */
export function matchHardware(text: string, kind: HardwareKind): HardwareItem | null {
  if (!text || typeof text !== 'string') return null;
  const segments = text.split(/\/|,|\||\bor\b/i);
  for (const segment of segments) {
    const hit = matchSegment(segment, kind);
    if (hit) return hit;
  }
  return null;
}

/** Up to `limit` catalogue names that contain what the visitor has typed so far. */
export function suggestHardware(query: string, kind: HardwareKind, limit = 8): HardwareItem[] {
  const items = kind === 'gpu' ? GPUS : CPUS;
  const q = normalizeHardware(query, kind);
  if (!q) return [];
  const starts: HardwareItem[] = [];
  const contains: HardwareItem[] = [];
  for (const item of items) {
    const key = normalizeHardware(item.name);
    const bare = key.replace(/^(rtx|gtx|gt|rx|arc)/, '');
    if (key.startsWith(q) || bare.startsWith(q)) starts.push(item);
    else if (key.includes(q)) contains.push(item);
  }
  return [...starts, ...contains].slice(0, limit);
}
