"use client";

import React, { useState, useMemo } from "react";
import { Vehicle } from "@/types";
import VehicleCard from "@/components/VehicleCard";
import { RotateCcw, CarFront, Filter } from "lucide-react";
import { COMMON_BRANDS, BODY_TYPES, TRANSMISSION_TYPES } from "@/lib/constants";

interface InventorySectionProps {
  vehicles: Vehicle[];
  loading?: boolean;
  favorites: number[];
  comparedVehicles: Vehicle[];
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  initialBrand?: string;
  initialBodyType?: string;
  initialSearch?: string;
}

export default function InventorySection({
  vehicles,
  loading = false,
  favorites,
  comparedVehicles,
  onToggleFavorite,
  onToggleCompare,
  onSelectVehicle,
  initialBrand = "",
  initialBodyType = "",
  initialSearch = "",
}: InventorySectionProps) {
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState(initialBodyType);
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"recent" | "price_asc" | "price_desc" | "year_desc" | "km_asc">("recent");
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  React.useEffect(() => {
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialBodyType) setSelectedBodyType(initialBodyType);
    if (initialSearch) setSearchTerm(initialSearch);
  }, [initialBrand, initialBodyType, initialSearch]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedBrand && v.brand !== selectedBrand) return false;
      if (selectedBodyType && v.bodyType !== selectedBodyType) return false;
      if (selectedTransmission && v.transmission !== selectedTransmission) return false;

      if (selectedPriceRange) {
        const p = parseFloat(v.price);
        if (selectedPriceRange === "0-100000" && p > 100000) return false;
        if (selectedPriceRange === "100000-150000" && (p < 100000 || p > 150000)) return false;
        if (selectedPriceRange === "150000-200000" && (p < 150000 || p > 200000)) return false;
        if (selectedPriceRange === "200000-9999999" && p < 200000) return false;
      }

      if (onlyFeatured && !v.isFeatured) return false;

      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase().trim();
        const fullText = `${v.brand} ${v.model} ${v.version} ${v.color} ${v.fuel} ${v.description}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === "year_desc") return b.yearFabrication - a.yearFabrication;
      if (sortBy === "km_asc") return a.mileage - b.mileage;
      return b.id - a.id;
    });
  }, [
    vehicles,
    selectedBrand,
    selectedBodyType,
    selectedTransmission,
    selectedPriceRange,
    onlyFeatured,
    searchTerm,
    sortBy
  ]);

  const handleClearFilters = () => {
    setSelectedBrand("");
    setSelectedBodyType("");
    setSelectedTransmission("");
    setSelectedPriceRange("");
    setSearchTerm("");
    setOnlyFeatured(false);
    setSortBy("recent");
  };

  const hasActiveFilters = Boolean(
    selectedBrand || selectedBodyType || selectedTransmission || selectedPriceRange || searchTerm || onlyFeatured
  );

  return (
    <section
      id="estoque"
      className="py-8 sm:py-12 bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 transition-colors duration-200"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-slate-200 dark:border-[#232a38] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#0047cc] dark:text-[#3b82f6] font-bold uppercase tracking-wider text-xs mb-1">
              <CarFront className="w-4 h-4" />
              <span>Estoque Atualizado em Tempo Real</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
              Seminovos em Destaque
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Todos os veículos passam por rigorosa inspeção mecânica e possuem laudo cautelar 100% aprovado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-[#12151d] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#232a38]">
              Mostrando <strong className="text-[#0047cc] dark:text-[#3b82f6] font-bold">{filteredVehicles.length}</strong> de {vehicles.length} veículos
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-[#0e1117] border border-slate-200/90 dark:border-[#232a38] p-4 rounded-2xl shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Marca */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Marca
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-3 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] transition-colors"
              >
                <option value="">Todas as Marcas</option>
                {COMMON_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Carroceria */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Carroceria
              </label>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-3 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] transition-colors"
              >
                <option value="">Todas as Carrocerias</option>
                {BODY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Faixa de Preço */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Faixa de Preço
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-3 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] transition-colors"
              >
                <option value="">Qualquer Valor</option>
                <option value="0-100000">Até R$ 100.000</option>
                <option value="100000-150000">R$ 100.000 a R$ 150.000</option>
                <option value="150000-200000">R$ 150.000 a R$ 200.000</option>
                <option value="200000-9999999">Acima de R$ 200.000</option>
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-3 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] transition-colors"
              >
                <option value="recent">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="year_desc">Ano mais Novo</option>
                <option value="km_asc">Menor Quilometragem</option>
              </select>
            </div>
          </div>

          {/* Bottom Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#232a38]">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-[#0047cc] focus:ring-[#0047cc] w-4 h-4"
                />
                <span>Apenas Destaques</span>
              </label>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-[#0e1117] rounded-2xl p-4 border border-slate-200 dark:border-[#232a38] animate-pulse space-y-3"
              >
                <div className="aspect-[16/10] bg-slate-200 dark:bg-[#1a1d24] rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-[#1a1d24] rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-[#1a1d24] rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVehicles.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-[#0e1117] rounded-3xl border border-dashed border-slate-300 dark:border-[#232a38] max-w-xl mx-auto">
            <CarFront className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Nenhum veículo encontrado
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
              Tente alterar os termos da busca ou limpar os filtros para visualizar outros seminovos.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0047cc] text-white text-xs font-bold rounded-xl hover:bg-[#003bb3] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ver Todos os Veículos</span>
            </button>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        {!loading && filteredVehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={favorites.includes(vehicle.id)}
                isCompared={comparedVehicles.some((c) => c.id === vehicle.id)}
                onToggleFavorite={onToggleFavorite}
                onToggleCompare={onToggleCompare}
                onSelect={onSelectVehicle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
