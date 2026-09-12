import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { and, desc, asc, gte, lte, ilike, or, eq, sql } from "drizzle-orm";
import { getLocalVehicles, addLocalVehicle } from "@/lib/vehiclesStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const yearMin = searchParams.get("yearMin");
  const yearMax = searchParams.get("yearMax");
  const transmission = searchParams.get("transmission");
  const fuel = searchParams.get("fuel");
  const bodyType = searchParams.get("bodyType");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "recent";
  const status = searchParams.get("status");
  const featuredOnly = searchParams.get("featuredOnly") === "true";

  try {
    // Check if db has records, if not, auto seed
    const countCheck = await db.select({ count: sql<number>`count(*)` }).from(vehicles);
    if (Number(countCheck[0]?.count || 0) === 0) {
      await seedDatabase(false);
    }

    const conditions = [];

    if (status && status !== "all") {
      conditions.push(eq(vehicles.status, status));
    }

    if (featuredOnly) {
      conditions.push(eq(vehicles.isFeatured, true));
    }

    if (brand && brand !== "" && brand !== "Todas" && brand !== "Todos") {
      conditions.push(eq(vehicles.brand, brand));
    }

    if (model) {
      conditions.push(ilike(vehicles.model, `%${model}%`));
    }

    if (priceMin) {
      conditions.push(gte(vehicles.price, priceMin));
    }

    if (priceMax) {
      conditions.push(lte(vehicles.price, priceMax));
    }

    if (yearMin) {
      conditions.push(gte(vehicles.yearFabrication, parseInt(yearMin, 10)));
    }

    if (yearMax) {
      conditions.push(lte(vehicles.yearFabrication, parseInt(yearMax, 10)));
    }

    if (transmission && transmission !== "Todos") {
      conditions.push(eq(vehicles.transmission, transmission));
    }

    if (fuel && fuel !== "Todos") {
      conditions.push(eq(vehicles.fuel, fuel));
    }

    if (bodyType && bodyType !== "Todos") {
      conditions.push(eq(vehicles.bodyType, bodyType));
    }

    if (search && search.trim() !== "") {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(vehicles.brand, q),
          ilike(vehicles.model, q),
          ilike(vehicles.version, q),
          ilike(vehicles.color, q),
          ilike(vehicles.description, q)
        )
      );
    }

    let orderClause = desc(vehicles.createdAt);
    if (sortBy === "price_asc") {
      orderClause = asc(vehicles.price);
    } else if (sortBy === "price_desc") {
      orderClause = desc(vehicles.price);
    } else if (sortBy === "year_desc") {
      orderClause = desc(vehicles.yearFabrication);
    } else if (sortBy === "km_asc") {
      orderClause = asc(vehicles.mileage);
    }

    const query = db.select().from(vehicles);
    const results = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(orderClause)
      : await query.orderBy(orderClause);

    return NextResponse.json(results);
  } catch (error) {
    // Database offline ou não configurado: lê da persistência local
    let localList = getLocalVehicles();

    if (status && status !== "all") {
      localList = localList.filter((v: any) => v.status === status);
    }
    if (featuredOnly) {
      localList = localList.filter((v: any) => Boolean(v.isFeatured));
    }
    if (brand && brand !== "" && brand !== "Todas" && brand !== "Todos") {
      localList = localList.filter((v: any) => v.brand.toLowerCase() === brand.toLowerCase());
    }
    if (model) {
      localList = localList.filter((v: any) => v.model.toLowerCase().includes(model.toLowerCase()));
    }
    if (priceMin) {
      localList = localList.filter((v: any) => parseFloat(v.price) >= parseFloat(priceMin));
    }
    if (priceMax) {
      localList = localList.filter((v: any) => parseFloat(v.price) <= parseFloat(priceMax));
    }
    if (yearMin) {
      localList = localList.filter((v: any) => v.yearFabrication >= parseInt(yearMin, 10));
    }
    if (yearMax) {
      localList = localList.filter((v: any) => v.yearFabrication <= parseInt(yearMax, 10));
    }
    if (transmission && transmission !== "Todos") {
      localList = localList.filter((v: any) => v.transmission === transmission);
    }
    if (fuel && fuel !== "Todos") {
      localList = localList.filter((v: any) => v.fuel === fuel);
    }
    if (bodyType && bodyType !== "Todos") {
      localList = localList.filter((v: any) => v.bodyType === bodyType);
    }
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      localList = localList.filter((v: any) =>
        `${v.brand} ${v.model} ${v.version} ${v.color} ${v.description}`.toLowerCase().includes(q)
      );
    }

    // Ordenação
    if (sortBy === "price_asc") {
      localList.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price_desc") {
      localList.sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "year_desc") {
      localList.sort((a: any, b: any) => b.yearFabrication - a.yearFabrication);
    } else if (sortBy === "km_asc") {
      localList.sort((a: any, b: any) => a.mileage - b.mileage);
    }

    return NextResponse.json(localList);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Format required fields
    const newVehicle = {
      brand: body.brand,
      model: body.model,
      version: body.version || "",
      yearFabrication: parseInt(body.yearFabrication || body.yearModel || 2022, 10),
      yearModel: parseInt(body.yearModel || body.yearFabrication || 2022, 10),
      price: String(body.price),
      fipePrice: body.fipePrice ? String(body.fipePrice) : null,
      mileage: parseInt(body.mileage || 0, 10),
      fuel: body.fuel || "Flex",
      transmission: body.transmission || "Automático",
      color: body.color || "Prata",
      bodyType: body.bodyType || "Hatch",
      plateEnd: body.plateEnd || null,
      doors: parseInt(body.doors || 4, 10),
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
      gallery: Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : (typeof body.gallery === "string" ? body.gallery : JSON.stringify([body.coverImage])),
      features: Array.isArray(body.features) ? JSON.stringify(body.features) : (typeof body.features === "string" ? body.features : JSON.stringify([])),
      description: body.description || "Veículo seminovo revisado com garantia Modelo Multimarcas JF.",
      isFeatured: Boolean(body.isFeatured),
      badge: body.badge || "Seminovo",
      hasInspectionReport: body.hasInspectionReport !== undefined ? Boolean(body.hasInspectionReport) : true,
      singleOwner: Boolean(body.singleOwner),
      ipvaPaid: body.ipvaPaid !== undefined ? Boolean(body.ipvaPaid) : true,
      status: body.status || "available",
    };

    try {
      const inserted = await db.insert(vehicles).values(newVehicle).returning();
      return NextResponse.json(inserted[0], { status: 201 });
    } catch (dbErr) {
      console.warn("DB offline, persistindo veículo no armazenamento local:", dbErr);
      const savedLocal = addLocalVehicle(newVehicle);
      return NextResponse.json(savedLocal, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/vehicles error:", error);
    return NextResponse.json({ error: "Erro ao cadastrar veículo" }, { status: 500 });
  }
}
