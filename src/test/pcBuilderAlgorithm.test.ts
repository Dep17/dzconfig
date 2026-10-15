import { describe, expect, it } from "vitest";
import { findOptimalBuild } from "@/lib/pcBuilderAlgorithm";

const baseCatalog = {
  cpus: [
    {
      brand: "AMD",
      model: "CPU 100",
      price: 100,
      socket_type: "AM4",
      power_draw: 65,
      performance_score: 100,
    },
  ],
  gpus: [
    {
      brand: "NVIDIA",
      model: "GPU 120",
      price: 200,
      power_draw: 150,
      performance_score: 120,
    },
    {
      brand: "NVIDIA",
      model: "GPU 200",
      price: 250,
      power_draw: 200,
      performance_score: 200,
    },
  ],
  motherboards: [
    { brand: "Board", model: "AM4 DDR4", price: 50, socket_type: "am4", ram_type: "DDR4" },
  ],
  rams: [{ brand: "RAM", model: "Fury", price: 25, capacity: 16, ram_type: "ddr4" }],
  psus: [{ brand: "PSU", model: "Gold", price: 40, wattage: 500 }],
  cases: [{ brand: "Case", model: "Basic", price: 30 }],
};

describe("findOptimalBuild", () => {
  it("chooses the closest-to-budget build with balanced performance and raw prices", () => {
    const build = findOptimalBuild(baseCatalog, 450);

    expect(build).toEqual({
      totalPrice: 445,
      totalPower: 290,
      parts: [
        { name: "المعالج", model: "AMD CPU 100", price: 100 },
        { name: "كرت الشاشة", model: "NVIDIA GPU 120", price: 200 },
        { name: "اللوحة الأم", model: "Board AM4 DDR4", price: 50 },
        { name: "الذاكرة العشوائية", model: "RAM Fury 16GB", price: 25 },
        { name: "مزود الطاقة", model: "PSU Gold 500W", price: 40 },
        { name: "الصندوق", model: "Case Basic", price: 30 },
      ],
    });
  });

  it("rejects incompatible sockets and memory types", () => {
    const catalog = {
      ...baseCatalog,
      motherboards: [
        { brand: "Board", model: "LGA", price: 50, socket_type: "LGA1700", ram_type: "DDR5" },
      ],
      rams: [{ brand: "RAM", model: "DDR4", price: 25, ram_type: "DDR4" }],
    };

    expect(findOptimalBuild(catalog, 1000)).toBeNull();
  });

  it("searches all compatible memory, power supply, and case options to use the budget", () => {
    const catalog = {
      ...baseCatalog,
      rams: [
        ...baseCatalog.rams,
        { brand: "RAM", model: "Pro", price: 35, capacity: 16, ram_type: "DDR4" },
      ],
      psus: [...baseCatalog.psus, { brand: "PSU", model: "Platinum", price: 60, wattage: 500 }],
      cases: [...baseCatalog.cases, { brand: "Case", model: "Airflow", price: 35 }],
    };

    const build = findOptimalBuild(catalog, 480);

    expect(build?.totalPrice).toBe(480);
    expect(build?.parts.map((part) => part.model)).toContain("RAM Pro 16GB");
    expect(build?.parts.map((part) => part.model)).toContain("PSU Platinum 500W");
    expect(build?.parts.map((part) => part.model)).toContain("Case Airflow");
  });

  it("does not return a build that exceeds the budget or violates the performance limit", () => {
    expect(findOptimalBuild(baseCatalog, 300)).toBeNull();

    const mismatchedCatalog = {
      ...baseCatalog,
      gpus: [{ ...baseCatalog.gpus[1]!, price: 200 }],
    };
    expect(findOptimalBuild(mismatchedCatalog, 1000)).toBeNull();
  });

  it("requires a power supply that covers the estimated system draw", () => {
    const catalog = {
      ...baseCatalog,
      psus: [{ brand: "PSU", model: "200W", price: 20, wattage: 200 }],
    };

    expect(findOptimalBuild(catalog, 1000)).toBeNull();
  });
});
