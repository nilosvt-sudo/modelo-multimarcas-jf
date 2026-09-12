import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = db.select().from(leads);
    const results = status && status !== "all"
      ? await query.where(eq(leads.status, status)).orderBy(desc(leads.createdAt))
      : await query.orderBy(desc(leads.createdAt));

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json({ error: "Erro ao buscar leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json({ error: "Nome e telefone são obrigatórios" }, { status: 400 });
    }

    const newLead = {
      vehicleId: body.vehicleId ? parseInt(body.vehicleId, 10) : null,
      vehicleName: body.vehicleName || "Interesse Geral",
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      leadType: body.leadType || "general",
      message: body.message || "",
      entryAmount: body.entryAmount ? String(body.entryAmount) : null,
      installments: body.installments ? parseInt(body.installments, 10) : null,
      status: "new",
      notes: body.notes || "",
    };

    const inserted = await db.insert(leads).values(newLead).returning();
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json({ error: "Erro ao cadastrar proposta" }, { status: 500 });
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
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, parseInt(id, 10)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/leads error:", error);
    return NextResponse.json({ error: "Erro ao atualizar lead" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await db.delete(leads).where(eq(leads.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/leads error:", error);
    return NextResponse.json({ error: "Erro ao excluir lead" }, { status: 500 });
  }
}
