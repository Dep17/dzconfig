import { supabase } from "@/lib/supabase";

const MAX_PERFORMANCE_DIFFERENCE = 0.3;
const OTHER_COMPONENTS_POWER_DRAW = 75;

export interface CatalogPart {
  brand?: string | null;
  model?: string | null;
  price?: number | string | null;
  socket_type?: string | null;
  ram_type?: string | null;
  power_draw?: number | string | null;
  performance_score?: number | string | null;
  wattage?: number | string | null;
  capacity?: number | string | null;
}

export interface BuildPart {
  name: string;
  model: string;
  price: number;
}

export interface BuildRecommendation {
  totalPrice: number;
  totalPower: number;
  parts: BuildPart[];
}

interface Catalog {
  cpus: CatalogPart[];
  gpus: CatalogPart[];
  motherboards: CatalogPart[];
  rams: CatalogPart[];
  psus: CatalogPart[];
  cases: CatalogPart[];
}

function numericValue(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalized(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function priceOf(part: CatalogPart): number | null {
  const price = numericValue(part.price);
  return price !== null && price >= 0 ? price : null;
}

function modelName(part: CatalogPart): string {
  return (
    [part.brand, part.model]
      .filter((value): value is string => typeof value === "string" && value.trim() !== "")
      .map((value) => value.trim())
      .join(" ") || "غير محدد"
  );
}

function highestAffordable(
  partsSortedByPrice: CatalogPart[],
  maximumPrice: number,
): CatalogPart | null {
  let low = 0;
  let high = partsSortedByPrice.length - 1;
  let bestIndex = -1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const price = priceOf(partsSortedByPrice[middle]!);
    if (price !== null && price <= maximumPrice) {
      bestIndex = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return bestIndex === -1 ? null : (partsSortedByPrice[bestIndex] ?? null);
}

function makeRecommendation(
  cpu: CatalogPart,
  gpu: CatalogPart,
  motherboard: CatalogPart,
  ram: CatalogPart,
  psu: CatalogPart,
  pcCase: CatalogPart,
  totalPower: number,
): BuildRecommendation | null {
  const prices = [
    priceOf(cpu),
    priceOf(gpu),
    priceOf(motherboard),
    priceOf(ram),
    priceOf(psu),
    priceOf(pcCase),
  ];
  if (prices.some((price) => price === null)) return null;

  const ramModel = modelName(ram);
  const ramCapacity = numericValue(ram.capacity);
  const psuModel = modelName(psu);
  const psuWattage = numericValue(psu.wattage);
  const parts: BuildPart[] = [
    { name: "المعالج", model: modelName(cpu), price: prices[0]! },
    { name: "كرت الشاشة", model: modelName(gpu), price: prices[1]! },
    { name: "اللوحة الأم", model: modelName(motherboard), price: prices[2]! },
    {
      name: "الذاكرة العشوائية",
      model: [
        ramModel,
        ramCapacity !== null && !ramModel.toLowerCase().includes(`${ramCapacity}gb`)
          ? `${ramCapacity}GB`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      price: prices[3]!,
    },
    {
      name: "مزود الطاقة",
      model:
        psuWattage !== null && !psuModel.toLowerCase().includes(`${psuWattage}w`)
          ? `${psuModel} ${psuWattage}W`
          : psuModel,
      price: prices[4]!,
    },
    { name: "الصندوق", model: modelName(pcCase), price: prices[5]! },
  ];

  return {
    totalPrice: parts.reduce((total, part) => total + part.price, 0),
    totalPower,
    parts,
  };
}

export function findOptimalBuild(catalog: Catalog, budget: number): BuildRecommendation | null {
  let bestBuild: BuildRecommendation | null = null;
  let bestPerformanceDifference = Infinity;

  const compatibleCases = catalog.cases
    .filter((pcCase) => priceOf(pcCase) !== null)
    .sort((first, second) => priceOf(first)! - priceOf(second)!);
  if (compatibleCases.length === 0) return null;

  for (const cpu of catalog.cpus) {
    const cpuPrice = priceOf(cpu);
    const cpuScore = numericValue(cpu.performance_score);
    const cpuPower = numericValue(cpu.power_draw);
    if (
      cpuPrice === null ||
      cpuScore === null ||
      cpuScore <= 0 ||
      cpuPower === null ||
      cpuPower < 0
    ) {
      continue;
    }

    const compatibleMotherboards = catalog.motherboards.filter(
      (motherboard) =>
        normalized(motherboard.socket_type) === normalized(cpu.socket_type) &&
        normalized(cpu.socket_type) !== "",
    );

    for (const gpu of catalog.gpus) {
      const gpuPrice = priceOf(gpu);
      const gpuScore = numericValue(gpu.performance_score);
      const gpuPower = numericValue(gpu.power_draw);
      if (
        gpuPrice === null ||
        gpuScore === null ||
        gpuScore <= 0 ||
        gpuPower === null ||
        gpuPower < 0
      ) {
        continue;
      }

      const performanceDifference = Math.abs(cpuScore - gpuScore) / ((cpuScore + gpuScore) / 2);
      if (performanceDifference > MAX_PERFORMANCE_DIFFERENCE) continue;

      const totalPower = cpuPower + gpuPower + OTHER_COMPONENTS_POWER_DRAW;
      const compatiblePsus = catalog.psus
        .filter((psu) => {
          const wattage = numericValue(psu.wattage);
          return wattage !== null && wattage >= totalPower && priceOf(psu) !== null;
        })
        .sort((first, second) => priceOf(first)! - priceOf(second)!);
      if (compatiblePsus.length === 0) continue;

      for (const motherboard of compatibleMotherboards) {
        const motherboardPrice = priceOf(motherboard);
        if (motherboardPrice === null) continue;

        const compatibleRams = catalog.rams.filter(
          (candidate) =>
            priceOf(candidate) !== null &&
            normalized(candidate.ram_type) === normalized(motherboard.ram_type) &&
            normalized(motherboard.ram_type) !== "",
        );
        for (const ram of compatibleRams) {
          const ramPrice = priceOf(ram);
          if (ramPrice === null) continue;

          for (const psu of compatiblePsus) {
            const basePrice =
              cpuPrice + gpuPrice + motherboardPrice + ramPrice + (priceOf(psu) ?? Infinity);
            if (basePrice > budget) break;

            const pcCase = highestAffordable(compatibleCases, budget - basePrice);
            if (!pcCase) continue;

            const build = makeRecommendation(cpu, gpu, motherboard, ram, psu, pcCase, totalPower);
            if (
              build &&
              (bestBuild === null ||
                build.totalPrice > bestBuild.totalPrice ||
                (build.totalPrice === bestBuild.totalPrice &&
                  performanceDifference < bestPerformanceDifference))
            ) {
              bestBuild = build;
              bestPerformanceDifference = performanceDifference;
            }
          }
        }
      }
    }
  }

  return bestBuild;
}

function requireRows<T>(
  table: string,
  result: { data: T[] | null; error: { message: string } | null },
): T[] {
  if (result.error) {
    throw new Error(`تعذر تحميل بيانات جدول ${table}: ${result.error.message}`);
  }
  return result.data ?? [];
}

export async function generateOptimalBuild(budget: number): Promise<BuildRecommendation | null> {
  if (!Number.isFinite(budget) || budget <= 0) return null;

  const [cpusRes, gpusRes, motherboardsRes, ramsRes, psusRes, casesRes] = await Promise.all([
    supabase.from("cpu").select("*"),
    supabase.from("gpu").select("*"),
    supabase.from("motherboard").select("*"),
    supabase.from("ram").select("*"),
    supabase.from("psu").select("*"),
    supabase.from("CASE").select("*"),
  ]);

  return findOptimalBuild(
    {
      cpus: requireRows("cpu", cpusRes),
      gpus: requireRows("gpu", gpusRes),
      motherboards: requireRows("motherboard", motherboardsRes),
      rams: requireRows("ram", ramsRes),
      psus: requireRows("psu", psusRes),
      cases: requireRows("CASE", casesRes),
    },
    budget,
  );
}
