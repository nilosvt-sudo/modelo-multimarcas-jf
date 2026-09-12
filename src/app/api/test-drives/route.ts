import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testDrives } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = db.select().from(testDrives);
    const results = status && status !== "all"
      ? await query.where(eq(testDrives.status, status)).orderBy(desc(testDrives.createdAt))
      : await query.orderBy(desc(testDrives.createdAt));

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/test-drives error:", error);
    return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.preferredDate || !body.preferredTime) {
      return NextResponse.json(
        { error: "Nome, telefone, data e horário são obrigatórios" },
        { status: 400 }
      );
    }

    const newTestDrive = {
      vehicleId: body.vehicleId ? parseInt(body.vehicleId, 10) : null,
      vehicleName: body.vehicleName || "Veículo a confirmar",
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      locationPreference: body.locationPreference || "dealership",
      notes: body.notes || "",
      status: "pending",
    };

    const inserted = await db.insert(testDrives).values(newTestDrive).returning();
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/test-drives error:", error);
    return NextResponse.json({ error: "Erro ao agendar test drive" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await db
      .update(testDrives)
      .set(updateData)
      .where(eq(testDrives.id, parseInt(id, 10)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/test-drives error:", error);
    return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await db.delete(testDrives).where(eq(testDrives.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/test-drives error:", error);
    return NextResponse.json({ error: "Erro ao excluir agendamento" }, { status: 500 });
  }
}
