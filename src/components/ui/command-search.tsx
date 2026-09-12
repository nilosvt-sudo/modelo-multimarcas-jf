"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Car, ArrowRight, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/constants";
import { Vehicle } from "@/types";

interface CommandSearchProps {
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export function CommandSearch({
  vehicles,
  isOpen,
  onClose,
  onSelectVehicle,
}: CommandSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled externally if listener is attached, but let's toggle if needed
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredVehicles = searchQuery.trim() === ""
    ? vehicles.slice(0, 6)
    : vehicles.filter((v) => {
        const query = searchQuery.toLowerCase();
        return (
          v.brand.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.version.toLowerCase().includes(query) ||
          v.yearModel.toString().includes(query) ||
          v.yearFabrication.toString().includes(query) ||
          v.transmission.toLowerCase().includes(query) ||
          v.bodyType.toLowerCase().includes(query)
        );
      });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por marca, modelo, câmbio ou ano... (ex: Corolla, Tracker, Automático)"
            className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredVehicles.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <Car className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              Nenhum veículo encontrado para &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => {
                  onSelectVehicle(vehicle);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={vehicle.coverImage}
                      alt={vehicle.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-[#e30613] transition-colors truncate">
                        {vehicle.brand} {vehicle.model}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium shrink-0">
                        {vehicle.yearFabrication}/{vehicle.yearModel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{vehicle.transmission}</span>
                      <span>•</span>
                      <span>{vehicle.mileage.toLocaleString("pt-BR")} km</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        Periciado
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pl-3 text-right">
                  <div>
                    <span className="block font-black text-sm text-slate-900 tabular-nums">
                      {formatCurrency(vehicle.price)}
                    </span>
                    <span className="block text-[10px] text-slate-400">À vista / Troca</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#e30613] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{filteredVehicles.length} veículos em destaque</span>
          <div className="flex items-center gap-2">
            <span>Dica: Use <strong>↑ ↓</strong> para navegar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
