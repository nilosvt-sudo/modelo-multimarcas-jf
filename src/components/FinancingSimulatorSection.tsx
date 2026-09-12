"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types";
import {
  formatCurrency,
  calculateFinancing,
  PARTNER_BANKS,
  generateWhatsAppLink
} from "@/lib/constants";
import {
  Calculator,
  Percent,
  CheckCircle2,
  ShieldCheck,
  Send,
  Sparkles,
  Building2,
  X
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface FinancingSimulatorSectionProps {
  vehicles: Vehicle[];
  isOpen?: boolean;
  onClose?: () => void;
  selectedVehicle?: Vehicle | null;
}

export default function FinancingSimulatorSection({
  vehicles,
  isOpen,
  onClose,
  selectedVehicle = null,
}: FinancingSimulatorSectionProps) {
  const [targetCarPrice, setTargetCarPrice] = useState<number>(
    selectedVehicle ? parseFloat(selectedVehicle.price) : 75000
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    selectedVehicle ? String(selectedVehicle.id) : ""
  );
  const [entryAmount, setEntryAmount] = useState<number>(20000);
  const [months, setMonths] = useState<number>(48);

  // Form lead submission
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [hasCnh, setHasCnh] = useState("sim");
  const [consentLGPD, setConsentLGPD] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCarSelectChange = (idStr: string) => {
    setSelectedVehicleId(idStr);
    if (idStr) {
      const v = vehicles.find((car) => car.id === parseInt(idStr, 10));
      if (v) {
        const p = parseFloat(v.price);
        setTargetCarPrice(p);
        setEntryAmount(Math.round(p * 0.25));
      }
    }
  };

  const finCalc = calculateFinancing({
    carPrice: targetCarPrice,
    entryAmount: entryAmount,
    months: months,
  });

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !consentLGPD) return;

    setSubmitting(true);
    try {
      const selectedCarObj = vehicles.find((v) => v.id === parseInt(selectedVehicleId, 10));
      const payload = {
        vehicleId: selectedCarObj ? selectedCarObj.id : null,
        vehicleName: selectedCarObj
          ? `${selectedCarObj.brand} ${selectedCarObj.model} (${selectedCarObj.yearFabrication})`
          : `Simulação personalizada: ${formatCurrency(targetCarPrice)}`,
        name,
        phone,
        email,
        leadType: "financing",
        entryAmount: entryAmount,
        installments: months,
        message: `Simulação: Carro ${formatCurrency(targetCarPrice)} | Entrada: ${formatCurrency(entryAmount)} em ${months}x.`,
        notes: `CPF: ${cpf || "Não informado"} | Nascimento: ${birthDate || "Não informado"} | Possui CNH: ${hasCnh} | Consentimento LGPD: Sim`,
      };

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting financing lead:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Olá! Gostaria de uma aprovação de crédito na Modelo Multimarcas JF.
Simulação:
- Valor do Veículo: ${formatCurrency(targetCarPrice)}
- Entrada: ${formatCurrency(entryAmount)}
- Prazo: ${months}x de ${formatCurrency(finCalc.monthlyPayment)}
- Nome: ${name || "Cliente"}
- Telefone: ${phone || "Não informado"}`;

  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  const content = (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#222834] pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Simulador de Financiamento
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulação estimada com os principais bancos parceiros (BV, Santander, Itaú, Bradesco, PAN) com aprovação ágil.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#181d26] hover:bg-[#232a38] text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders & Car Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pick from inventory dropdown or custom price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Escolha um veículo do estoque ou personalize o valor
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => handleCarSelectChange(e.target.value)}
              className="w-full bg-[#181d26] border border-[#2b3342] text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] mb-2"
            >
              <option value="">Simulação Livre (Personalizar Valor)</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} {v.version} ({v.yearFabrication}) - {formatCurrency(v.price)}
                </option>
              ))}
            </select>

            {!selectedVehicleId && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Valor do Carro</span>
                  <span className="text-white font-bold text-sm tabular-nums">
                    {formatCurrency(targetCarPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={250000}
                  step={2000}
                  value={targetCarPrice}
                  onChange={(e) => setTargetCarPrice(parseFloat(e.target.value))}
                  className="w-full accent-[#e30613] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Down Payment Slider with Interactive Presets and Generous Spacing */}
          <div className="bg-[#121620] border border-[#242c3c] rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-baseline text-xs font-semibold text-slate-300">
              <span className="uppercase tracking-wider font-speed text-white">Valor da Entrada</span>
              <span className="text-white font-black text-base sm:text-lg tabular-nums font-speed text-[#e30613]">
                {formatCurrency(entryAmount)}
              </span>
            </div>
            
            <div className="py-2">
              <input
                type="range"
                min={0}
                max={targetCarPrice * 0.8}
                step={1000}
                value={entryAmount}
                onChange={(e) => setEntryAmount(parseFloat(e.target.value))}
                className="w-full accent-[#e30613] cursor-pointer h-2 bg-[#1d2332] rounded-lg appearance-none"
              />
            </div>

            {/* Interactive Down Payment Quick Presets */}
            <div className="pt-2 border-t border-[#1f2736]">
              <span className="text-[11px] text-slate-400 font-medium block mb-2 font-speed uppercase tracking-wider">
                Atalhos Rápidos de Entrada:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setEntryAmount(0)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    entryAmount === 0
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-sm"
                      : "bg-[#181d28] text-slate-300 border-[#2d374a] hover:bg-[#222a3a] hover:text-white"
                  }`}
                >
                  Sem Entrada (R$ 0)
                </button>
                <button
                  type="button"
                  onClick={() => setEntryAmount(Math.round(targetCarPrice * 0.2))}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    Math.abs(entryAmount - targetCarPrice * 0.2) < 500
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-sm"
                      : "bg-[#181d28] text-slate-300 border-[#2d374a] hover:bg-[#222a3a] hover:text-white"
                  }`}
                >
                  20% ({formatCurrency(targetCarPrice * 0.2)})
                </button>
                <button
                  type="button"
                  onClick={() => setEntryAmount(Math.round(targetCarPrice * 0.3))}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    Math.abs(entryAmount - targetCarPrice * 0.3) < 500
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-sm"
                      : "bg-[#181d28] text-slate-300 border-[#2d374a] hover:bg-[#222a3a] hover:text-white"
                  }`}
                >
                  30% ({formatCurrency(targetCarPrice * 0.3)})
                </button>
                <button
                  type="button"
                  onClick={() => setEntryAmount(Math.round(targetCarPrice * 0.5))}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    Math.abs(entryAmount - targetCarPrice * 0.5) < 500
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-sm"
                      : "bg-[#181d28] text-slate-300 border-[#2d374a] hover:bg-[#222a3a] hover:text-white"
                  }`}
                >
                  50% ({formatCurrency(targetCarPrice * 0.5)})
                </button>
              </div>
            </div>
          </div>

          {/* Installment Term Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Prazo de Pagamento
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[12, 24, 36, 48, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    months === m
                      ? "bg-[#e30613] text-white shadow-md scale-105"
                      : "bg-[#181d26] text-slate-300 border border-[#2b3342] hover:bg-[#222936] hover:text-white"
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-[#181d26] rounded-xl p-5 border border-[#2b3342]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">
                  Valor Financiado
                </span>
                <span className="text-base sm:text-lg font-bold text-white tabular-nums">
                  {formatCurrency(finCalc.financedAmount)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">
                  Prazo
                </span>
                <span className="text-base sm:text-lg font-bold text-white">{months} meses</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-emerald-950/40 border border-emerald-700/50 rounded-lg p-2.5">
                <span className="text-[10px] text-emerald-300 block uppercase font-bold tracking-wider">
                  Parcela Estimada
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400 tabular-nums">
                  {formatCurrency(finCalc.monthlyPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Partner Banks Row */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Bancos Parceiros com Aprovação Imediata:
            </span>
            <div className="flex flex-wrap gap-2">
              {PARTNER_BANKS.map((b) => (
                <span
                  key={b.name}
                  className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded-md"
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950/60 rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col justify-between">
          {submitted ? (
            <div className="text-center py-8 space-y-4 my-auto">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Proposta Enviada com Sucesso!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nossos consultores da loja Modelo Multimarcas JF receberam sua simulação e vão entrar em contato pelo WhatsApp com a análise dos bancos.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                Agilizar Análise no WhatsApp
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-slate-400 hover:text-white underline block mx-auto cursor-pointer"
              >
                Fazer nova simulação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <h3 className="text-white font-bold text-base tracking-tight font-speed uppercase">
                  Falar com Consultor sobre Financiamento
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Envie sua simulação estimada para receber um atendimento personalizado da Modelo Multimarcas JF junto aos bancos parceiros (BV, Santander, Itaú, Bradesco, PAN).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181d26] border border-[#2b3342] text-white rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(32) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#181d26] border border-[#2b3342] text-white rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    CPF (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full bg-[#181d26] border border-[#2b3342] text-white rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-[#181d26] border border-[#2b3342] text-white rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    E-mail (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#181d26] border border-[#2b3342] text-white rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Possui CNH?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasCnh("sim")}
                    className={`py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                      hasCnh === "sim"
                        ? "bg-[#e30613] border-[#e30613] text-white"
                        : "bg-[#181d26] border-[#2b3342] text-slate-300 hover:bg-[#222936]"
                    }`}
                  >
                    Sim, CNH Ativa
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasCnh("nao")}
                    className={`py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                      hasCnh === "nao"
                        ? "bg-[#e30613] border-[#e30613] text-white"
                        : "bg-[#181d26] border-[#2b3342] text-slate-300 hover:bg-[#222936]"
                    }`}
                  >
                    Não possuo
                  </button>
                </div>
              </div>

              {/* LGPD Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="consent-financing-lgpd"
                  type="checkbox"
                  required
                  checked={consentLGPD}
                  onChange={(e) => setConsentLGPD(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-[#181d26] text-[#e30613] focus:ring-[#e30613] cursor-pointer shrink-0"
                />
                <label htmlFor="consent-financing-lgpd" className="text-[11px] text-slate-400 cursor-pointer select-none leading-relaxed">
                  Concordo com o tratamento dos meus dados para fins de simulação e contato comercial pela Modelo Multimarcas JF, nos termos da Lei Geral de Proteção de Dados (LGPD).
                </label>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={submitting || !consentLGPD}
                  className="w-full bg-[#e30613] hover:bg-[#c40510] disabled:opacity-50 text-white font-speed font-bold uppercase tracking-wider py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Enviando Simulação..." : "Falar com Consultor sobre Financiamento"}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  Simular Direto com Consultor no WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative max-w-5xl w-full max-h-[92vh] overflow-y-auto z-10">
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="financiamento" className="py-12 bg-slate-950 text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">{content}</div>
    </section>
  );
}
