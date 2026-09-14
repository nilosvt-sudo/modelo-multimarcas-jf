"use client";

import React, { useState, useMemo } from "react";
import { Vehicle } from "@/types";
import VehicleCard from "@/components/VehicleCard";
import { RotateCcw } from "lucide-react";

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

  // Synchronize when initial props change from hero
  React.useEffect(() => {
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialBodyType) setSelectedBodyType(initialBodyType);
    if (initialSearch) setSearchTerm(initialSearch);
  }, [initialBrand, initialBodyType, initialSearch]);

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
    <section id="estoque" className="py-8 sm:py-12 bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 scroll-mt-20 border-b border-slate-200 dark:border-[#232a38] transition-colors duration-200 w-full max-w-full overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 w-full max-w-full">
        {/* Active Filter Indicator if search applied from Hero */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] px-4 py-2.5 rounded-xl shadow-sm mb-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0047cc] animate-pulse"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Filtro ativo: {selectedBrand || selectedBodyType || searchTerm} ({filteredVehicles.length} encontrados)
              </span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-800/40 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar busca
            </button>
          </div>
        )}

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

