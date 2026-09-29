import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Vehicle } from "@/types";
import { formatCurrency, formatMileage, generateWhatsAppLink, DEALERSHIP_INFO } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import {
  ChevronLeft,
  Calendar,
  Gauge,
  Fuel,
  Workflow,
  ShieldCheck,
  CheckCircle,
  Car,
  Phone,
  Clock,
  Award,
  KeyRound,
  FileCheck2
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const vehicleId = parseInt(resolvedParams.id, 10);
  if (isNaN(vehicleId)) return { title: "Veículo não encontrado" };

  try {
    const res = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId));
    const item = res[0];
    if (!item) return { title: "Veículo não encontrado" };

    return {
      title: `${item.brand} ${item.model} ${item.version} (${item.yearModel}) | ${DEALERSHIP_INFO.name}`,
      description: `Compre seu ${item.brand} ${item.model} na Apex Motors no Brooklin, São Paulo. Laudo cautelar 100% aprovado, garantia e melhores taxas de financiamento.`,
    };
  } catch {
    return { title: `Veículo Seminovo | ${DEALERSHIP_INFO.name}` };
  }
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const vehicleId = parseInt(resolvedParams.id, 10);
  if (isNaN(vehicleId)) notFound();

  let vehicle: Vehicle | undefined;
  try {
    const res = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId));
    vehicle = (res[0] as unknown as Vehicle) || undefined;
  } catch {}

  if (!vehicle) {
    // fallback local read
    try {
      const fs = await import("fs");
      const path = await import("path");
      const raw = fs.readFileSync(path.join(process.cwd(), "data", "vehicles.json"), "utf-8");
      const list = JSON.parse(raw);
      vehicle = list.find((v: any) => Number(v.id) === vehicleId);
    } catch {}
  }

  if (!vehicle) notFound();

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

  const numPrice = typeof vehicle.price === "number" ? vehicle.price : parseFloat(vehicle.price || "0");
  const estimatedMonthly = Math.round((numPrice * 0.7) / 48 * 1.35);

  const yearDisplay = vehicle.yearFabrication
    ? `${vehicle.yearFabrication}/${vehicle.yearModel}`
    : `${vehicle.yearModel}`;

  const whatsappMessage = `Olá Apex Motors! Tenho interesse no veículo "${vehicle.brand} ${vehicle.model} ${vehicle.version} (${yearDisplay})" no valor de ${formatCurrency(vehicle.price)} anunciado no site. Está disponível para visitação?`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 flex flex-col pb-24 md:pb-0">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/#estoque"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 bg-white dark:bg-[#12151d] border border-slate-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao Estoque Completo
            </Link>
          </div>

          <div className="bg-white dark:bg-[#10131a] rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Photo Column */}
              <div className="lg:col-span-7 space-y-3">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800">
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>

                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
                        <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {vehicle.brand} • {vehicle.bodyType}
                    </span>
                    {vehicle.badge && (
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                        {vehicle.badge}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {vehicle.version}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-[#141720] border border-blue-100 dark:border-zinc-800">
                  <span className="text-xs text-slate-500 uppercase font-bold block">
                    Valor à Vista
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                    {formatCurrency(vehicle.price)}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    Ou entrada de 30% + 48x de aprox. <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(estimatedMonthly)}</strong>
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ano / Modelo</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{yearDisplay}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Quilometragem</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{formatMileage(vehicle.mileage)}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Câmbio</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{vehicle.transmission}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-zinc-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Combustível</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{vehicle.fuel}</strong>
                  </div>
                </div>

                {/* Laudo & Garantia Badges */}
                <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300">
                  <FileCheck2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span className="font-semibold">Laudo Cautelar 100% Aprovado • 1 Ano de Garantia para Motor e Câmbio</span>
                </div>

                {/* CTAs */}
                <div className="space-y-2 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>Falar com Vendedor no WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${DEALERSHIP_INFO.phoneLandline.replace(/\D/g, "")}`}
                    className="w-full py-3 bg-slate-100 dark:bg-[#161a22] hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Ligar para a Loja: {DEALERSHIP_INFO.phoneLandline}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="border-t border-slate-200 dark:border-zinc-800 pt-8 space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                  Descrição do Veículo
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                  {vehicle.description}
                </p>
              </div>

              {featuresList.length > 0 && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                    Itens e Opcionais Inclusos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {featuresList.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#141720] border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-slate-200 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
