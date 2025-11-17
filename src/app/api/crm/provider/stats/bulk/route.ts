import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { providerStatsBulkSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = providerStatsBulkSchema.parse(body);

    await prisma.providerStat.deleteMany({ where: { providerNpi: payload.npi } });

    const stats = await prisma.$transaction(
      payload.stats.map((stat) =>
        prisma.providerStat.create({
          data: {
            providerNpi: payload.npi,
            period: stat.period,
            icd10: stat.icd10,
            count: stat.count,
            reimb: stat.reimb,
          },
        })
      )
    );

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to upsert stats" }, { status: 400 });
  }
}
