import { NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles, leads, testDrives, appraisals, reviews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const totalVehiclesRes = await db.select({ count: sql<number>`count(*)` }).from(vehicles);
    const availableVehiclesRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(vehicles)
      .where(eq(vehicles.status, "available"));
    const soldVehiclesRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(vehicles)
      .where(eq(vehicles.status, "sold"));
    const totalValueRes = await db
      .select({ sum: sql<string>`sum(cast(price as numeric))` })
      .from(vehicles)
      .where(eq(vehicles.status, "available"));

    const totalLeadsRes = await db.select({ count: sql<number>`count(*)` }).from(leads);
    const newLeadsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.status, "new"));

    const totalTestDrivesRes = await db.select({ count: sql<number>`count(*)` }).from(testDrives);
    const pendingTestDrivesRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(testDrives)
      .where(eq(testDrives.status, "pending"));

    const totalAppraisalsRes = await db.select({ count: sql<number>`count(*)` }).from(appraisals);
    const pendingAppraisalsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(appraisals)
      .where(eq(appraisals.status, "pending"));

    const totalReviewsRes = await db.select({ count: sql<number>`count(*)` }).from(reviews);

    return NextResponse.json({
      totalVehicles: Number(totalVehiclesRes[0]?.count || 0),
      availableVehicles: Number(availableVehiclesRes[0]?.count || 0),
      soldVehicles: Number(soldVehiclesRes[0]?.count || 0),
      inventoryTotalValue: Number(totalValueRes[0]?.sum || 0),
      totalLeads: Number(totalLeadsRes[0]?.count || 0),
      newLeads: Number(newLeadsRes[0]?.count || 0),
      totalTestDrives: Number(totalTestDrivesRes[0]?.count || 0),
      pendingTestDrives: Number(pendingTestDrivesRes[0]?.count || 0),
      totalAppraisals: Number(totalAppraisalsRes[0]?.count || 0),
      pendingAppraisals: Number(pendingAppraisalsRes[0]?.count || 0),
      totalReviews: Number(totalReviewsRes[0]?.count || 0),
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Erro ao gerar estatísticas" }, { status: 500 });
  }
}
