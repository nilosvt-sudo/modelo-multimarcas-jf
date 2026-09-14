"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RemotionShowcaseSection from "@/components/RemotionShowcaseSection";
import InventorySection from "@/components/InventorySection";
import VehicleModal from "@/components/VehicleModal";
import AppraisalSection from "@/components/AppraisalSection";
import TestDriveModal from "@/components/TestDriveModal";
import ComparisonModal from "@/components/ComparisonModal";
import FavoritesDrawer from "@/components/FavoritesDrawer";
import ReviewsSection from "@/components/ReviewsSection";
import AboutSection from "@/components/AboutSection";
import ContactLocationSection from "@/components/ContactLocationSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import BrandsMarqueeSection from "@/components/BrandsMarqueeSection";
import { CommandSearch } from "@/components/ui/command-search";

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);

  // Search parameters dispatched from Hero to Inventory
  const [heroSearchBrand, setHeroSearchBrand] = useState("");
  const [heroSearchBodyType, setHeroSearchBodyType] = useState("");
  const [heroSearchTerm, setHeroSearchTerm] = useState("");

  // Modals & Drawers state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [appraisalModalOpen, setAppraisalModalOpen] = useState(false);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [testDriveTargetCar, setTestDriveTargetCar] = useState<Vehicle | null>(null);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<number[]>([]);

  // Compared vehicles in memory
  const [comparedVehicles, setComparedVehicles] = useState<Vehicle[]>([]);

  // Load vehicles from API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (e) {
      console.error("Error fetching vehicles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();

    // Load favorites from localStorage
    try {
      const saved = localStorage.getItem("modelo_jf_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save favorites to localStorage
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      let updated: number[];
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }
      try {
        localStorage.setItem("modelo_jf_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem("modelo_jf_favorites");
    } catch {}
  };

  // Compare toggles
  const handleToggleCompare = (v: Vehicle) => {
    setComparedVehicles((prev) => {
      const exists = prev.some((item) => item.id === v.id);
      if (exists) {
        return prev.filter((item) => item.id !== v.id);
      }
      if (prev.length >= 3) {
        alert("Você pode comparar no máximo 3 veículos ao mesmo tempo.");
        return prev;
      }
      setComparisonModalOpen(true);
      return [...prev, v];
    });
  };

  const handleRemoveCompare = (id: number) => {
    setComparedVehicles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCompare = () => {
    setComparedVehicles([]);
  };

  // Hero search dispatch
  const handleHeroSearchSubmit = (brand: string, bodyType: string, search: string) => {
    setHeroSearchBrand(brand);
    setHeroSearchBodyType(bodyType);
    setHeroSearchTerm(search);
  };

  // Test drive trigger for specific car
  const handleOpenTestDriveForVehicle = (v: Vehicle) => {
    setTestDriveTargetCar(v);
    setTestDriveModalOpen(true);
  };

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open CommandSearch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-[#0047cc] selection:text-white pb-24 md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <Header
        favoriteCount={favorites.length}
        comparisonCount={comparedVehicles.length}
        onOpenFavorites={() => setFavoritesDrawerOpen(true)}
        onOpenComparison={() => setComparisonModalOpen(true)}
        onOpenAppraisal={() => setAppraisalModalOpen(true)}
        onOpenSearch={() => setCommandSearchOpen(true)}
        onOpenTestDrive={() => {
          setTestDriveTargetCar(null);
          setTestDriveModalOpen(true);
        }}
      />

      {/* Remotion Virtual Cinema Showroom - 1ª Dobra */}
      <RemotionShowcaseSection
        vehicles={vehicles}
        onSelectVehicle={(v) => setSelectedVehicle(v)}
      />

      {/* Hero Section & Console de Busca */}
      <Hero
        onSearchSubmit={handleHeroSearchSubmit}
        onOpenAppraisal={() => setAppraisalModalOpen(true)}
      />

      {/* 21st.dev Infinite Marquee: Montadoras & Parceiros Bancários */}
      <BrandsMarqueeSection />

      {/* Inventory Section with Realtime Filtering */}
      <InventorySection
        vehicles={vehicles}
        loading={loading}
        favorites={favorites}
        comparedVehicles={comparedVehicles}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompare={handleToggleCompare}
        onSelectVehicle={(v) => setSelectedVehicle(v)}
        initialBrand={heroSearchBrand}
        initialBodyType={heroSearchBodyType}
        initialSearch={heroSearchTerm}
      />

      {/* Trade-In / Appraisal Section (In-Page) */}
      <AppraisalSection vehicles={vehicles} />

      {/* Reviews & Google Testimonials */}
      <ReviewsSection />

      {/* About the Dealership & Guarantees */}
      <AboutSection />

      {/* Store Location on Av. Rio Branco & Contact */}
      <ContactLocationSection />

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp
        onOpenAppraisal={() => setAppraisalModalOpen(true)}
      />

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onOpenTestDriveForVehicle={handleOpenTestDriveForVehicle}
        />
      )}

      {/* Appraisal Modal (When opened from Header/Floating button) */}
      <AppraisalSection
        vehicles={vehicles}
        isOpen={appraisalModalOpen}
        onClose={() => setAppraisalModalOpen(false)}
      />

      {/* Test-Drive Modal */}
      <TestDriveModal
        vehicles={vehicles}
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        selectedVehicle={testDriveTargetCar}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        comparedVehicles={comparedVehicles}
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onRemove={handleRemoveCompare}
        onClear={handleClearCompare}
        onSelectVehicle={(v) => setSelectedVehicle(v)}
      />

      {/* Favorites / Wishlist Drawer */}
      <FavoritesDrawer
        isOpen={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        favorites={favorites}
        vehicles={vehicles}
        onRemoveFavorite={handleToggleFavorite}
        onClearFavorites={handleClearFavorites}
        onSelectVehicle={(v) => setSelectedVehicle(v)}
      />

      {/* 21st.dev Command Palette / Quick Search (Ctrl+K) */}
      <CommandSearch
        vehicles={vehicles}
        isOpen={commandSearchOpen}
        onClose={() => setCommandSearchOpen(false)}
        onSelectVehicle={(v) => setSelectedVehicle(v)}
      />
    </div>
  );
}
