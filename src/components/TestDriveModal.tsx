"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import { generateWhatsAppLink, DEALERSHIP_INFO } from "@/lib/constants";
import {
  CalendarCheck,
  MapPin,
  Clock,
  CarFront,
  CheckCircle2,
  X,
  Send,
  Building2,
  Home
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface TestDriveModalProps {
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle?: Vehicle | null;
}

export default function TestDriveModal({
  vehicles,
  isOpen,
  onClose,
  selectedVehicle = null,
}: TestDriveModalProps) {
  const [vehicleId, setVehicleId] = useState<string>(
    selectedVehicle ? String(selectedVehicle.id) : ""
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("14:00");
  const [locationPreference, setLocationPreference] = useState<"dealership" | "home_delivery">("dealership");
  const [notes, setNotes] = useState("");
  const [consentLGPD, setConsentLGPD] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedVehicle) {
      setVehicleId(String(selectedVehicle.id));
    }
  }, [selectedVehicle]);

  // Set default min date to tomorrow
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  const currentVehicleObj = vehicles.find((v) => v.id === parseInt(vehicleId, 10)) || selectedVehicle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !preferredDate || !preferredTime || !consentLGPD) return;

    setSubmitting(true);
    try {
      const payload = {
        vehicleId: currentVehicleObj ? currentVehicleObj.id : null,
        vehicleName: currentVehicleObj
          ? `${currentVehicleObj.brand} ${currentVehicleObj.model} (${currentVehicleObj.yearFabrication})`
          : "Veículo a confirmar",
        customerName,
        customerPhone,
        customerEmail,
        preferredDate,
        preferredTime,
        locationPreference,
        notes,
      };

      await fetch("/api/test-drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error scheduling test drive:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Olá! Gostaria de agendar um Test-Drive na Modelo Multimarcas JF.
- Carro: ${currentVehicleObj ? `${currentVehicleObj.brand} ${currentVehicleObj.model} (${currentVehicleObj.yearFabrication})` : "A combinar"}
- Data: ${preferredDate} às ${preferredTime}
- Local: ${locationPreference === "dealership" ? "Na Loja (Av. Rio Branco, JF)" : "Test Drive VIP em Domicílio (JF)"}
- Nome: ${customerName || "Cliente"}
- Telefone: ${customerPhone}`;

  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#0e1118] rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 text-slate-900 dark:text-zinc-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#e30613] flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-speed">Agendar Test-Drive</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Experimente o carro na prática em Juiz de Fora
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-speed uppercase">Test-Drive Solicitado!</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Recebemos seu pedido de agendamento para o <strong className="text-slate-900 dark:text-white">{currentVehicleObj?.brand} {currentVehicleObj?.model}</strong> no dia <strong className="text-slate-900 dark:text-white">{preferredDate}</strong> às <strong className="text-slate-900 dark:text-white">{preferredTime}</strong>. Nossa equipe vai confirmar o horário pelo WhatsApp.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              Confirmar Imediatamente no WhatsApp
            </a>
            <button
              onClick={onClose}
              className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:underline block mx-auto cursor-pointer"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 font-speed uppercase tracking-wider">
                Veículo Escolhido *
              </label>
              <select
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#e30613] transition-colors"
              >
                <option value="" className="bg-white dark:bg-[#161a24]">Selecione um veículo do estoque</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white dark:bg-[#161a24]">
                    {v.brand} {v.model} {v.version} ({v.yearFabrication})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 font-speed uppercase tracking-wider">
                  Data Preferida *
                </label>
                <input
                  type="date"
                  required
                  min={getTomorrowDateString()}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 font-speed uppercase tracking-wider">
                  Horário Preferido *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613] transition-colors"
                >
                  <option value="09:00" className="bg-white dark:bg-[#161a24]">09:00 (Manhã)</option>
                  <option value="10:30" className="bg-white dark:bg-[#161a24]">10:30 (Manhã)</option>
                  <option value="14:00" className="bg-white dark:bg-[#161a24]">14:00 (Tarde)</option>
                  <option value="15:30" className="bg-white dark:bg-[#161a24]">15:30 (Tarde)</option>
                  <option value="17:00" className="bg-white dark:bg-[#161a24]">17:00 (Final da tarde)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-speed uppercase tracking-wider">
                Local do Test-Drive
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLocationPreference("dealership")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center gap-2 cursor-pointer transition-colors ${
                    locationPreference === "dealership"
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-sm"
                      : "bg-slate-50 dark:bg-[#161a24] text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-white" />
                  <div>
                    <span className="block font-bold">Na Loja JF</span>
                    <span className="text-[10px] opacity-85">Av. Rio Branco</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationPreference("home_delivery")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center gap-2 cursor-pointer transition-colors ${
                    locationPreference === "home_delivery"
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-sm"
                      : "bg-slate-50 dark:bg-[#161a24] text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Home className="w-4 h-4 text-white" />
                  <div>
                    <span className="block font-bold">Em Domicílio</span>
                    <span className="text-[10px] opacity-85">Levamos até você</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 font-speed uppercase tracking-wider">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Mariana Castro"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 font-speed uppercase tracking-wider">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(32) 99999-9999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 font-speed uppercase tracking-wider">
                  E-mail (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 font-speed uppercase tracking-wider">
                Observações ou endereço para teste em domicílio
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Gostaria de testar subidas no bairro São Mateus..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#e30613] transition-colors resize-none"
              />
            </div>

            {/* LGPD Consent Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="consent-testdrive-lgpd"
                type="checkbox"
                required
                checked={consentLGPD}
                onChange={(e) => setConsentLGPD(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-white dark:bg-[#161a24] border-slate-300 dark:border-zinc-700 text-[#e30613] focus:ring-[#e30613] cursor-pointer shrink-0"
              />
              <label htmlFor="consent-testdrive-lgpd" className="text-[11px] text-slate-500 dark:text-zinc-400 cursor-pointer select-none leading-relaxed">
                Concordo com o tratamento dos meus dados para agendamento de test-drive e contato comercial pela Modelo Multimarcas JF, nos termos da Lei Geral de Proteção de Dados (LGPD).
              </label>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={submitting || !consentLGPD}
                className="w-full bg-[#e30613] hover:bg-[#c40510] disabled:opacity-50 text-white font-speed font-bold uppercase tracking-wider py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Confirmando..." : "Confirmar Agendamento de Test-Drive"}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                Agendar Imediatamente via WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
