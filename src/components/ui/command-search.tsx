"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
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
          v.color.toLowerCase().includes(query) ||
          v.bodyType.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query)
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
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#10131a] rounded-3xl shadow-2xl border border-amber-200/80 dark:border-zinc-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-zinc-100 transition-colors">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-amber-100 dark:border-zinc-800 gap-3">
          <Search className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por tratamento, tecnologia ou queixa... (ex: Botox, Sculptra, Melasma, Lavieen)"
            className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-serif">Nenhum procedimento encontrado com esse termo.</p>
              <p className="text-xs text-slate-400 mt-0.5">Tente buscar por "facial", "laser" ou "botox".</p>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => {
                  onSelectVehicle(vehicle);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-2xl hover:bg-amber-50/70 dark:hover:bg-[#161a22] flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0">
                    <img
                      src={vehicle.coverImage}
                      alt={vehicle.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                        {vehicle.brand}
                      </span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white truncate">
                      {vehicle.model}
                    </h4>
                    <span className="text-xs text-slate-500 truncate block">
                      {vehicle.version} • {vehicle.color}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2 pl-3">
                  <div>
                    <span className="text-xs font-bold font-serif text-slate-900 dark:text-white block">
                      {formatCurrency(vehicle.price)}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      {vehicle.bodyType}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-[#0c0e14] border-t border-amber-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Dica: Use <strong>Ctrl+K</strong> em qualquer momento para abrir esta busca</span>
          <span className="font-semibold text-amber-700 dark:text-amber-400">Lumina Derma Instituto</span>
        </div>
      </div>
    </div>
  );
}
