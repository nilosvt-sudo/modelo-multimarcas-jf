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
  EyeOff,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  X,
  Phone,
  MessageCircle,
  DollarSign,
  Lock,
  LogOut,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "vehicles" | "leads" | "test_drives" | "appraisals" | "reviews" | "settings"
  >("overview");

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Upload States
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [showManualUrls, setShowManualUrls] = useState(false);

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

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(data.error || "Senha incorreta.");
      }
    } catch {
      setLoginError("Falha na comunicação com o servidor.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Deseja sair do painel administrativo?")) return;
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setLoginPassword("");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Upload foto de capa
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setVehicleForm((prev) => ({ ...prev, coverImage: data.url }));
        showFeedback("Foto de capa carregada com sucesso!");
      } else {
        alert(data.error || "Falha ao enviar a foto");
      }
    } catch (err) {
      console.error("Cover upload error:", err);
      alert("Erro ao fazer upload da foto de capa.");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  // Upload fotos da galeria (múltiplas)
  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingGallery(true);
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.urls)) {
        const existingLines = vehicleForm.gallery
          ? vehicleForm.gallery.split("\n").map((s) => s.trim()).filter(Boolean)
          : [];
        const newGallery = [...existingLines, ...data.urls].join("\n");
        setVehicleForm((prev) => ({ ...prev, gallery: newGallery }));
        showFeedback(`${data.urls.length} fotos adicionadas à galeria!`);
      } else {
        alert(data.error || "Falha ao enviar as fotos");
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
      alert("Erro ao fazer upload das fotos da galeria.");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  // Remover foto individual da galeria
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const urls = vehicleForm.gallery
      ? vehicleForm.gallery.split("\n").map((u) => u.trim()).filter(Boolean)
      : [];
    const updated = urls.filter((_, idx) => idx !== indexToRemove);
    setVehicleForm({ ...vehicleForm, gallery: updated.join("\n") });
  };

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

      let res;
      if (editingVehicle) {
        res = await fetch(`/api/vehicles/${editingVehicle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Erro ao salvar veículo no estoque.");
        return;
      }

      showFeedback(editingVehicle ? "Veículo atualizado com sucesso!" : "Veículo cadastrado no estoque!");
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
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Erro ao excluir veículo.");
        return;
      }
      showFeedback("Veículo excluído do estoque.");
      loadAllData();
    } catch (e) {
      console.error("Error deleting vehicle:", e);
    }
  };

  // Quick toggle status
  const handleToggleVehicleStatus = async (vehicle: Vehicle, newStatus: string) => {
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        alert("Erro ao alterar status do veículo.");
        return;
      }
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

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#06070a] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 font-sans transition-colors">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600 mb-3" />
        <p className="text-xs font-speed uppercase tracking-widest text-slate-600 dark:text-slate-400 font-semibold">
          Verificando autorização...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#06070a] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans transition-colors">
        {/* Theme toggle top-right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle variant="pill" />
        </div>

        {/* Background glow racing red */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 transition-colors">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-[#232a38] shadow-md p-1 flex items-center justify-center">
                <img
                  src="/images/logo-oficial.jpg"
                  alt={DEALERSHIP_INFO.name}
                  className="h-14 w-14 object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="font-speed font-black tracking-tight text-2xl text-slate-900 dark:text-white uppercase">
                MODELO
              </span>
              <span className="font-speed font-black tracking-tight text-2xl text-red-600 uppercase">
                MULTIMARCAS
              </span>
            </div>
            <p className="text-[11px] font-speed uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
              Painel de Gestão de Estoque
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Senha de Administrador
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Digite a senha de acesso"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors pr-11 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-speed font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Acessar Painel de Controle"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#232a38] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
              <ChevronLeft className="w-3.5 h-3.5 text-red-500" />
              Voltar ao site
            </Link>
            <span className="text-[10px] font-speed uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Acesso Seguro • JF
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#06070a] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Admin Top Header */}
      <header className="bg-white/95 dark:bg-[#0e1117]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#232a38] sticky top-0 z-30 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 bg-slate-100 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] px-3 py-1.5 rounded-xl transition-all hover:border-red-600/50"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-red-500" />
              <span className="font-medium">Ver Site</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 dark:bg-[#232a38]" />

            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-black border border-slate-200 dark:border-[#232a38] flex items-center justify-center overflow-hidden p-0.5 shrink-0 shadow-md">
                <img
                  src="/images/logo-oficial.jpg"
                  alt="Logo"
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <div className="flex items-center gap-1.5 select-none">
                <span className="font-speed font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-tight">
                  MODELO
                </span>
                <span className="font-speed font-black text-sm sm:text-base text-red-600 uppercase tracking-tight">
                  MULTIMARCAS
                </span>
                <span className="hidden md:inline-block text-[10px] bg-red-600/10 border border-red-600/30 text-red-600 dark:text-red-400 font-speed font-bold uppercase px-2 py-0.5 rounded-full ml-1.5 tracking-wider">
                  ADMIN
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle variant="header" />
            <button
              onClick={loadAllData}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] hover:border-red-600/40 rounded-xl transition-colors cursor-pointer"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-500" : ""}`} />
            </button>
            <button
              onClick={handleOpenAddVehicle}
              className="bg-red-600 hover:bg-red-700 text-white font-speed font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-red-600/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Veículo
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-100 dark:bg-[#151821] hover:bg-red-500/10 dark:hover:bg-red-600/20 hover:text-red-600 dark:hover:text-red-400 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-[#232a38] hover:border-red-600/40 ml-1 font-medium"
              title="Sair do painel"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Feedback Toast */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 font-speed uppercase tracking-wide">
          <CheckCircle className="w-4 h-4" />
          {actionMessage}
        </div>
      )}

      {/* Admin Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-[#232a38] text-xs font-semibold scrollbar-thin">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 font-speed uppercase tracking-wide text-xs ${
              activeTab === "overview"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Visão Geral
          </button>

          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 font-speed uppercase tracking-wide text-xs ${
              activeTab === "vehicles"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CarFront className="w-4 h-4" />
            Estoque
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "vehicles" ? "bg-white text-red-600" : "bg-slate-200 dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-700 dark:text-slate-300"
              }`}
            >
              {vehiclesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 font-speed uppercase tracking-wide text-xs ${
              activeTab === "leads"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Propostas e Financiamentos
            {leadsList.filter((l) => l.status === "new").length > 0 && (
              <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                {leadsList.filter((l) => l.status === "new").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("test_drives")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 font-speed uppercase tracking-wide text-xs ${
              activeTab === "test_drives"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Test-Drives ({testDrivesList.length})
          </button>

          <button
            onClick={() => setActiveTab("appraisals")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 font-speed uppercase tracking-wide text-xs ${
              activeTab === "appraisals"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4" />
            Avaliações / Trocas ({appraisalsList.length})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 font-speed uppercase tracking-wide text-xs ${
              activeTab === "reviews"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Star className="w-4 h-4" />
            Depoimentos ({reviewsList.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0 font-speed uppercase tracking-wide text-xs ${
              activeTab === "settings"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-[#151821] hover:text-slate-900 dark:hover:text-white"
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
              <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] p-5 rounded-2xl hover:border-red-600/30 transition-all shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-speed font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estoque Ativo</span>
                  <CarFront className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-speed font-black text-slate-900 dark:text-white tabular-nums">
                  {stats.availableVehicles} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal font-sans">de {stats.totalVehicles}</span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Veículos visíveis no site</span>
              </div>

              <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] p-5 rounded-2xl hover:border-red-600/30 transition-all shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-speed font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Valor em Pátio</span>
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-speed font-black text-emerald-600 dark:text-emerald-400 truncate tabular-nums">
                  {formatCurrency(stats.inventoryTotalValue)}
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Patrimônio disponível</span>
              </div>

              <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] p-5 rounded-2xl hover:border-red-600/30 transition-all shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-speed font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Propostas</span>
                  <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-speed font-black text-slate-900 dark:text-white tabular-nums">
                  {stats.totalLeads}
                </div>
                <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">{stats.newLeads} novas mensagens</span>
              </div>

              <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] p-5 rounded-2xl hover:border-red-600/30 transition-all shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-speed font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Test-Drives / Trocas</span>
                  <CalendarCheck className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-speed font-black text-slate-900 dark:text-white tabular-nums">
                  {stats.totalTestDrives + stats.totalAppraisals}
                </div>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                  {stats.pendingTestDrives} agendamentos pendentes
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Inventory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Recent Inquiries */}
              <div className="lg:col-span-6 bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-speed font-bold uppercase tracking-wide text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    Propostas Recentes
                  </h3>
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="text-xs font-speed font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Ver todas &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {leadsList.slice(0, 4).map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-slate-50 dark:bg-[#151821] p-3 rounded-xl border border-slate-200 dark:border-[#232a38] flex items-center justify-between gap-3 text-xs hover:border-red-600/30 transition-all"
                    >
                      <div>
                        <strong className="text-slate-900 dark:text-white block font-speed font-bold">{lead.name}</strong>
                        <span className="text-slate-500 dark:text-slate-400">{lead.vehicleName || "Interesse geral"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-speed font-bold uppercase tracking-wider ${
                            lead.status === "new"
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-100 dark:bg-[#06070a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#232a38]"
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
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-sm"
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
              <div className="lg:col-span-6 bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-speed font-bold uppercase tracking-wide text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    Agendamentos de Test-Drive
                  </h3>
                  <button
                    onClick={() => setActiveTab("test_drives")}
                    className="text-xs font-speed font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Ver todos &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {testDrivesList.slice(0, 4).map((td) => (
                    <div
                      key={td.id}
                      className="bg-slate-50 dark:bg-[#151821] p-3 rounded-xl border border-slate-200 dark:border-[#232a38] flex items-center justify-between gap-3 text-xs hover:border-red-600/30 transition-all"
                    >
                      <div>
                        <strong className="text-slate-900 dark:text-white block font-speed font-bold">{td.customerName}</strong>
                        <span className="text-slate-500 dark:text-slate-400">
                          {td.vehicleName} • {td.preferredDate} às {td.preferredTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-speed font-bold uppercase tracking-wider">
                          {td.locationPreference === "dealership" ? "Na Loja" : "Domicílio"}
                        </span>
                        <a
                          href={generateWhatsAppLink(
                            `Olá ${td.customerName}! Confirmando seu test-drive para ${td.vehicleName} no dia ${td.preferredDate}.`,
                            td.customerPhone.replace(/\D/g, "")
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-sm"
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
            <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1 w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Buscar modelo, marca, cor..."
                  value={searchVehicles}
                  onChange={(e) => setSearchVehicles(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white text-xs rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-red-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-3" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-800 dark:text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-600 transition-colors font-medium cursor-pointer"
                >
                  <option value="all">Todos os Status</option>
                  <option value="available">Disponíveis</option>
                  <option value="reserved">Reservados</option>
                  <option value="sold">Vendidos</option>
                </select>

                <button
                  onClick={handleOpenAddVehicle}
                  className="bg-red-600 hover:bg-red-700 text-white font-speed font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 transition-all shadow-lg shadow-red-600/25 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Carro
                </button>
              </div>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl overflow-hidden overflow-x-auto shadow-md dark:shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#151821] text-slate-500 dark:text-slate-400 font-speed uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#232a38]">
                  <tr>
                    <th className="p-3.5">Veículo</th>
                    <th className="p-3.5">Ano</th>
                    <th className="p-3.5">Km</th>
                    <th className="p-3.5">Preço</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Destaque</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#232a38]">
                  {adminFilteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-[#151821]/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.coverImage}
                            alt={vehicle.model}
                            className="w-14 h-10 object-cover rounded-lg bg-black border border-slate-200 dark:border-[#232a38] shrink-0"
                          />
                          <div>
                            <strong className="text-slate-900 dark:text-white block font-speed font-bold text-xs uppercase tracking-tight">
                              {vehicle.brand} {vehicle.model}
                            </strong>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                              {vehicle.version}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                        {vehicle.yearFabrication}/{vehicle.yearModel}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium tabular-nums">
                        {formatMileage(vehicle.mileage)}
                      </td>
                      <td className="p-3.5 font-speed font-black text-red-600 dark:text-red-500 tabular-nums text-sm">
                        {formatCurrency(vehicle.price)}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={vehicle.status}
                          onChange={(e) => handleToggleVehicleStatus(vehicle, e.target.value)}
                          className={`text-[11px] font-speed font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            vehicle.status === "available"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                              : vehicle.status === "reserved"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                              : "bg-slate-100 dark:bg-[#06070a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#232a38]"
                          }`}
                        >
                          <option value="available">Disponível</option>
                          <option value="reserved">Reservado</option>
                          <option value="sold">Vendido</option>
                        </select>
                      </td>
                      <td className="p-3.5">
                        {vehicle.isFeatured ? (
                          <span className="bg-red-600/10 text-red-600 dark:text-red-400 text-[10px] font-speed font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-red-600/30">
                            Sim
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/veiculos/${vehicle.id}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#151821] rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#232a38]"
                            title="Ver no site"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditVehicle(vehicle)}
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-[#151821] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-[#232a38]"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
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
          <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl overflow-hidden overflow-x-auto shadow-md dark:shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151821] text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#232a38] font-speed">
                <tr>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Veículo</th>
                  <th className="p-3.5">Simulação</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Data</th>
                  <th className="p-3.5 text-right">Ação WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#232a38]/60">
                {leadsList.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-[#151821]/50 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-slate-900 dark:text-white block font-bold">{lead.name}</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{lead.phone}</span>
                      {lead.email && <span className="text-slate-400 dark:text-slate-500 text-[10px]">{lead.email}</span>}
                    </td>
                    <td className="p-3.5 text-slate-800 dark:text-slate-200 font-medium font-speed">
                      {lead.vehicleName || "Interesse Geral"}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">
                      {lead.entryAmount ? (
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">Entrada: {formatCurrency(lead.entryAmount)}</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">{lead.installments}x parcelas</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">Contato Geral</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                        className="bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                      >
                        <option value="new">Novo</option>
                        <option value="in_progress">Em Contato</option>
                        <option value="completed">Fechado</option>
                        <option value="lost">Perdido</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={generateWhatsAppLink(
                          `Olá ${lead.name}! Estou entrando em contato da Modelo Multimarcas JF sobre seu interesse no ${lead.vehicleName}.`,
                          lead.phone.replace(/\D/g, "")
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-speed uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
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
          <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl overflow-hidden overflow-x-auto shadow-md dark:shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151821] text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#232a38] font-speed">
                <tr>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Veículo</th>
                  <th className="p-3.5">Data e Hora</th>
                  <th className="p-3.5">Modalidade</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#232a38]/60">
                {testDrivesList.map((td) => (
                  <tr key={td.id} className="hover:bg-slate-50 dark:hover:bg-[#151821]/50 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-slate-900 dark:text-white block font-bold">{td.customerName}</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{td.customerPhone}</span>
                    </td>
                    <td className="p-3.5 text-slate-900 dark:text-white font-semibold font-speed">{td.vehicleName}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-200">
                      <span className="font-bold text-slate-900 dark:text-white">{td.preferredDate}</span> às {td.preferredTime}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 dark:bg-[#151821] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#232a38] px-2 py-0.5 rounded text-[10px] font-medium">
                        {td.locationPreference === "dealership" ? "Loja Av. Rio Branco" : "Em Domicílio"}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={td.status}
                        onChange={(e) => handleUpdateTestDriveStatus(td.id, e.target.value)}
                        className="bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="completed">Realizado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={generateWhatsAppLink(
                          `Olá ${td.customerName}! Confirmamos seu Test-Drive para o ${td.vehicleName} no dia ${td.preferredDate} às ${td.preferredTime}.`,
                          td.customerPhone.replace(/\D/g, "")
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-speed uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
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
          <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl overflow-hidden overflow-x-auto shadow-md dark:shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151821] text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#232a38] font-speed">
                <tr>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Carro do Cliente</th>
                  <th className="p-3.5">Ano / Km / Câmbio</th>
                  <th className="p-3.5">Interesse</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#232a38]/60">
                {appraisalsList.map((ap) => (
                  <tr key={ap.id} className="hover:bg-slate-50 dark:hover:bg-[#151821]/50 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-slate-900 dark:text-white block font-bold">{ap.customerName}</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{ap.customerPhone}</span>
                    </td>
                    <td className="p-3.5 font-bold text-red-600 dark:text-red-500 font-speed text-sm">
                      {ap.tradeBrand} {ap.tradeModel}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">
                      {ap.tradeYear} • {formatMileage(ap.tradeMileage)} • {ap.tradeTransmission}
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {ap.interestedVehicleName || "Venda Direta"}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ap.status}
                        onChange={(e) => handleUpdateAppraisalStatus(ap.id, e.target.value)}
                        className="bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                      >
                        <option value="pending">Pendente</option>
                        <option value="in_review">Em Análise</option>
                        <option value="evaluated">Proposta Enviada</option>
                        <option value="closed">Fechado</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={generateWhatsAppLink(
                          `Olá ${ap.customerName}! Recebemos a avaliação do seu ${ap.tradeBrand} ${ap.tradeModel} (${ap.tradeYear}). Vamos conversar sobre a proposta?`,
                          ap.customerPhone.replace(/\D/g, "")
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-speed uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
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
          <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl overflow-hidden overflow-x-auto shadow-md dark:shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#151821] text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#232a38] font-speed">
                <tr>
                  <th className="p-3.5">Autor</th>
                  <th className="p-3.5">Nota</th>
                  <th className="p-3.5">Depoimento</th>
                  <th className="p-3.5">Carro</th>
                  <th className="p-3.5">Publicado</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#232a38]/60">
                {reviewsList.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50 dark:hover:bg-[#151821]/50 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-slate-900 dark:text-white block font-bold">{rev.authorName}</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{rev.neighborhood}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex text-amber-500 dark:text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-sm">
                      <p className="line-clamp-2 italic text-xs">&quot;{rev.comment}&quot;</p>
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-speed">{rev.purchasedVehicle || "-"}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleReviewPublish(rev.id, rev.isPublished)}
                        className={`px-2.5 py-1 rounded-lg font-speed uppercase text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${
                          rev.isPublished
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40"
                            : "bg-slate-100 dark:bg-[#151821] text-slate-500 border border-slate-200 dark:border-[#232a38]"
                        }`}
                      >
                        {rev.isPublished ? "Visível no Site" : "Oculto"}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={async () => {
                          if (confirm("Excluir esta avaliação?")) {
                            await fetch(`/api/reviews?id=${rev.id}`, { method: "DELETE" });
                            showFeedback("Depoimento excluído.");
                            loadAllData();
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
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
          <div className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl p-6 space-y-6 max-w-2xl shadow-md dark:shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-speed uppercase tracking-wide">
                Configurações e Manutenção
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gerencie dados mestres e restaure o banco de dados caso necessário.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 font-speed">
                <RefreshCw className="w-4 h-4 text-red-500" />
                Restaurar Estoque Padrão da Loja
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Esta ação recarrega o catálogo original de 12 veículos com fotos HD, laudos cautelares, depoimentos e dados completos da Modelo Multimarcas JF.
              </p>
              <button
                onClick={handleResetDatabase}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-speed uppercase font-bold tracking-wider text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                Restaurar Banco de Dados Padrão
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white font-speed uppercase tracking-wide">
                Dados da Loja em Juiz de Fora
              </h4>
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setVehicleModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-[#0e1117] text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200 dark:border-[#232a38] p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#232a38] mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-speed uppercase tracking-wide">
                  {editingVehicle ? "Editar Veículo do Estoque" : "Cadastrar Novo Veículo"}
                </h3>
              </div>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Marca *</label>
                  <select
                    required
                    value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                  >
                    {COMMON_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Corolla, Onix, Renegade"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Versão *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2.0 XEI Direct Shift"
                    value={vehicleForm.version}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, version: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ano Fab *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.yearFabrication}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, yearFabrication: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ano Mod *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.yearModel}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, yearModel: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Preço (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 85900"
                    value={vehicleForm.price}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 font-speed transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tabela FIPE (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 89000"
                    value={vehicleForm.fipePrice}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fipePrice: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 font-speed transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Km Rodados *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.mileage}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, mileage: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Câmbio</label>
                  <select
                    value={vehicleForm.transmission}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                  >
                    {TRANSMISSION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Combustível</label>
                  <select
                    value={vehicleForm.fuel}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuel: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Carroceria</label>
                  <select
                    value={vehicleForm.bodyType}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, bodyType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
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
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cor</label>
                  <input
                    type="text"
                    placeholder="Ex: Prata, Branco"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Final da Placa</label>
                  <input
                    type="text"
                    maxLength={1}
                    placeholder="Ex: 8"
                    value={vehicleForm.plateEnd}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, plateEnd: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Selo / Badge</label>
                  <select
                    value={vehicleForm.badge}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, badge: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                  >
                    <option value="Seminovo">Seminovo</option>
                    <option value="Destaque">Destaque</option>
                    <option value="Único Dono">Único Dono</option>
                    <option value="Oportunidade">Oportunidade</option>
                    <option value="Garantia">Garantia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                  >
                    <option value="available">Disponível</option>
                    <option value="reserved">Reservado</option>
                    <option value="sold">Vendido</option>
                  </select>
                </div>
              </div>

              {/* Cover image & Gallery */}
              <div className="space-y-4">
                {/* Cover Image */}
                <div className="bg-slate-50 dark:bg-[#06070a] p-3.5 rounded-2xl border border-slate-200 dark:border-[#232a38] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      Foto Principal (Capa do Anúncio) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowManualUrls(!showManualUrls)}
                      className="text-[11px] text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer font-medium"
                    >
                      {showManualUrls ? "Ocultar link manual" : "Colar link de imagem"}
                    </button>
                  </div>

                  {/* Preview da Capa */}
                  {vehicleForm.coverImage && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-[#232a38] bg-slate-100 dark:bg-[#151821] group shadow-inner">
                      <img
                        src={vehicleForm.coverImage}
                        alt="Capa do veículo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label
                          htmlFor="cover-file-input"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors shadow-md"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Trocar Foto
                        </label>
                        <button
                          type="button"
                          onClick={() => setVehicleForm({ ...vehicleForm, coverImage: "" })}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remover
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input de arquivo para Capa */}
                  <div>
                    <input
                      type="file"
                      id="cover-file-input"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cover-file-input"
                      className={`w-full border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                        uploadingCover
                          ? "border-red-600/50 bg-red-600/5 text-red-600 dark:text-red-400 pointer-events-none"
                          : "border-slate-300 dark:border-[#232a38] hover:border-red-600/50 hover:bg-slate-100 dark:hover:bg-[#151821]/60 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {uploadingCover ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                          <span>Enviando foto da capa...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-red-500" />
                          <span>{vehicleForm.coverImage ? "Substituir foto do aparelho" : "Escolher foto do celular / computador"}</span>
                        </>
                      )}
                    </label>
                  </div>

                  {showManualUrls && (
                    <input
                      type="url"
                      placeholder="Ou cole a URL direta: https://..."
                      value={vehicleForm.coverImage}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, coverImage: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors"
                    />
                  )}
                </div>

                {/* Gallery */}
                <div className="bg-slate-50 dark:bg-[#06070a] p-3.5 rounded-2xl border border-slate-200 dark:border-[#232a38] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      Galeria de Fotos (Detalhes, Traseira, Interior)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowManualUrls(!showManualUrls)}
                      className="text-[11px] text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer font-medium"
                    >
                      {showManualUrls ? "Ocultar links" : "Colar links"}
                    </button>
                  </div>

                  {/* Thumbnails da galeria */}
                  {(() => {
                    const galleryUrls = vehicleForm.gallery
                      ? vehicleForm.gallery.split("\n").map((u) => u.trim()).filter(Boolean)
                      : [];
                    return (
                      <>
                        {galleryUrls.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 bg-slate-100 dark:bg-[#151821] rounded-xl border border-slate-200 dark:border-[#232a38] max-h-36 overflow-y-auto">
                            {galleryUrls.map((imgUrl, idx) => (
                              <div key={idx} className="relative group rounded-lg overflow-hidden h-16 border border-slate-200 dark:border-[#232a38] bg-slate-200 dark:bg-[#06070a]">
                                <img src={imgUrl} alt={`Galeria ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(idx)}
                                  className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-md opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                                  title="Remover foto"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Input de arquivo para Galeria */}
                  <div>
                    <input
                      type="file"
                      id="gallery-file-input"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFilesUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="gallery-file-input"
                      className={`w-full border-2 border-dashed rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                        uploadingGallery
                          ? "border-red-600/50 bg-red-600/5 text-red-600 dark:text-red-400 pointer-events-none"
                          : "border-slate-300 dark:border-[#232a38] hover:border-red-600/50 hover:bg-slate-100 dark:hover:bg-[#151821]/60 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {uploadingGallery ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                          <span>Enviando fotos da galeria...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 text-red-500" />
                          <span>Adicionar fotos à galeria (selecione uma ou várias)</span>
                        </>
                      )}
                    </label>
                  </div>

                  {showManualUrls && (
                    <textarea
                      rows={2}
                      placeholder="Ou cole uma URL por linha&#10;https://foto1.jpg&#10;https://foto2.jpg"
                      value={vehicleForm.gallery}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, gallery: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 font-mono"
                    />
                  )}
                </div>
              </div>

              {/* Equipment Checklist */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Itens e Opcionais
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-slate-50 dark:bg-[#06070a] rounded-xl border border-slate-200 dark:border-[#232a38]">
                  {COMMON_FEATURES_LIST.map((feat) => {
                    const isChecked = vehicleForm.features.includes(feat);
                    return (
                      <label key={feat} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 select-none cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
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
                          className="rounded text-red-600 focus:ring-red-600 accent-red-600"
                        />
                        <span className="truncate">{feat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva detalhes, estado dos pneus, revisões, garantia..."
                  value={vehicleForm.description}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-600 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={vehicleForm.isFeatured}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, isFeatured: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-600 accent-red-600"
                  />
                  <span>Destaque na Página Inicial</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={vehicleForm.hasInspectionReport}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, hasInspectionReport: e.target.checked })
                    }
                    className="rounded text-red-600 focus:ring-red-600 accent-red-600"
                  />
                  <span>Laudo Cautelar 100% Aprovado</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={vehicleForm.singleOwner}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, singleOwner: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-600 accent-red-600"
                  />
                  <span>Único Dono</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={vehicleForm.ipvaPaid}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, ipvaPaid: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-600 accent-red-600"
                  />
                  <span>IPVA 2026 Pago</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#232a38] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-speed uppercase tracking-wider font-bold shadow-lg shadow-red-600/20 transition-all cursor-pointer"
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
