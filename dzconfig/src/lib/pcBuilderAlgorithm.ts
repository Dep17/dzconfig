import { supabase } from "@/lib/supabase";

const EXCHANGE_RATE_CENTIME_TO_USD = 2400;

export async function generateOptimalBuild(userBudgetInCentimes: number) {
  try {
    const maxBudgetUSD = userBudgetInCentimes / EXCHANGE_RATE_CENTIME_TO_USD;

    const [cpusRes, gpusRes, mobosRes, ramsRes, psusRes, casesRes] = await Promise.all([
      supabase.from("cpu").select("*"),
      supabase.from("gpu").select("*"),
      supabase.from("motherboard").select("*"),
      supabase.from("ram").select("*"),
      supabase.from("psu").select("*"),
      supabase.from("CASE").select("*"),
    ]);

    const cpus = cpusRes.data || [];
    const gpus = gpusRes.data || [];
    const mobos = mobosRes.data || [];
    const rams = ramsRes.data || [];
    const psus = psusRes.data || [];
    const cases = casesRes.data || [];

    if (cpus.length === 0 || gpus.length === 0 || mobos.length === 0) {
      return null;
    }

    const cpu = cpus[0];
    const mobo = mobos.find(m => m.socket_type?.trim().toLowerCase() === cpu.socket_type?.trim().toLowerCase()) || mobos[0];
    const ram = rams.find(r => r.ram_type?.trim().toLowerCase() === mobo.ram_type?.trim().toLowerCase()) || rams[0];
    const gpu = gpus[0];
    const psu = psus[0];
    const pcCase = cases[0];

    // استخراج السعر مع التأكد من جلب الحقل الصحيح
    const cpuPrice = Number(cpu.price || cpu.cost || 0);
    const gpuPrice = Number(gpu.price || gpu.cost || 0);
    const moboPrice = Number(mobo.price || mobo.cost || 0);
    const ramPrice = Number(ram.price || ram.cost || 0);
    const psuPrice = Number(psu.price || psu.cost || 0);
    const casePrice = Number(pcCase.price || pcCase.cost || 0);

    const totalPriceUSD = cpuPrice + gpuPrice + moboPrice + ramPrice + psuPrice + casePrice;
    const totalPriceCentimes = Math.round(totalPriceUSD * EXCHANGE_RATE_CENTIME_TO_USD);
    const totalPower = (cpu.power_draw || 65) + (gpu.power_draw || 150) + 75;

    return {
      totalPriceUSD,
      totalPriceCentimes,
      totalPower,
      parts: [
        { name: "المعالج", model: `${cpu.brand} ${cpu.model}`, priceCentimes: Math.round(cpuPrice * EXCHANGE_RATE_CENTIME_TO_USD) },
        { name: "كرت الشاشة", model: `${gpu.brand} ${gpu.model}`, priceCentimes: Math.round(gpuPrice * EXCHANGE_RATE_CENTIME_TO_USD) },
        { name: "اللوحة الأم", model: `${mobo.brand} ${mobo.model}`, priceCentimes: Math.round(moboPrice * EXCHANGE_RATE_CENTIME_TO_USD) },
        { name: "الذاكرة العشوائية", model: `${ram.brand} ${ram.model} (${ram.capacity}GB)`, priceCentimes: Math.round(ramPrice * EXCHANGE_RATE_CENTIME_TO_USD) },
        { name: "مزود الطاقة", model: `${psu.brand} ${psu.wattage}W`, priceCentimes: Math.round(psuPrice * EXCHANGE_RATE_CENTIME_TO_USD) },
        { name: "الصندوق", model: `${pcCase.brand} ${pcCase.model}`, priceCentimes: Math.round(casePrice * EXCHANGE_RATE_CENTIME_TO_USD) },
      ]
    };
  } catch (error) {
    console.error("خطأ في توليد التجميعة:", error);
    return null;
  }
}