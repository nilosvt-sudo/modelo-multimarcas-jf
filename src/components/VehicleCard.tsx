"use client";

import React from "react";
import { Vehicle } from "@/types";
import { formatCurrency, formatMileage, generateWhatsAppLink } from "@/lib/constants";
import {
  Gauge,
  Calendar,
  Fuel,
  Cog,
  ShieldCheck,
  Heart,
  Scale,
  Award,
  ArrowUpRight,
  CarFront
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleCard({
  vehicle,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelect,
}: VehicleCardProps) {
  const priceNum = parseFloat(vehicle.price);
  const fipeNum = vehicle.fipePrice ? parseFloat(vehicle.fipePrice) : null;
  const isBelowFipe = fipeNum && priceNum < fipeNum;

  // Approximate 48x financing estimation (30% entry)
  const entry30 = priceNum * 0.3;
  const financed = priceNum - entry30;
  const estInstallment = Math.round((financed * 1.42) / 48);

  const whatsappMessage = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.yearFabrication}/${vehicle.yearModel}) anunciado por ${formatCurrency(vehicle.price)} na Apex Motors. Poderiam me passar mais informações?`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <SpotlightCard
      spotlightColor="rgba(0, 71, 204, 0.14)"
      className="bg-white dark:bg-[#0e1117] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#232a38] shadow-sm hover:border-[#0047cc]/50 dark:hover:border-[#0047cc]/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
      role="article"
      aria-label={`${vehicle.brand} ${vehicle.model}`}
    >
      {/* Image Container with Badges */}
      <div
        className="relative aspect-[16/10] bg-slate-100 dark:bg-[#151821] overflow-hidden cursor-pointer"
        onClick={() => onSelect(vehicle)}
      >
        <img
          src={vehicle.coverImage}
          alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Status / Feature Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
          {vehicle.badge && (
            <span className="bg-white/95 dark:bg-[#0e1117]/95 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-[#232a38] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
              {vehicle.badge}
            </span>
          )}
          {isBelowFipe && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Abaixo da FIPE
            </span>
          )}
          {vehicle.status === "reserved" && (
            <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Reservado
            </span>
          )}
          {vehicle.status === "sold" && (
            <span className="bg-slate-800 dark:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Vendido
            </span>
          )}
        </div>

        {/* Action icons on image top right (Heart + Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            aria-label={isFavorite ? "Remover dos favoritos" : "Salvar veículo"}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
              isFavorite
                ? "bg-rose-500 border-rose-500 text-white scale-110"
                : "bg-white/80 dark:bg-black/60 border-white/60 dark:border-white/20 text-slate-700 dark:text-white hover:text-rose-500 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(vehicle);
            }}
            aria-label={isCompared ? "Remover da comparação" : "Comparar veículo"}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
              isCompared
                ? "bg-[#0047cc] border-[#0047cc] text-white scale-110"
                : "bg-white/80 dark:bg-black/60 border-white/60 dark:border-white/20 text-slate-700 dark:text-white hover:text-[#0047cc] hover:bg-white"
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white text-xs font-semibold flex items-center gap-1">
            Ver detalhes completos <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand and Year */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-[#0047cc] dark:text-[#3b82f6] tracking-wider uppercase">
              {vehicle.brand}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {vehicle.yearFabrication}/{vehicle.yearModel}
            </span>
          </div>

          {/* Model Title */}
          <h3
            onClick={() => onSelect(vehicle)}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0047cc] dark:group-hover:text-[#3b82f6] transition-colors line-clamp-1 cursor-pointer"
          >
            {vehicle.model}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {vehicle.version}
          </p>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-[#232a38] text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 truncate">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{formatMileage(vehicle.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Cog className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Laudo 100% OK</span>
            </div>
          </div>
        </div>

        {/* Pricing / Financing Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#232a38] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Valor à Vista
              </span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {formatCurrency(vehicle.price)}
              </span>
            </div>
            {estInstallment > 0 && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-medium text-slate-400 block">
                  Simulação 48x
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(estInstallment)}/mês
                </span>
              </div>
            )}
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onSelect(vehicle)}
              className="w-full py-2 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#161a22] dark:hover:bg-[#1f2430] border border-slate-200 dark:border-[#232a38] rounded-xl transition-colors cursor-pointer text-center"
            >
              Ver Detalhes
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>Negociar</span>
            </a>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
