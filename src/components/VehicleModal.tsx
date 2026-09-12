"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import {
  formatCurrency,
  formatMileage,
  generateWhatsAppLink,
  calculateFinancing,
  DEALERSHIP_INFO,
} from "@/lib/constants";
import {
  X,
  Gauge,
  Calendar,
  Fuel,
  Cog,
  Palette,
  ShieldCheck,
  CheckCircle,
  Calculator,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CarFront,
  Sparkles,
  Award,
  FileCheck,
  Phone
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenTestDriveForVehicle?: (vehicle: Vehicle) => void;
}

export default function VehicleModal({
  vehicle,
  onClose,
  onOpenTestDriveForVehicle,
}: VehicleModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Embedded Financing Simulator State
  const [entryAmount, setEntryAmount] = useState<number>(0);
  const [months, setMonths] = useState<number>(48);

  useEffect(() => {
    if (vehicle) {
      setSelectedPhotoIndex(0);
      const priceNum = parseFloat(vehicle.price) || 50000;
      // Default 30% down payment
      setEntryAmount(Math.round(priceNum * 0.3));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [vehicle]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, lightboxOpen]);

  if (!vehicle) return null;

  // Parse gallery and features
  let galleryImages: string[] = [];
  try {
    galleryImages = JSON.parse(vehicle.gallery || "[]");
    if (!galleryImages.length) galleryImages = [vehicle.coverImage];
  } catch {
    galleryImages = [vehicle.coverImage];
  }

  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(vehicle.features || "[]");
  } catch {
    featuresList = [];
  }

  const priceNum = parseFloat(vehicle.price);
  const fipeNum = vehicle.fipePrice ? parseFloat(vehicle.fipePrice) : null;
  const isBelowFipe = fipeNum && priceNum < fipeNum;
  const fipeSavings = fipeNum && priceNum < fipeNum ? fipeNum - priceNum : 0;

  const finCalc = calculateFinancing({
    carPrice: priceNum,
    entryAmount: entryAmount,
    months: months,
  });

  const whatsappMessage = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.yearFabrication}/${vehicle.yearModel}) anunciado por ${formatCurrency(vehicle.price)}. Gostaria de mais detalhes ou simular proposta.`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  const whatsappFinancingMessage = `Olá! Simulei o financiamento do ${vehicle.brand} ${vehicle.model} (${vehicle.yearFabrication}) por ${formatCurrency(vehicle.price)}. Entrada de ${formatCurrency(entryAmount)} + ${months}x de ~${formatCurrency(finCalc.monthlyPayment)}. Podemos analisar meu crédito?`;
  const whatsappFinancingUrl = generateWhatsAppLink(whatsappFinancingMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-[#0e1118] rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto z-10 flex flex-col border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 transition-colors">
        {/* Sticky Modal Header / Close */}
        <div className="sticky top-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#0e1118]/95 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800">
          <div>
            <span className="text-xs uppercase font-bold text-[#e30613] tracking-wider font-speed">
              {vehicle.brand} • {vehicle.yearFabrication}/{vehicle.yearModel}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-speed">
              {vehicle.brand} {vehicle.model}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Main Photo with Controls */}
              <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-md group">
                <img
                  src={galleryImages[selectedPhotoIndex] || vehicle.coverImage}
                  alt={`${vehicle.brand} ${vehicle.model} - foto ${selectedPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80";
                  }}
                />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {vehicle.badge && (
                    <span className="bg-[#e30613] text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {vehicle.badge}
                    </span>
                  )}
                  {vehicle.hasInspectionReport && (
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Laudo Aprovado
                    </span>
                  )}
                </div>

                {/* Lightbox Trigger */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                  title="Ampliar foto"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Arrow navigation if multiple images */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedPhotoIndex(
                          (selectedPhotoIndex - 1 + galleryImages.length) % galleryImages.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedPhotoIndex((selectedPhotoIndex + 1) % galleryImages.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedPhotoIndex === idx
                          ? "border-[#e30613] scale-105 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Laudo 100% Dekra/SuperVisão</span>
                </div>
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#e30613] shrink-0" />
                  <span>1 Ano Garantia Loja</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 text-xs font-semibold flex items-center gap-2 col-span-2 sm:col-span-1">
                  <FileCheck className="w-4 h-4 text-[#e30613] shrink-0" />
                  <span>IPVA 2026 Quitado</span>
                </div>
              </div>
            </div>

            {/* Information Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">{vehicle.version}</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-speed">
                    {formatCurrency(vehicle.price)}
                  </span>
                </div>

                {/* FIPE comparison notice */}
                {vehicle.fipePrice && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300 mb-4 bg-slate-50 dark:bg-[#141822] p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <span className="font-semibold text-slate-700 dark:text-zinc-200">Tabela FIPE:</span>
                    <span>{formatCurrency(vehicle.fipePrice)}</span>
                    {isBelowFipe && (
                      <span className="ml-auto font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                        Economia de {formatCurrency(fipeSavings)}
                      </span>
                    )}
                  </div>
                )}

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#141822] rounded-xl border border-slate-100 dark:border-zinc-800">
                    <Gauge className="w-4 h-4 text-[#e30613]" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Km Rodados</span>
                      <strong className="text-slate-900 dark:text-white font-speed">{formatMileage(vehicle.mileage)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#141822] rounded-xl border border-slate-100 dark:border-zinc-800">
                    <Calendar className="w-4 h-4 text-[#e30613]" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Ano Fab / Mod</span>
                      <strong className="text-slate-900 dark:text-white font-speed">{vehicle.yearFabrication} / {vehicle.yearModel}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#141822] rounded-xl border border-slate-100 dark:border-zinc-800">
                    <Cog className="w-4 h-4 text-[#e30613]" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Câmbio</span>
                      <strong className="text-slate-900 dark:text-white">{vehicle.transmission}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#141822] rounded-xl border border-slate-100 dark:border-zinc-800">
                    <Fuel className="w-4 h-4 text-[#e30613]" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Combustível</span>
                      <strong className="text-slate-900 dark:text-white">{vehicle.fuel}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#141822] rounded-xl border border-slate-100 dark:border-zinc-800">
                    <Palette className="w-4 h-4 text-[#e30613]" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Cor</span>
                      <strong className="text-slate-900 dark:text-white">{vehicle.color}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#141822] rounded-xl border border-slate-100 dark:border-zinc-800">
                    <CarFront className="w-4 h-4 text-[#e30613]" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Carroceria</span>
                      <strong className="text-slate-900 dark:text-white">{vehicle.bodyType} {vehicle.doors ? `• ${vehicle.doors}p` : ""}</strong>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="w-5 h-5 fill-white" />
                    Tenho Interesse / Chamar no WhatsApp
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTestDriveForVehicle?.(vehicle);
                      }}
                      className="w-full bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-speed tracking-wider uppercase"
                    >
                      <CalendarCheck className="w-4 h-4 text-[#e30613]" />
                      Agendar Test-Drive
                    </button>

                    <a
                      href={`tel:${DEALERSHIP_INFO.phoneFormatted}`}
                      className="w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 font-speed tracking-wider uppercase"
                    >
                      <Phone className="w-4 h-4 text-[#e30613]" />
                      Ligar para Loja
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features and Description Section */}
          <div className="border-t border-slate-200 dark:border-zinc-800 pt-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 font-speed uppercase tracking-wider">Sobre este Veículo</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-[#141822] p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
                {vehicle.description}
              </p>
            </div>

            {/* Features Checklist */}
            {featuresList.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 font-speed uppercase tracking-wider">
                  Itens de Série e Opcionais ({featuresList.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {featuresList.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#141822] border border-slate-100 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 font-medium"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded Interactive Financing Simulator for this specific car */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white">
                    Simulação de Financiamento para este {vehicle.model}
                  </h3>
                </div>
                <span className="text-xs bg-orange-500/20 text-orange-300 font-semibold px-2.5 py-1 rounded-full border border-orange-500/30">
                  Taxas a partir de 1,49% a.m.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Sliders Column */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                      <span>Valor de Entrada</span>
                      <span className="text-orange-400 font-bold">{formatCurrency(entryAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={priceNum * 0.8}
                      step={1000}
                      value={entryAmount}
                      onChange={(e) => setEntryAmount(parseFloat(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Sem Entrada (R$ 0)</span>
                      <span>50% ({formatCurrency(priceNum * 0.5)})</span>
                      <span>80% ({formatCurrency(priceNum * 0.8)})</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                      Número de Parcelas
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[12, 24, 36, 48, 60].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMonths(m)}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            months === m
                              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {m}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="md:col-span-5 bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl text-center space-y-2">
                  <span className="text-xs text-slate-400 uppercase font-semibold">
                    Parcela Estimada
                  </span>
                  <div className="text-3xl font-black text-emerald-400">
                    {months}x de {formatCurrency(finCalc.monthlyPayment)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Financiando {formatCurrency(finCalc.financedAmount)} com entrada de {formatCurrency(entryAmount)}
                  </p>

                  <a
                    href={whatsappFinancingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    Enviar Proposta de Financiamento
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={galleryImages[selectedPhotoIndex] || vehicle.coverImage}
            alt="Foto em alta resolução"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
