export const DEALERSHIP_INFO = {
  name: "Apex Motors",
  subtitle: "Seminovos Premium & Selecionados",
  tagline: "Qualidade, transparência e procedência garantida para você sair de carro novo hoje.",
  cnpj: "12.345.678/0001-90",
  phone: "(11) 3333-4444",
  phoneFormatted: "+551133334444",
  phoneLandline: "(11) 3333-4444",
  phoneWhatsapp: "(11) 99999-8888",
  whatsappNumber: "5511999998888",
  email: "contato@apexmotors.com.br",
  address: {
    street: "Av. das Nações Unidas",
    number: "12901",
    neighborhood: "Brooklin Novo",
    city: "São Paulo",
    state: "SP",
    zip: "04578-000",
    full: "Av. das Nações Unidas, 12901 - Brooklin Novo, São Paulo - SP",
  },
  neighborhood: "Brooklin Novo",
  city: "São Paulo",
  state: "SP",
  cep: "04578-000",
  instagram: "https://instagram.com",
  instagramHandle: "@apexmotors.oficial",
  facebook: "https://facebook.com",
  hours: {
    weekdays: "Segunda a Sexta: 08:30 às 19:00",
    saturday: "Sábado: 08:30 às 17:00",
    sunday: "Domingo: Plantão Online via WhatsApp",
  },
  workingHoursWeek: "Segunda a Sexta: 08:30 às 19:00",
  workingHoursSaturday: "Sábado: 08:30 às 17:00",
  workingHoursSunday: "Domingo: Plantão Online via WhatsApp",
  googleRating: 4.9,
  googleReviewCount: 194,
  yearsInMarket: 14,
  soldCarsCount: "5.200+",
  proceduresCount: "5.200+",
};

export const COMMON_BRANDS = [
  "Toyota",
  "Honda",
  "Jeep",
  "Volkswagen",
  "Chevrolet",
  "BMW",
  "Audi",
  "Fiat",
  "Hyundai",
  "Ford",
  "Nissan",
  "Renault",
  "Mercedes-Benz",
  "Volvo",
  "Porsche"
];

export const BODY_TYPES = [
  "SUV",
  "Sedan",
  "Hatch",
  "Picape",
  "Cupê",
  "Elétrico / Híbrido"
];

export const TRANSMISSION_TYPES = [
  "Automático",
  "Manual",
  "CVT",
  "Automatizado Dupla Embreagem"
];

export const FUEL_TYPES = [
  "Flex",
  "Gasolina",
  "Híbrido",
  "Elétrico",
  "Diesel"
];

export const COMMON_FEATURES_LIST = [
  "Laudo Cautelar 100% Aprovado",
  "Garantia de 1 Ano (Motor e Câmbio)",
  "Central Multimídia com Apple CarPlay & Android Auto",
  "Câmera de Ré e Sensores de Estacionamento",
  "Bancos em Couro",
  "Teto Solar Panorâmico",
  "Chave Presencial (Keyless) & Start/Stop",
  "Faróis Full LED",
  "Rodas de Liga Leve",
  "Piloto Automático Adaptativo (ACC)",
  "Ar-condicionado Digital Dual Zone",
  "Direção Elétrica Progressiva",
  "Assistente de Permanência em Faixa",
  "Carregador de Celular por Indução",
  "Freios ABS com EBD e Controle de Estabilidade (ESP)"
];

export const PARTNER_BANKS = [
  { name: "Banco Santander", logo: "Santander Auto", rate: 0.0129 },
  { name: "BV Financeira", logo: "BV Financiamentos", rate: 0.0135 },
  { name: "Banco Itaú", logo: "Itaú Veículos", rate: 0.0139 },
  { name: "Banco Bradesco", logo: "Bradesco Financiamentos", rate: 0.0142 },
  { name: "Banco PAN", logo: "Banco PAN", rate: 0.0149 },
  { name: "Porto Seguro Financiamento", logo: "Porto Bank", rate: 0.0132 },
  { name: "Banco Safra", logo: "Safra Financeira", rate: 0.0125 }
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

export function calculateInstallment(financedAmount: number, monthlyRate: number, installments: number): number {
  if (financedAmount <= 0 || installments <= 0) return 0;
  const i = monthlyRate || 0.0139;
  const n = installments;
  return Math.round((financedAmount * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1));
}

export function calculateFinancing({
  carPrice,
  entryAmount,
  months,
  monthlyInterestRate = 0.0139 // 1.39% per month average
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
      totalInterest: 0,
    };
  }

  // Price calculation with compound interest (Tabela Price)
  const i = monthlyInterestRate;
  const n = months;
  const monthlyPayment = Math.round(
    (financedAmount * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1)
  );
  const totalPaid = entryAmount + monthlyPayment * n;
  const totalInterest = totalPaid - carPrice;

  return {
    financedAmount,
    monthlyPayment,
    totalPaid,
    totalInterest,
  };
}
