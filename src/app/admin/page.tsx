"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Vehicle, Lead, TestDrive, Appraisal, Review } from "@/types";
import {
  formatCurrency,
  formatMileage,
  COMMON_BRANDS,
  BODY_TYPES,
  TRANSMISSION_TYPES,
  FUEL_TYPES,
  COMMON_FEATURES_LIST,
  generateWhatsAppLink,
  DEALERSHIP_INFO,
} from "@/lib/constants";
import {
  LayoutDashboard,
  CarFront,
  Users,
  CalendarCheck,
  Scale,
  Star,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  ChevronLeft,
  Search,
  RefreshCw,
  Eye,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  X,
  Phone,
  MessageCircle,
  DollarSign
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "vehicles" | "leads" | "test_drives" | "appraisals" | "reviews" | "settings"
  >("overview");

  // State data
  const [stats, setStats] = useState<any>(null);
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>([]);
  const [leadsList, setLeadsList] = useState<Lead[]>([]);
  const [testDrivesList, setTestDrivesList] = useState<TestDrive[]>([]);
  const [appraisalsList, setAppraisalsList] = useState<Appraisal[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  // Vehicle Modal State
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    brand: "Fiat",
    model: "",
    version: "",
    yearFabrication: 2022,
    yearModel: 2022,
    price: "",
    fipePrice: "",
    mileage: 0,
    fuel: "Flex",
    transmission: "Manual",
    color: "Prata",
    bodyType: "Hatch",
    plateEnd: "",
    doors: 4,
    coverImage: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
    gallery: "",
    features: [] as string[],
    description: "",
    isFeatured: false,
    badge: "Seminovo",
    hasInspectionReport: true,
    singleOwner: false,
    ipvaPaid: true,
    status: "available",
  });

  // Search in inventory
  const [searchVehicles, setSearchVehicles] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [vRes, sRes, lRes, tdRes, apRes, rRes] = await Promise.all([
        fetch("/api/vehicles?status=all"),
        fetch("/api/admin/stats"),
        fetch("/api/leads"),
        fetch("/api/test-drives"),
        fetch("/api/appraisals"),
        fetch("/api/reviews?all=true"),
      ]);

      const [vData, sData, lData, tdData, apData, rData] = await Promise.all([
        vRes.json(),
        sRes.json(),
        lRes.json(),
        tdRes.json(),
        apRes.json(),
        rRes.json(),
      ]);

      if (Array.isArray(vData)) setVehiclesList(vData);
      setStats(sData);
      if (Array.isArray(lData)) setLeadsList(lData);
      if (Array.isArray(tdData)) setTestDrivesList(tdData);
      if (Array.isArray(apData)) setAppraisalsList(apData);
      if (Array.isArray(rData)) setReviewsList(rData);
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showFeedback = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4000);
  };

  // Open Add Vehicle Modal
  const handleOpenAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      brand: "Fiat",
      model: "",
      version: "",
      yearFabrication: 2022,
      yearModel: 2022,
      price: "60000",
      fipePrice: "",
      mileage: 30000,
      fuel: "Flex",
      transmission: "Manual",
      color: "Prata",
      bodyType: "Hatch",
      plateEnd: "1",
      doors: 4,
      coverImage: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
      gallery: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
      features: ["Ar-condicionado", "Direção elétrica", "Vidros elétricos", "Travas elétricas"],
      description: "Veículo seminovo revisado com garantia Modelo Multimarcas JF. Laudo cautelar 100% aprovado.",
      isFeatured: false,
      badge: "Seminovo",
      hasInspectionReport: true,
      singleOwner: false,
      ipvaPaid: true,
      status: "available",
    });
    setVehicleModalOpen(true);
  };

  // Open Edit Vehicle Modal
  const handleOpenEditVehicle = (v: Vehicle) => {
    setEditingVehicle(v);
    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = JSON.parse(v.features || "[]");
    } catch {}

    let parsedGallery: string[] = [];
    try {
      parsedGallery = JSON.parse(v.gallery || "[]");
    } catch {}

    setVehicleForm({
      brand: v.brand,
      model: v.model,
      version: v.version,
      yearFabrication: v.yearFabrication,
      yearModel: v.yearModel,
      price: v.price,
      fipePrice: v.fipePrice || "",
      mileage: v.mileage,
      fuel: v.fuel,
      transmission: v.transmission,
      color: v.color,
      bodyType: v.bodyType,
      plateEnd: v.plateEnd || "",
      doors: v.doors || 4,
      coverImage: v.coverImage,
      gallery: parsedGallery.join("\n"),
      features: parsedFeatures,
      description: v.description,
      isFeatured: v.isFeatured,
      badge: v.badge || "Seminovo",
      hasInspectionReport: v.hasInspectionReport,
      singleOwner: v.singleOwner,
      ipvaPaid: v.ipvaPaid,
      status: v.status,
    });
    setVehicleModalOpen(true);
  };

  // Save Vehicle (POST or PUT)
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const galleryArray = vehicleForm.gallery
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...vehicleForm,
        gallery: galleryArray.length ? galleryArray : [vehicleForm.coverImage],
        features: vehicleForm.features,
      };

      if (editingVehicle) {
        await fetch(`/api/vehicles/${editingVehicle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showFeedback("Veículo atualizado com sucesso!");
      } else {
        await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showFeedback("Veículo cadastrado no estoque!");
      }

      setVehicleModalOpen(false);
      loadAllData();
    } catch (e) {
      console.error("Error saving vehicle:", e);
      alert("Erro ao salvar veículo.");
    }
  };

  // Delete Vehicle
  const handleDeleteVehicle = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o veículo ${name}?`)) return;
    try {
      await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      showFeedback("Veículo excluído do estoque.");
      loadAllData();
    } catch (e) {
      console.error("Error deleting vehicle:", e);
    }
  };

  // Quick toggle status
  const handleToggleVehicleStatus = async (vehicle: Vehicle, newStatus: string) => {
    try {
      await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      showFeedback(`Status atualizado para: ${newStatus}`);
      loadAllData();
    } catch (e) {
      console.error("Error toggling status:", e);
    }
  };

  // Lead status update
  const handleUpdateLeadStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      showFeedback("Status da proposta atualizado.");
      loadAllData();
    } catch (e) {
      console.error("Error updating lead:", e);
    }
  };

  // Test Drive status update
  const handleUpdateTestDriveStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/test-drives", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      showFeedback("Status do agendamento atualizado.");
      loadAllData();
    } catch (e) {
      console.error("Error updating test drive:", e);
    }
  };

  // Appraisal status & valuation update
  const handleUpdateAppraisalStatus = async (id: number, status: string, estimatedValue?: string) => {
    try {
      await fetch("/api/appraisals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, estimatedValue }),
      });
      showFeedback("Avaliação atualizada.");
      loadAllData();
    } catch (e) {
      console.error("Error updating appraisal:", e);
    }
  };

  // Review publish toggle
  const handleToggleReviewPublish = async (id: number, current: boolean) => {
    try {
      await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !current }),
      });
      showFeedback("Status do depoimento atualizado.");
      loadAllData();
    } catch (e) {
      console.error("Error updating review:", e);
    }
  };

  // Reset / Seed database
  const handleResetDatabase = async () => {
    if (!confirm("Deseja redefinir todo o banco de dados com os veículos padrão da loja?")) return;
    try {
      setLoading(true);
      await fetch("/api/admin/seed", { method: "POST" });
      showFeedback("Estoque e dados padrão restaurados com sucesso!");
      loadAllData();
    } catch (e) {
      console.error("Error reseeding:", e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered vehicles in admin
  const adminFilteredVehicles = vehiclesList.filter((v) => {
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (searchVehicles.trim()) {
      const q = searchVehicles.toLowerCase();
      const text = `${v.brand} ${v.model} ${v.version} ${v.yearFabrication}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Ver Site da Loja
            </Link>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                M
              </div>
              <span className="font-bold text-sm text-white">
                Painel Administrativo • {DEALERSHIP_INFO.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleOpenAddVehicle}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Veículo
            </button>
          </div>
        </div>
      </header>

      {/* Feedback Toast */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4" />
          {actionMessage}
        </div>
      )}

      {/* Admin Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold scrollbar-thin">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === "overview"
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Visão Geral
          </button>

          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === "vehicles"
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <CarFront className="w-4 h-4" />
            Estoque ({vehiclesList.length})
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === "leads"
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Propostas & Financiamentos ({leadsList.length})
          </button>

          <button
            onClick={() => setActiveTab("test_drives")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === "test_drives"
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Test-Drives ({testDrivesList.length})
          </button>

          <button
            onClick={() => setActiveTab("appraisals")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === "appraisals"
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4" />
            Avaliações / Trocas ({appraisalsList.length})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === "reviews"
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Star className="w-4 h-4" />
            Depoimentos ({reviewsList.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeTab === "settings"
                ? "bg-orange-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Estoque Disponível</span>
                  <CarFront className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stats.availableVehicles} <span className="text-xs text-slate-400 font-normal">de {stats.totalVehicles}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Veículos ativos no site</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Valor Total em Pátio</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 truncate">
                  {formatCurrency(stats.inventoryTotalValue)}
                </div>
                <span className="text-[11px] text-slate-400">Patrimônio disponível</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Propostas Recebidas</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stats.totalLeads}
                </div>
                <span className="text-[11px] text-orange-400 font-medium">{stats.newLeads} novas propostas</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase">Test-Drives / Trocas</span>
                  <CalendarCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {stats.totalTestDrives + stats.totalAppraisals}
                </div>
                <span className="text-[11px] text-purple-400 font-medium">
                  {stats.pendingTestDrives} agendamentos pendentes
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Inventory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Recent Inquiries */}
              <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-400" />
                    Propostas Recentes de Financiamento
                  </h3>
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="text-xs text-orange-400 hover:underline"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="space-y-2.5">
                  {leadsList.slice(0, 4).map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <strong className="text-white block">{lead.name}</strong>
                        <span className="text-slate-400">{lead.vehicleName || "Interesse geral"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lead.status === "new"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {lead.status === "new" ? "Novo" : lead.status}
                        </span>
                        <a
                          href={generateWhatsAppLink(
                            `Olá ${lead.name}! Recebemos sua simulação para o ${lead.vehicleName} na Modelo Multimarcas JF.`,
                            lead.phone.replace(/\D/g, "")
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                          title="Chamar no WhatsApp"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Recent Test Drives */}
              <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-purple-400" />
                    Agendamentos de Test-Drive
                  </h3>
                  <button
                    onClick={() => setActiveTab("test_drives")}
                    className="text-xs text-orange-400 hover:underline"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="space-y-2.5">
                  {testDrivesList.slice(0, 4).map((td) => (
                    <div
                      key={td.id}
                      className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <strong className="text-white block">{td.customerName}</strong>
                        <span className="text-slate-400">
                          {td.vehicleName} • {td.preferredDate} às {td.preferredTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {td.locationPreference === "dealership" ? "Na Loja" : "Domicílio"}
                        </span>
                        <a
                          href={generateWhatsAppLink(
                            `Olá ${td.customerName}! Confirmando seu test-drive para ${td.vehicleName} no dia ${td.preferredDate}.`,
                            td.customerPhone.replace(/\D/g, "")
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                          title="Chamar no WhatsApp"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VEHICLES INVENTORY CRUD */}
        {activeTab === "vehicles" && (
          <div className="space-y-4">
            {/* Search and Filters Header */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Buscar no estoque..."
                  value={searchVehicles}
                  onChange={(e) => setSearchVehicles(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-orange-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="available">Disponível</option>
                  <option value="reserved">Reservado</option>
                  <option value="sold">Vendido</option>
                </select>

                <button
                  onClick={handleOpenAddVehicle}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Carro
                </button>
              </div>
            </div>

            {/* Vehicles Table */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-3">Veículo</th>
                    <th className="p-3">Ano</th>
                    <th className="p-3">Km</th>
                    <th className="p-3">Preço</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Destaque</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {adminFilteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.coverImage}
                            alt={vehicle.model}
                            className="w-12 h-9 object-cover rounded-lg bg-slate-900 shrink-0"
                          />
                          <div>
                            <strong className="text-white block font-bold text-xs">
                              {vehicle.brand} {vehicle.model}
                            </strong>
                            <span className="text-slate-400 text-[11px] line-clamp-1">
                              {vehicle.version}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300">
                        {vehicle.yearFabrication}/{vehicle.yearModel}
                      </td>
                      <td className="p-3 text-slate-300 font-medium">
                        {formatMileage(vehicle.mileage)}
                      </td>
                      <td className="p-3 font-bold text-orange-400">
                        {formatCurrency(vehicle.price)}
                      </td>
                      <td className="p-3">
                        <select
                          value={vehicle.status}
                          onChange={(e) => handleToggleVehicleStatus(vehicle, e.target.value)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            vehicle.status === "available"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : vehicle.status === "reserved"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-slate-900 text-slate-400 border-slate-700"
                          }`}
                        >
                          <option value="available">Disponível</option>
                          <option value="reserved">Reservado</option>
                          <option value="sold">Vendido</option>
                        </select>
                      </td>
                      <td className="p-3">
                        {vehicle.isFeatured ? (
                          <span className="bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/30">
                            Sim
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/veiculos/${vehicle.id}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                            title="Ver no site"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditVehicle(vehicle)}
                            className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-slate-700 rounded-lg cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-700 rounded-lg cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LEADS & FINANCING */}
        {activeTab === "leads" && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Veículo</th>
                  <th className="p-3">Simulação</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Data</th>
                  <th className="p-3 text-right">Ação WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {leadsList.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-700/30">
                    <td className="p-3">
                      <strong className="text-white block font-bold">{lead.name}</strong>
                      <span className="text-slate-400 text-[11px] block">{lead.phone}</span>
                      {lead.email && <span className="text-slate-500 text-[10px]">{lead.email}</span>}
                    </td>
                    <td className="p-3 text-slate-300 font-medium">
                      {lead.vehicleName || "Interesse Geral"}
                    </td>
                    <td className="p-3 text-slate-300">
                      {lead.entryAmount ? (
                        <div>
                          <span>Entrada: {formatCurrency(lead.entryAmount)}</span>
                          <span className="block text-[10px] text-slate-400">{lead.installments}x parcelas</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Contato Geral</span>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded-lg"
                      >
                        <option value="new">Novo</option>
                        <option value="in_progress">Em Contato</option>
                        <option value="completed">Fechado</option>
                        <option value="lost">Perdido</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={generateWhatsAppLink(
                          `Olá ${lead.name}! Estou entrando em contato da Modelo Multimarcas JF sobre seu interesse no ${lead.vehicleName}.`,
                          lead.phone.replace(/\D/g, "")
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                        Chamar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: TEST-DRIVES */}
        {activeTab === "test_drives" && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Veículo</th>
                  <th className="p-3">Data e Hora</th>
                  <th className="p-3">Modalidade</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {testDrivesList.map((td) => (
                  <tr key={td.id} className="hover:bg-slate-700/30">
                    <td className="p-3">
                      <strong className="text-white block font-bold">{td.customerName}</strong>
                      <span className="text-slate-400 text-[11px]">{td.customerPhone}</span>
                    </td>
                    <td className="p-3 text-slate-300 font-semibold">{td.vehicleName}</td>
                    <td className="p-3 text-slate-200">
                      <span className="font-bold">{td.preferredDate}</span> às {td.preferredTime}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                        {td.locationPreference === "dealership" ? "Loja Av. Rio Branco" : "Em Domicílio"}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={td.status}
                        onChange={(e) => handleUpdateTestDriveStatus(td.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded-lg"
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="completed">Realizado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={generateWhatsAppLink(
                          `Olá ${td.customerName}! Confirmamos seu Test-Drive para o ${td.vehicleName} no dia ${td.preferredDate} às ${td.preferredTime}.`,
                          td.customerPhone.replace(/\D/g, "")
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                        Confirmar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: APPRAISALS / TRADE-INS */}
        {activeTab === "appraisals" && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Carro do Cliente</th>
                  <th className="p-3">Ano / Km / Câmbio</th>
                  <th className="p-3">Interesse</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {appraisalsList.map((ap) => (
                  <tr key={ap.id} className="hover:bg-slate-700/30">
                    <td className="p-3">
                      <strong className="text-white block font-bold">{ap.customerName}</strong>
                      <span className="text-slate-400 text-[11px]">{ap.customerPhone}</span>
                    </td>
                    <td className="p-3 font-bold text-orange-400">
                      {ap.tradeBrand} {ap.tradeModel}
                    </td>
                    <td className="p-3 text-slate-300">
                      {ap.tradeYear} • {formatMileage(ap.tradeMileage)} • {ap.tradeTransmission}
                    </td>
                    <td className="p-3 text-slate-300">
                      {ap.interestedVehicleName || "Venda Direta"}
                    </td>
                    <td className="p-3">
                      <select
                        value={ap.status}
                        onChange={(e) => handleUpdateAppraisalStatus(ap.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded-lg"
                      >
                        <option value="pending">Pendente</option>
                        <option value="in_review">Em Análise</option>
                        <option value="evaluated">Proposta Enviada</option>
                        <option value="closed">Fechado</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={generateWhatsAppLink(
                          `Olá ${ap.customerName}! Recebemos a avaliação do seu ${ap.tradeBrand} ${ap.tradeModel} (${ap.tradeYear}). Vamos conversar sobre a proposta?`,
                          ap.customerPhone.replace(/\D/g, "")
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                        Proposta
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Autor</th>
                  <th className="p-3">Nota</th>
                  <th className="p-3">Depoimento</th>
                  <th className="p-3">Carro</th>
                  <th className="p-3">Publicado</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {reviewsList.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-700/30">
                    <td className="p-3">
                      <strong className="text-white block font-bold">{rev.authorName}</strong>
                      <span className="text-slate-400 text-[11px]">{rev.neighborhood}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-300 max-w-sm">
                      <p className="line-clamp-2 italic text-xs">&quot;{rev.comment}&quot;</p>
                    </td>
                    <td className="p-3 text-slate-400">{rev.purchasedVehicle || "-"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleReviewPublish(rev.id, rev.isPublished)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                          rev.isPublished
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-900 text-slate-500 border border-slate-700"
                        }`}
                      >
                        {rev.isPublished ? "Visível no Site" : "Oculto"}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          if (confirm("Excluir esta avaliação?")) {
                            await fetch(`/api/reviews?id=${rev.id}`, { method: "DELETE" });
                            showFeedback("Depoimento excluído.");
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 7: SETTINGS & BACKUP */}
        {activeTab === "settings" && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Configurações & Manutenção</h3>
              <p className="text-xs text-slate-400">
                Gerencie dados mestres e restaure o banco de dados caso necessário.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-400" />
                Restaurar Estoque Padrão da Loja
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Esta ação recarrega o catálogo original de 12 veículos com fotos HD, laudos cautelares, depoimentos e dados completos da Modelo Multimarcas JF.
              </p>
              <button
                onClick={handleResetDatabase}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Restaurar Banco de Dados Padrão
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-sm text-white">Dados da Loja em Juiz de Fora</h4>
              <p><strong>Nome:</strong> {DEALERSHIP_INFO.name}</p>
              <p><strong>WhatsApp:</strong> {DEALERSHIP_INFO.phone}</p>
              <p><strong>Endereço:</strong> {DEALERSHIP_INFO.address}, Juiz de Fora - MG</p>
              <p><strong>Horários:</strong> {DEALERSHIP_INFO.workingHoursWeek}</p>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT VEHICLE MODAL */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setVehicleModalOpen(false)}
          />

          <div className="relative bg-slate-900 text-slate-100 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-700 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingVehicle ? "Editar Veículo do Estoque" : "Cadastrar Novo Veículo"}
              </h3>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Marca *</label>
                  <select
                    required
                    value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  >
                    {COMMON_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Corolla, Onix, Renegade"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Versão *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2.0 XEI Direct Shift"
                    value={vehicleForm.version}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, version: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Ano Fab *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.yearFabrication}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, yearFabrication: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Ano Mod *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.yearModel}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, yearModel: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Preço (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 85900"
                    value={vehicleForm.price}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tabela FIPE (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 89000"
                    value={vehicleForm.fipePrice}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fipePrice: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Km Rodados *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.mileage}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, mileage: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Câmbio</label>
                  <select
                    value={vehicleForm.transmission}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  >
                    {TRANSMISSION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Combustível</label>
                  <select
                    value={vehicleForm.fuel}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuel: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Carroceria</label>
                  <select
                    value={vehicleForm.bodyType}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, bodyType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  >
                    {BODY_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cor</label>
                  <input
                    type="text"
                    placeholder="Ex: Prata, Branco"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Final da Placa</label>
                  <input
                    type="text"
                    maxLength={1}
                    placeholder="Ex: 8"
                    value={vehicleForm.plateEnd}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, plateEnd: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Selo / Badge</label>
                  <select
                    value={vehicleForm.badge}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, badge: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="Seminovo">Seminovo</option>
                    <option value="Destaque">Destaque</option>
                    <option value="Único Dono">Único Dono</option>
                    <option value="Oportunidade">Oportunidade</option>
                    <option value="Garantia">Garantia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="available">Disponível</option>
                    <option value="reserved">Reservado</option>
                    <option value="sold">Vendido</option>
                  </select>
                </div>
              </div>

              {/* Cover image & Gallery */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  URL da Foto Principal (Capa) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={vehicleForm.coverImage}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, coverImage: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 mb-2"
                />

                <label className="block font-semibold text-slate-300 mb-1">
                  Fotos da Galeria (Uma URL por linha)
                </label>
                <textarea
                  rows={3}
                  placeholder="https://imagem1.jpg&#10;https://imagem2.jpg"
                  value={vehicleForm.gallery}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, gallery: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {/* Equipment Checklist */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Itens e Opcionais
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {COMMON_FEATURES_LIST.map((feat) => {
                    const isChecked = vehicleForm.features.includes(feat);
                    return (
                      <label key={feat} className="flex items-center gap-1.5 text-[11px] text-slate-300 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setVehicleForm({ ...vehicleForm, features: [...vehicleForm.features, feat] });
                            } else {
                              setVehicleForm({
                                ...vehicleForm,
                                features: vehicleForm.features.filter((f) => f !== feat),
                              });
                            }
                          }}
                          className="rounded text-orange-500"
                        />
                        <span className="truncate">{feat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva detalhes, estado dos pneus, revisões, garantia..."
                  value={vehicleForm.description}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={vehicleForm.isFeatured}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, isFeatured: e.target.checked })}
                    className="rounded text-orange-500"
                  />
                  <span>Destaque na Página Inicial</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={vehicleForm.hasInspectionReport}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, hasInspectionReport: e.target.checked })
                    }
                    className="rounded text-orange-500"
                  />
                  <span>Laudo Cautelar 100% Aprovado</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={vehicleForm.singleOwner}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, singleOwner: e.target.checked })}
                    className="rounded text-orange-500"
                  />
                  <span>Único Dono</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={vehicleForm.ipvaPaid}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, ipvaPaid: e.target.checked })}
                    className="rounded text-orange-500"
                  />
                  <span>IPVA 2025 Pago</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer"
                >
                  {editingVehicle ? "Salvar Alterações" : "Cadastrar Veículo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
