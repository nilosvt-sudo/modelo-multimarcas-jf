import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const vehicleId = parseInt(resolvedParams.id, 10);
    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const result = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId));
    if (result.length === 0) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET /api/vehicles/[id] error:", error);
    return NextResponse.json({ error: "Erro ao buscar veículo" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const vehicleId = parseInt(resolvedParams.id, 10);
    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.model !== undefined) updateData.model = body.model;
    if (body.version !== undefined) updateData.version = body.version;
    if (body.yearFabrication !== undefined) updateData.yearFabrication = parseInt(body.yearFabrication, 10);
    if (body.yearModel !== undefined) updateData.yearModel = parseInt(body.yearModel, 10);
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.fipePrice !== undefined) updateData.fipePrice = body.fipePrice ? String(body.fipePrice) : null;
    if (body.mileage !== undefined) updateData.mileage = parseInt(body.mileage, 10);
    if (body.fuel !== undefined) updateData.fuel = body.fuel;
    if (body.transmission !== undefined) updateData.transmission = body.transmission;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.bodyType !== undefined) updateData.bodyType = body.bodyType;
    if (body.plateEnd !== undefined) updateData.plateEnd = body.plateEnd;
    if (body.doors !== undefined) updateData.doors = parseInt(body.doors, 10);
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.gallery !== undefined) {
      updateData.gallery = Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : body.gallery;
    }
    if (body.features !== undefined) {
      updateData.features = Array.isArray(body.features) ? JSON.stringify(body.features) : body.features;
    }
    if (body.description !== undefined) updateData.description = body.description;
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.hasInspectionReport !== undefined) updateData.hasInspectionReport = Boolean(body.hasInspectionReport);
    if (body.singleOwner !== undefined) updateData.singleOwner = Boolean(body.singleOwner);
    if (body.ipvaPaid !== undefined) updateData.ipvaPaid = Boolean(body.ipvaPaid);
    if (body.status !== undefined) updateData.status = body.status;

    const updated = await db
      .update(vehicles)
      .set(updateData)
      .where(eq(vehicles.id, vehicleId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PUT /api/vehicles/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar veículo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const vehicleId = parseInt(resolvedParams.id, 10);
    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const deleted = await db
      .delete(vehicles)
      .where(eq(vehicles.id, vehicleId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Veículo removido com sucesso" });
  } catch (error) {
    console.error("DELETE /api/vehicles/[id] error:", error);
    return NextResponse.json({ error: "Erro ao excluir veículo" }, { status: 500 });
  }
}
