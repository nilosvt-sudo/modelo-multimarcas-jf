import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appraisals } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = db.select().from(appraisals);
    const results = status && status !== "all"
      ? await query.where(eq(appraisals.status, status)).orderBy(desc(appraisals.createdAt))
      : await query.orderBy(desc(appraisals.createdAt));

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/appraisals error:", error);
    return NextResponse.json({ error: "Erro ao buscar avaliações" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.tradeBrand || !body.tradeModel || !body.tradeYear) {
      return NextResponse.json(
        { error: "Nome, telefone, marca, modelo e ano do veículo são obrigatórios" },
        { status: 400 }
      );
    }

    const newAppraisal = {
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null,
      tradeBrand: body.tradeBrand,
      tradeModel: body.tradeModel,
      tradeYear: parseInt(body.tradeYear, 10),
      tradeMileage: parseInt(body.tradeMileage || 0, 10),
      tradeTransmission: body.tradeTransmission || "Manual",
      tradeFuel: body.tradeFuel || "Flex",
      tradeColor: body.tradeColor || "",
      tradeCondition: body.tradeCondition || "Bom",
      hasFinancing: Boolean(body.hasFinancing),
      interestedVehicleId: body.interestedVehicleId ? parseInt(body.interestedVehicleId, 10) : null,
      interestedVehicleName: body.interestedVehicleName || null,
      photos: body.photos ? (Array.isArray(body.photos) ? JSON.stringify(body.photos) : body.photos) : null,
      notes: body.notes || "",
      estimatedValue: body.estimatedValue ? String(body.estimatedValue) : null,
      status: "pending",
    };

    const inserted = await db.insert(appraisals).values(newAppraisal).returning();
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/appraisals error:", error);
    return NextResponse.json({ error: "Erro ao enviar avaliação" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, estimatedValue, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (estimatedValue !== undefined) updateData.estimatedValue = estimatedValue ? String(estimatedValue) : null;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await db
      .update(appraisals)
      .set(updateData)
      .where(eq(appraisals.id, parseInt(id, 10)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/appraisals error:", error);
    return NextResponse.json({ error: "Erro ao atualizar avaliação" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await db.delete(appraisals).where(eq(appraisals.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/appraisals error:", error);
    return NextResponse.json({ error: "Erro ao excluir avaliação" }, { status: 500 });
  }
}
