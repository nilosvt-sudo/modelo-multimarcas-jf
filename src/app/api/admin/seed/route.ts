import { NextResponse } from "next/server";
import { seedDatabase } from "@/db/seed";

export async function POST() {
  try {
    await seedDatabase(true);
    return NextResponse.json({ success: true, message: "Banco de dados restaurado com dados padrão da Apex Motors!" });
  } catch (error) {
    console.error("POST /api/admin/seed error:", error);
    return NextResponse.json({ error: "Erro ao restaurar banco de dados" }, { status: 500 });
  }
}
