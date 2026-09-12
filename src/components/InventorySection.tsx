"use client";

import React, { useState, useMemo } from "react";
import { Vehicle } from "@/types";
import { COMMON_BRANDS, BODY_TYPES } from "@/lib/constants";
import VehicleCard from "@/components/VehicleCard";
import {
  Search,
  RotateCcw,
  Filter,
  Check
} from "lucide-react";

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
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState(initialBodyType);
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"recent" | "price_asc" | "price_desc" | "year_desc" | "km_asc">("recent");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Synchronize when initial props change from hero
  React.useEffect(() => {
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialBodyType) setSelectedBodyType(initialBodyType);
    if (initialSearch) setSearchTerm(initialSearch);
  }, [initialBrand, initialBodyType, initialSearch]);

  // Extract unique brands from current vehicle list
  const availableBrands = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.brand));
    return Array.from(set).sort();
  }, [vehicles]);

  // Filter and sort vehicles client-side for ultra-fast instant UI responsiveness
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Brand filter
      if (selectedBrand && v.brand !== selectedBrand) return false;

      // Body Type filter
      if (selectedBodyType && v.bodyType !== selectedBodyType) return false;

      // Transmission filter
      if (selectedTransmission && v.transmission !== selectedTransmission) return false;

      // Price range filter
      if (selectedPriceRange) {
        const p = parseFloat(v.price);
        if (selectedPriceRange === "0-50000" && p > 50000) return false;
        if (selectedPriceRange === "50000-80000" && (p < 50000 || p > 80000)) return false;
        if (selectedPriceRange === "80000-120000" && (p < 80000 || p > 120000)) return false;
        if (selectedPriceRange === "120000-9999999" && p < 120000) return false;
      }

      // Year filter
      if (selectedYear) {
        const yMin = parseInt(selectedYear, 10);
        if (v.yearFabrication < yMin) return false;
      }

      // Featured only
      if (onlyFeatured && !v.isFeatured) return false;

      // Search term
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
      // Default: recent (newest id / createdAt)
      return b.id - a.id;
    });
  }, [
    vehicles,
    selectedBrand,
    selectedBodyType,
    selectedTransmission,
    selectedPriceRange,
    selectedYear,
    onlyFeatured,
    searchTerm,
    sortBy,
  ]);

  const hasActiveFilters = Boolean(
    selectedBrand ||
    selectedPriceRange ||
    selectedYear ||
    selectedBodyType ||
    selectedTransmission ||
    searchTerm ||
    onlyFeatured
  );

  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedPriceRange("");
    setSelectedYear("");
    setSelectedBodyType("");
    setSelectedTransmission("");
    setSearchTerm("");
    setOnlyFeatured(false);
    setSortBy("recent");
  };

  return (
    <section id="estoque" className="py-14 sm:py-20 bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 scroll-mt-20 border-b border-slate-200 dark:border-[#232a38] transition-colors duration-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header - Speed & Power Automotive Identity */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-speed font-bold uppercase tracking-widest text-[#e30613] mb-1.5">
              <span>{"// SHOWROOM MODELO MULTIMARCAS"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic font-speed">
              Estoque Selecionado e Pronto para Rodar
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Todos os modelos revisados, periciados com laudo cautelar aprovado e prontos para entrega em Juiz de Fora.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-speed font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow-sm tabular-nums flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {filteredVehicles.length} {filteredVehicles.length === 1 ? "veículo disponível" : "veículos disponíveis"}
            </span>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="lg:hidden flex items-center gap-1.5 bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              Filtros
            </button>
          </div>
        </div>

        {/* Filters Console */}
        <div className="bg-white dark:bg-[#0e1117] rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-[#232a38] shadow-sm mb-8 transition-colors duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Search Input */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-speed">
                Buscar Modelo
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Onix, Argo, Civic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Brand Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-speed">
                Marca
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Todas as Marcas</option>
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand} className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-speed">
                Faixa de Preço
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full bg-white dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Todos os Preços</option>
                <option value="0-50000" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Até R$ 50.000</option>
                <option value="50000-80000" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">R$ 50.000 a R$ 80.000</option>
                <option value="80000-120000" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">R$ 80.000 a R$ 120.000</option>
                <option value="120000-9999999" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Acima de R$ 120.000</option>
              </select>
            </div>

            {/* Year Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-speed">
                Ano Mínimo
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-white dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Todos os Anos</option>
                <option value="2023" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">2023 em diante</option>
                <option value="2021" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">2021 em diante</option>
                <option value="2019" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">2019 em diante</option>
                <option value="2016" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">2016 em diante</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-speed">
                Classificar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors cursor-pointer"
              >
                <option value="recent" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Mais Recentes</option>
                <option value="price_asc" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Menor Preço</option>
                <option value="price_desc" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Maior Preço</option>
                <option value="year_desc" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Ano Mais Novo</option>
                <option value="km_asc" className="bg-white dark:bg-[#151821] text-slate-900 dark:text-white">Menor Quilometragem</option>
              </select>
            </div>
          </div>

          {/* Extended Category Pills */}
          <div className={`${showAdvancedFilters ? "block" : "hidden"} lg:block pt-4 mt-4 border-t border-slate-100 dark:border-[#232a38]`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mr-1 font-speed">Carroceria:</span>
                <button
                  type="button"
                  onClick={() => setSelectedBodyType("")}
                  className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer font-speed tracking-wider ${
                    selectedBodyType === ""
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold shadow-sm"
                      : "bg-slate-100 dark:bg-[#151821] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#232a38] hover:bg-slate-200 dark:hover:bg-[#1f2430] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Todas
                </button>
                {BODY_TYPES.map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setSelectedBodyType(selectedBodyType === bt ? "" : bt)}
                    className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer font-speed tracking-wider ${
                      selectedBodyType === bt
                        ? "bg-[#e30613] text-white border-[#e30613] font-bold shadow-sm"
                        : "bg-slate-100 dark:bg-[#151821] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#232a38] hover:bg-slate-200 dark:hover:bg-[#1f2430] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyFeatured}
                    onChange={(e) => setOnlyFeatured(e.target.checked)}
                    className="rounded bg-white dark:bg-[#151821] border-slate-300 dark:border-[#232a38] text-[#e30613] focus:ring-[#e30613] cursor-pointer"
                  />
                  <span>Apenas Destaques</span>
                </label>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-800/40 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Limpar Filtros
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-[#0e1117] rounded-xl overflow-hidden border border-slate-200 dark:border-[#232a38] animate-pulse h-96 flex flex-col shadow-sm"
              >
                <div className="bg-slate-100 dark:bg-[#151821] aspect-[16/10] w-full"></div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-[#232a38] rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 dark:bg-[#1b202c] rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-slate-200 dark:bg-[#232a38] rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
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
        ) : (
          /* Empty Search State */
          <div className="bg-white dark:bg-[#0e1117] rounded-2xl border border-slate-200 dark:border-[#232a38] p-12 text-center max-w-md mx-auto shadow-sm transition-colors duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-speed uppercase">
              Nenhum veículo encontrado
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              Não encontramos nenhum seminovo com os filtros selecionados. Tente ajustar os parâmetros ou visualize todo o estoque da loja.
            </p>
            <button
              onClick={resetFilters}
              className="bg-slate-100 dark:bg-[#151821] hover:bg-[#e30613] dark:hover:bg-[#e30613] text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-white font-speed font-bold uppercase tracking-wider border border-slate-200 dark:border-[#232a38] px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Ver Todo o Estoque ({vehicles.length} veículos)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

