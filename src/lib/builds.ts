import cpu from "@/assets/parts/cpu.png";
import motherboard from "@/assets/parts/motherboard.png";
import ram from "@/assets/parts/ram.png";
import storage from "@/assets/parts/storage.png";
import gpu from "@/assets/parts/gpu.png";
import caseImg from "@/assets/parts/case.png";
import cooler from "@/assets/parts/cooler.png";
import psu from "@/assets/parts/psu.png";
import peripherals from "@/assets/parts/peripherals.png";
import cs2Cover from "@/assets/games/cs2.jpg";
import gtavCover from "@/assets/games/gtav.jpg";
import fortniteCover from "@/assets/games/fortnite.jpg";
import warzoneCover from "@/assets/games/warzone.jpg";
import cyberpunkCover from "@/assets/games/cyberpunk.jpg";
import valorantCover from "@/assets/games/valorant.jpg";
import fifaCover from "@/assets/games/fifa.jpg";

export type Usage = "g1080" | "g1440" | "stream";
export type TierId = "economy" | "mid" | "high";

export interface Part {
  name: string;
  model: string;
  price: number;
  image: string;
}

export interface Game {
  name: string;
  cover: string;
  fps: Record<Usage, string>;
}

export interface Build {
  id: TierId;
  label: string;
  parts: Part[];
  games: Game[];
}

export const usageOptions: { id: Usage; label: string }[] = [
  { id: "g1080", label: "ألعاب 1080p" },
  { id: "g1440", label: "ألعاب 1440p" },
  { id: "stream", label: "بث" },
];

export const usageDetails: Record<Usage, Record<TierId, string>> = {
  g1080: {
    economy: "1080p · إعدادات متوسطة",
    mid: "1080p · إعدادات عالية",
    high: "1080p · إعدادات قصوى",
  },
  g1440: {
    economy: "1440p · إعدادات منخفضة",
    mid: "1440p · إعدادات متوسطة",
    high: "1440p · إعدادات عالية",
  },
  stream: {
    economy: "بث · إعدادات منخفضة",
    mid: "بث · إعدادات متوسطة",
    high: "بث · 1440p · إعدادات عالية",
  },
};

const economyBuild: Build = {
  id: "economy",
  label: "اقتصادية",
  parts: [
    { name: "المعالج", model: "AMD Ryzen 5 5500", price: 28500, image: cpu },
    { name: "اللوحة الأم", model: "Gigabyte A520M K V2", price: 11000, image: motherboard },
    { name: "الذاكرة", model: "Kingston Fury 16GB DDR4 3200", price: 8500, image: ram },
    { name: "التخزين", model: "NVMe SSD 512GB", price: 7000, image: storage },
    { name: "كرت الشاشة", model: "Radeon RX 6600 8GB", price: 38000, image: gpu },
    { name: "الصندوق", model: "Zalman N5 MF", price: 6500, image: caseImg },
    { name: "التبريد", model: "DeepCool AK400", price: 3500, image: cooler },
    { name: "مزود الطاقة", model: "Cooler Master 550W 80+", price: 7000, image: psu },
    { name: "الملحقات", model: "Gaming Combo RGB", price: 9500, image: peripherals },
  ],
  games: [
    { name: "Counter-Strike 2", cover: cs2Cover, fps: { g1080: "200+ FPS", g1440: "140 FPS", stream: "110 FPS" } },
    { name: "GTA V", cover: gtavCover, fps: { g1080: "120 FPS", g1440: "85 FPS", stream: "70 FPS" } },
    { name: "Fortnite", cover: fortniteCover, fps: { g1080: "110 FPS", g1440: "75 FPS", stream: "60 FPS" } },
    { name: "Warzone", cover: warzoneCover, fps: { g1080: "80 FPS", g1440: "55 FPS", stream: "45 FPS" } },
    { name: "Cyberpunk 2077", cover: cyberpunkCover, fps: { g1080: "60 FPS", g1440: "40 FPS", stream: "30 FPS" } },
    { name: "Valorant", cover: valorantCover, fps: { g1080: "220 FPS", g1440: "150 FPS", stream: "120 FPS" } },
    { name: "EA Sports FC 25", cover: fifaCover, fps: { g1080: "100 FPS", g1440: "70 FPS", stream: "55 FPS" } },
  ],
};

const midBuild: Build = {
  id: "mid",
  label: "متوسطة",
  parts: [
    { name: "المعالج", model: "AMD Ryzen 5 7600", price: 42000, image: cpu },
    { name: "اللوحة الأم", model: "MSI PRO B650M-B", price: 24000, image: motherboard },
    { name: "الذاكرة", model: "Kingston Fury 16GB DDR5 5600", price: 13500, image: ram },
    { name: "التخزين", model: "NVMe SSD 1TB", price: 12500, image: storage },
    { name: "كرت الشاشة", model: "GeForce RTX 4060 8GB", price: 52000, image: gpu },
    { name: "الصندوق", model: "DeepCool CC560", price: 11000, image: caseImg },
    { name: "التبريد", model: "DeepCool AG400", price: 5500, image: cooler },
    { name: "مزود الطاقة", model: "Cooler Master 650W 80+", price: 12000, image: psu },
    { name: "الملحقات", model: "Gaming Combo RGB", price: 12500, image: peripherals },
  ],
  games: [
    { name: "Counter-Strike 2", cover: cs2Cover, fps: { g1080: "240+ FPS", g1440: "170 FPS", stream: "140 FPS" } },
    { name: "GTA V", cover: gtavCover, fps: { g1080: "145 FPS", g1440: "95 FPS", stream: "80 FPS" } },
    { name: "Fortnite", cover: fortniteCover, fps: { g1080: "120 FPS", g1440: "85 FPS", stream: "70 FPS" } },
    { name: "Warzone", cover: warzoneCover, fps: { g1080: "105 FPS", g1440: "70 FPS", stream: "60 FPS" } },
    { name: "Cyberpunk 2077", cover: cyberpunkCover, fps: { g1080: "82 FPS", g1440: "55 FPS", stream: "45 FPS" } },
    { name: "Valorant", cover: valorantCover, fps: { g1080: "260 FPS", g1440: "190 FPS", stream: "160 FPS" } },
    { name: "EA Sports FC 25", cover: fifaCover, fps: { g1080: "130 FPS", g1440: "95 FPS", stream: "80 FPS" } },
  ],
};

const highBuild: Build = {
  id: "high",
  label: "قوية",
  parts: [
    { name: "المعالج", model: "AMD Ryzen 7 9800X3D", price: 115000, image: cpu },
    { name: "اللوحة الأم", model: "MSI X870 Gaming Plus", price: 45000, image: motherboard },
    { name: "الذاكرة", model: "Kingston Fury 32GB DDR5 6000", price: 30000, image: ram },
    { name: "التخزين", model: "NVMe SSD 2TB Gen4", price: 25000, image: storage },
    { name: "كرت الشاشة", model: "GeForce RTX 5070 Ti 16GB", price: 125000, image: gpu },
    { name: "الصندوق", model: "DeepCool CK560 Black", price: 14000, image: caseImg },
    { name: "التبريد", model: "AIO 240mm RGB", price: 18000, image: cooler },
    { name: "مزود الطاقة", model: "Corsair RM850e Gold", price: 20000, image: psu },
    { name: "الملحقات", model: "Gaming Combo RGB Pro", price: 15000, image: peripherals },
  ],
  games: [
    { name: "Counter-Strike 2", cover: cs2Cover, fps: { g1080: "400+ FPS", g1440: "300+ FPS", stream: "240+ FPS" } },
    { name: "GTA V", cover: gtavCover, fps: { g1080: "200+ FPS", g1440: "150 FPS", stream: "130 FPS" } },
    { name: "Fortnite", cover: fortniteCover, fps: { g1080: "180 FPS", g1440: "140 FPS", stream: "120 FPS" } },
    { name: "Warzone", cover: warzoneCover, fps: { g1080: "160 FPS", g1440: "120 FPS", stream: "100 FPS" } },
    { name: "Cyberpunk 2077", cover: cyberpunkCover, fps: { g1080: "120 FPS", g1440: "90 FPS", stream: "80 FPS" } },
    { name: "Valorant", cover: valorantCover, fps: { g1080: "450 FPS", g1440: "340 FPS", stream: "280 FPS" } },
    { name: "EA Sports FC 25", cover: fifaCover, fps: { g1080: "200 FPS", g1440: "150 FPS", stream: "130 FPS" } },
  ],
};

export const builds: Build[] = [economyBuild, midBuild, highBuild];

export function getBuildForBudget(amount: number): Build {
  if (amount <= 140_000) return economyBuild;
  if (amount <= 280_000) return midBuild;
  return highBuild;
}

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(price: number): string {
  return usdFormatter.format(price);
}
