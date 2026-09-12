export const DEALERSHIP_INFO = {
  name: "Modelo Multimarcas JF",
  subtitle: "Seminovos em Juiz de Fora",
  tagline: "Qualidade, transparência e procedência garantida para você sair de carro novo hoje.",
  phone: "(32) 3212-5705",
  phoneFormatted: "+553232125705",
  phoneLandline: "(32) 3212-5705",
  whatsappNumber: "553232125705",
  email: "contato@modelomultimarcasjf.com.br",
  address: "Av. Barão do Rio Branco, 4200 - Passos",
  neighborhood: "Passos / Bom Pastor",
  city: "Juiz de Fora",
  state: "MG",
  cep: "36025-005",
  instagram: "https://www.instagram.com/modelomultimarcasjf/?hl=pt-br",
  instagramHandle: "@modelomultimarcasjf",
  facebook: "https://www.facebook.com/www.modelomultimarcasjf.com.br/",
  workingHoursWeek: "Segunda a Sexta: 08:30 às 18:30",
  workingHoursSaturday: "Sábado: 08:30 às 13:00",
  workingHoursSunday: "Domingo: Plantão Online via WhatsApp",
  googleRating: 4.9,
  googleReviewCount: 184,
  yearsInMarket: 14,
  soldCarsCount: "4.800+",
};

export const COMMON_BRANDS = [
  "Fiat",
  "Volkswagen",
  "Chevrolet",
  "Toyota",
  "Honda",
  "Jeep",
  "Hyundai",
  "Renault",
  "Ford",
  "Nissan",
  "BMW",
  "Audi",
  "Mercedes-Benz",
  "Peugeot",
  "Citroën",
  "Caoa Chery",
  "Mitsubishi"
];

export const BODY_TYPES = [
  "Hatch",
  "Sedan",
  "SUV",
  "Picape",
  "Cupê",
  "Perua"
];

export const TRANSMISSION_TYPES = [
  "Automático",
  "Manual",
  "CVT",
  "Automatizado"
];

export const FUEL_TYPES = [
  "Flex",
  "Gasolina",
  "Diesel",
  "Híbrido",
  "Elétrico"
];

export const COMMON_FEATURES_LIST = [
  "Ar-condicionado",
  "Ar-condicionado digital",
  "Direção elétrica",
  "Direção hidráulica",
  "Vidros elétricos",
  "Travas elétricas",
  "Alarme",
  "Central Multimídia",
  "Apple CarPlay e Android Auto",
  "Câmera de ré",
  "Sensor de estacionamento",
  "Bancos em couro",
  "Teto solar",
  "Teto panorâmico",
  "Rodas de liga leve",
  "Faróis Full LED",
  "Faróis de neblina",
  "Piloto automático (Cruise Control)",
  "Piloto automático adaptativo (ACC)",
  "Chave presencial (Keyless)",
  "Partida por botão Start/Stop",
  "Computador de bordo",
  "Volante multifuncional",
  "Freios ABS",
  "Airbags frontais e laterais",
  "Controle de estabilidade (ESP)",
  "Assistente de partida em rampa (HSA)",
  "Carregador por indução",
  "Retrovisores elétricos",
  "Sensor crepuscular (faróis automáticos)",
  "Sensor de chuva"
];

export const PARTNER_BANKS = [
  { name: "Banco Santander", logo: "Santander Auto" },
  { name: "BV Financeira", logo: "BV Financiamentos" },
  { name: "Banco Itaú", logo: "Itaú Veículos" },
  { name: "Banco Bradesco", logo: "Bradesco Financiamentos" },
  { name: "Banco PAN", logo: "Banco PAN" },
  { name: "Porto Seguro Financiamento", logo: "Porto Bank" },
  { name: "Banco Safra", logo: "Safra Financeira" }
];

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "R$ 0,00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatMileage(km: number | string | null | undefined): string {
  if (km === null || km === undefined || km === "") return "0 km";
  const num = typeof km === "string" ? parseInt(km, 10) : km;
  if (isNaN(num)) return "0 km";
  return `${num.toLocaleString("pt-BR")} km`;
}

export function generateWhatsAppLink(message: string, customPhone?: string): string {
  const phone = customPhone || DEALERSHIP_INFO.whatsappNumber;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function calculateFinancing({
  carPrice,
  entryAmount,
  months,
  monthlyInterestRate = 0.0149 // 1.49% per month average
}: {
  carPrice: number;
  entryAmount: number;
  months: number;
  monthlyInterestRate?: number;
}) {
  const financedAmount = Math.max(0, carPrice - entryAmount);
  if (financedAmount <= 0) {
    return {
      financedAmount: 0,
      monthlyPayment: 0,
      totalPaid: entryAmount,
      totalInterest: 0
    };
  }

  // Amortization PMT formula: PMT = PV * (i * (1+i)^n) / ((1+i)^n - 1)
  const i = monthlyInterestRate;
  const n = months;
  const pmt = financedAmount * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const totalPaid = (pmt * n) + entryAmount;
  const totalInterest = (pmt * n) - financedAmount;

  return {
    financedAmount,
    monthlyPayment: Math.round(pmt),
    totalPaid: Math.round(totalPaid),
    totalInterest: Math.round(totalInterest)
  };
}
