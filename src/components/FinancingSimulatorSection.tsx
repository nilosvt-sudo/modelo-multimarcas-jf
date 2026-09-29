"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types";
import {
  formatCurrency,
  PARTNER_BANKS,
  calculateInstallment,
  generateWhatsAppLink
} from "@/lib/constants";
import {
  Calculator,
  CheckCircle2,
  ShieldCheck,
  Send,
  Building2,
  Percent,
  Calendar,
  X,
  Car
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
  // Vehicle Selection or Custom Amount
  const [vehicleId, setVehicleId] = useState<number | "custom">(
    selectedVehicle?.id || (vehicles.length > 0 ? vehicles[0].id : "custom")
  );
  
  const currentVehicle = vehicles.find((v) => v.id === vehicleId);
  const basePrice = currentVehicle
    ? (typeof currentVehicle.price === "number" ? currentVehicle.price : parseFloat(currentVehicle.price || "0"))
    : 100000;

  const [vehicleValue, setVehicleValue] = useState<number>(basePrice);
  const [entryPercent, setEntryPercent] = useState<number>(30);
  const [installments, setInstallments] = useState<number>(48);
  const [selectedBank, setSelectedBank] = useState<string>(PARTNER_BANKS[0].name);

  // Form lead submission
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consentLGPD, setConsentLGPD] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculations
  const activeBank = PARTNER_BANKS.find((b) => b.name === selectedBank) || PARTNER_BANKS[0];
  const entryAmount = (vehicleValue * entryPercent) / 100;
  const financedAmount = Math.max(0, vehicleValue - entryAmount);
  const monthlyRate = activeBank.rate;
  const monthlyPayment = calculateInstallment(financedAmount, monthlyRate, installments);
  const totalFinanced = monthlyPayment * installments + entryAmount;

  // Handle vehicle change
  const handleSelectVehicle = (val: string) => {
    if (val === "custom") {
      setVehicleId("custom");
    } else {
      const id = parseInt(val, 10);
      setVehicleId(id);
      const v = vehicles.find((item) => item.id === id);
      if (v) {
        setVehicleValue(typeof v.price === "number" ? v.price : parseFloat(v.price || "0"));
      }
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !consentLGPD) return;

    setSubmitting(true);
    try {
      const vehicleTitle = currentVehicle
        ? `${currentVehicle.brand} ${currentVehicle.model} ${currentVehicle.version}`
        : `Valor Customizado: ${formatCurrency(vehicleValue)}`;

      const payload = {
        vehicleId: typeof vehicleId === "number" ? vehicleId : null,
        vehicleName: vehicleTitle,
        name,
        phone,
        email,
        leadType: "financing",
        entryAmount,
        installments,
        message: `Simulação via ${selectedBank}: Entrada ${formatCurrency(entryAmount)} (${entryPercent}%) + ${installments}x de ${formatCurrency(monthlyPayment)}. CPF: ${cpf || "Não informado"}`,
        notes: `Observações: ${notes || "Nenhuma"} | Consentimento LGPD: Sim`,
      };

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Erro ao enviar proposta de financiamento:", err);
      alert("Ocorreu um erro ao enviar sua simulação. Por favor, tente pelo WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentVehicleTitle = currentVehicle
    ? `${currentVehicle.brand} ${currentVehicle.model}`
    : `Veículo de ${formatCurrency(vehicleValue)}`;

  const whatsappMessage = `Olá! Fiz uma simulação de financiamento no site da Apex Motors para o ${currentVehicleTitle}. Entrada de ${formatCurrency(entryAmount)} + ${installments}x de ${formatCurrency(monthlyPayment)} pelo ${selectedBank}. Gostaria de aprovar meu crédito!`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  const content = (
    <div className="bg-white dark:bg-[#10131a] rounded-3xl border border-slate-200 dark:border-[#232a38] shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Financiamento Automotivo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Simule seu Financiamento em Segundos
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Taxas especiais a partir de 1,29% a.m. com aprovação rápida através dos maiores bancos do Brasil.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10 grid lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Escolha do Carro */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              1. Selecione o Veículo do Estoque
            </label>
            <div className="relative">
              <select
                value={vehicleId}
                onChange={(e) => handleSelectVehicle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500 transition-colors"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} {v.version} ({v.yearFabrication}/{v.yearModel}) - {formatCurrency(v.price)}
                  </option>
                ))}
                <option value="custom">Outro Valor (Personalizado)</option>
              </select>
            </div>
          </div>

          {/* Valor Customizado se selecionado */}
          {vehicleId === "custom" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Valor Total do Veículo
              </label>
              <input
                type="number"
                min={20000}
                max={2000000}
                step={5000}
                value={vehicleValue}
                onChange={(e) => setVehicleValue(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Entrada */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Valor da Entrada ({entryPercent}%)
              </label>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(entryAmount)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={entryPercent}
              onChange={(e) => setEntryPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>10% ({formatCurrency(vehicleValue * 0.1)})</span>
              <span>30%</span>
              <span>50%</span>
              <span>80% ({formatCurrency(vehicleValue * 0.8)})</span>
            </div>
          </div>

          {/* Prazo de Parcelamento */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              3. Número de Parcelas
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[12, 24, 36, 48, 60].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setInstallments(months)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    installments === months
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]"
                      : "bg-slate-50 dark:bg-[#161a22] border-slate-200 dark:border-[#232a38] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {months}x
                </button>
              ))}
            </div>
          </div>

          {/* Banco Parceiro */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              4. Banco Parceiro & Taxa Estimada
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PARTNER_BANKS.map((bank) => (
                <button
                  key={bank.name}
                  type="button"
                  onClick={() => setSelectedBank(bank.name)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    selectedBank === bank.name
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 font-bold"
                      : "bg-slate-50 dark:bg-[#161a22] border-slate-200 dark:border-[#232a38] text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="text-xs font-bold truncate">{bank.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{(bank.rate * 100).toFixed(2)}% a.m.</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resumo da Parcela */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Valor Estimado da Parcela
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {installments}x de {formatCurrency(monthlyPayment)}
                </div>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                <Car className="w-6 h-6 text-blue-300" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Entrada ({entryPercent}%):</span>
                <span className="font-bold text-white">{formatCurrency(entryAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Saldo Financiado:</span>
                <span className="font-bold text-white">{formatCurrency(financedAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Capture Form */}
        <div className="lg:col-span-6 bg-slate-50 dark:bg-[#141720] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#232a38]">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Proposta Enviada com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Nosso time de consultores de crédito da Apex Motors já recebeu sua simulação e entrará em contato com a melhor condição aprovada.
              </p>
              <div className="pt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Acelerar Aprovação no WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Envie sua Proposta para Aprovação
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Preencha seus dados para consultar o score e garantir esta taxa especial com nossos bancos conveniados.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CPF (para consulta bancária)
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  placeholder="carlos@exemplo.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tem veículo para dar na troca? Detalhes adicionais:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tenho um HB20 2020 para dar de entrada..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="lgpd_simulador"
                  required
                  checked={consentLGPD}
                  onChange={(e) => setConsentLGPD(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="lgpd_simulador" className="text-[11px] text-slate-500 dark:text-slate-400">
                  Concordo em fornecer meus dados para consulta de financiamento na Apex Motors conforme a LGPD.
                </label>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting || !consentLGPD}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Enviando..." : "Solicitar Aprovação Imediata"}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  // If used as modal
  if (isOpen !== undefined) {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl my-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-black/80 rounded-full text-slate-700 dark:text-white hover:bg-white shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  // If rendered inline on the page
  return (
    <section id="financiamento" className="py-12 sm:py-16 bg-slate-50 dark:bg-[#0c0e14] transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {content}
      </div>
    </section>
  );
}
