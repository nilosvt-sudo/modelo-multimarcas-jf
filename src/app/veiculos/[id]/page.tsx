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
  Gauge,
  Calendar,
  Fuel,
  Cog,
  Palette,
  ShieldCheck,
  CheckCircle,
  CarFront,
  Sparkles,
  Phone,
  CalendarCheck,
  Award,
  FileCheck
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

  const res = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId));
  const car = res[0];
  if (!car) return { title: "Veículo não encontrado" };

  return {
    title: `${car.brand} ${car.model} ${car.version} (${car.yearFabrication}) | ${DEALERSHIP_INFO.name}`,
    description: `Compre ${car.brand} ${car.model} ${car.version} ${car.yearFabrication} por ${formatCurrency(car.price)} na Modelo Multimarcas JF em Juiz de Fora. Laudo cautelar aprovado e garantia.`,
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const vehicleId = parseInt(resolvedParams.id, 10);
  if (isNaN(vehicleId)) notFound();

  const res = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId));
  const vehicle = (res[0] as unknown as Vehicle) || undefined;
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

  const whatsappMessage = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.yearFabrication}) anunciado por ${formatCurrency(vehicle.price)} no site da Modelo Multimarcas JF.`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 flex flex-col pb-24 md:pb-0">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao Estoque Completo
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Photo Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-md relative">
                  <img
                    src={galleryImages[0] || vehicle.coverImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  {vehicle.badge && (
                    <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {vehicle.badge}
                    </span>
                  )}
                </div>

                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle info */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-orange-600 tracking-wider">
                    {vehicle.brand} • {vehicle.yearFabrication}/{vehicle.yearModel}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-sm text-slate-500 mb-4">{vehicle.version}</p>

                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6">
                    {formatCurrency(vehicle.price)}
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-700">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-orange-500" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Km</span>
                        <strong className="text-slate-900">{formatMileage(vehicle.mileage)}</strong>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Cog className="w-4 h-4 text-orange-500" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Câmbio</span>
                        <strong className="text-slate-900">{vehicle.transmission}</strong>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-orange-500" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Combustível</span>
                        <strong className="text-slate-900">{vehicle.fuel}</strong>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-orange-500" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Cor</span>
                        <strong className="text-slate-900">{vehicle.color}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 text-sm transition-all"
                  >
                    <WhatsAppIcon className="w-5 h-5 fill-white" />
                    Proposta / Negociar no WhatsApp
                  </a>

                  <a
                    href={`tel:${DEALERSHIP_INFO.phoneFormatted}`}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-orange-400" />
                    Ligar para a Loja ({DEALERSHIP_INFO.phone})
                  </a>
                </div>
              </div>
            </div>

            {/* Description and Features */}
            <div className="border-t border-slate-100 pt-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Descrição do Veículo</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {vehicle.description}
                </p>
              </div>

              {featuresList.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    Equipamentos e Opcionais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {featuresList.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
