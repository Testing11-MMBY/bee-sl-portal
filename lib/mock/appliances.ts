export interface Appliance {
  regId: string;
  brand: string;
  model: string;
  category: string;
  stars: number;
  iseer: number;
  annualKwh: number;
  capacityW: number;
  validFrom: string;
  validTo: string;
  features: string[];
}

export const APPLIANCES: Appliance[] = [
  {
    regId: "BEE/RAC/2024/09841",
    brand: "Daikin India Ltd.",
    model: "FTKM50U 1.5-Ton Inverter AC",
    category: "Room ACs",
    stars: 5,
    iseer: 5.4,
    annualKwh: 523.5,
    capacityW: 5280,
    validFrom: "Jan 2024",
    validTo: "Dec 2026",
    features: ["100% Copper Condenser with Anti-Corrosion", "R-32 Eco Refrigerant (Zero ODP)"],
  },
  {
    regId: "BEE/RAC/2024/07122",
    brand: "Voltas (A Tata Enterprise)",
    model: "Maha Adjustable 185V DAZ",
    category: "Room ACs",
    stars: 5,
    iseer: 5.1,
    annualKwh: 589.2,
    capacityW: 5100,
    validFrom: "Jan 2024",
    validTo: "Dec 2026",
    features: ["Superdry Fast Dehumidification Mode", "Stabilizer-Free Operation (145V - 290V)"],
  },
  {
    regId: "BEE/RAC/2024/11054",
    brand: "LG Electronics India",
    model: "AI DUAL Inverter TS-Q19YNZE",
    category: "Room ACs",
    stars: 5,
    iseer: 5.25,
    annualKwh: 540.8,
    capacityW: 5000,
    validFrom: "Jan 2024",
    validTo: "Dec 2026",
    features: ["Dual Inverter with 6-in-1 AI Convertible", "Ocean Black Protection against Salt & Smoke"],
  },
  {
    regId: "BEE/RAC/2024/04882",
    brand: "Blue Star Ltd.",
    model: "Precision Inverter IC518YBTU",
    category: "Room ACs",
    stars: 5,
    iseer: 5.02,
    annualKwh: 598.0,
    capacityW: 5050,
    validFrom: "Jan 2024",
    validTo: "Dec 2026",
    features: ["Acoustic Jacket on Compressor", "Turbo Cool High Ambient up to 52°C"],
  },
  {
    regId: "BEE/RAC/2024/02319",
    brand: "Godrej & Boyce Mfg.",
    model: "Turbo 5-in-1 AC 18TC3-WWR",
    category: "Room ACs",
    stars: 5,
    iseer: 5.15,
    annualKwh: 564.0,
    capacityW: 5000,
    validFrom: "Jan 2024",
    validTo: "Dec 2026",
    features: ["Heavy Duty Twin Rotary Inverter", "Anti-Bacterial Nano Coated Air Filter"],
  },
  {
    regId: "BEE/RAC/2024/06312",
    brand: "Havells India (Lloyd)",
    model: "Stellar GLS18I5FWRBP Inverter",
    category: "Room ACs",
    stars: 5,
    iseer: 5.08,
    annualKwh: 579.5,
    capacityW: 5150,
    validFrom: "Jan 2024",
    validTo: "Dec 2026",
    features: ["Direct BLDC Inverter Motor Driven", "Rapid Cooling 4m Air Throw Reach"],
  },
];

export const CATEGORIES = [
  { name: "Room ACs", sub: "Split / Window", icon: "mode_fan" },
  { name: "Refrigerators", sub: "Frost-Free & DC", icon: "kitchen" },
  { name: "LED Luminaires", sub: "Tubelights / Bulbs", icon: "lightbulb" },
  { name: "Solar Inverters", sub: "Grid-tied & Hybrid", icon: "solar_power" },
  { name: "Ceiling Fans", sub: "BLDC Technology", icon: "toys" },
  { name: "Water Heaters", sub: "Storage Geysers", icon: "water_heater" },
  { name: "Agri Pumps", sub: "Submersible / Mono", icon: "water_pump" },
  { name: "Transformers", sub: "Distribution", icon: "electric_meter" },
];
