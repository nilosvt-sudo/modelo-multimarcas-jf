import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { initialReviews } from "@/db/seed";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const query = db.select().from(reviews);
    const results = all
      ? await query.orderBy(desc(reviews.createdAt))
      : await query.where(eq(reviews.isPublished, true)).orderBy(desc(reviews.createdAt));

    return NextResponse.json(results);
  } catch (error) {
    console.warn("GET /api/reviews: Falha ao conectar ao banco de dados, utilizando fallback de depoimentos:", error);
    const fallbackList = initialReviews.map((item, idx) => ({
      ...item,
      id: idx + 1,
      createdAt: new Date().toISOString(),
    }));
    return NextResponse.json(fallbackList);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.authorName || !body.comment) {
      return NextResponse.json(
        { error: "Nome e depoimento são obrigatórios" },
        { status: 400 }
      );
    }

    const newReview = {
      authorName: body.authorName,
      neighborhood: body.neighborhood || "Juiz de Fora - MG",
      rating: Math.min(5, Math.max(1, parseInt(body.rating || 5, 10))),
      comment: body.comment,
      purchasedVehicle: body.purchasedVehicle || null,
      isPublished: true, // Auto publish for friendly feedback or admin moderated
    };

    const inserted = await db.insert(reviews).values(newReview).returning();
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Erro ao salvar depoimento" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const updated = await db
      .update(reviews)
      .set({ isPublished: Boolean(isPublished) })
      .where(eq(reviews.id, parseInt(id, 10)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/reviews error:", error);
    return NextResponse.json({ error: "Erro ao atualizar status do depoimento" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await db.delete(reviews).where(eq(reviews.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json({ error: "Erro ao excluir avaliação" }, { status: 500 });
  }
}
