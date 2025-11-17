import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salesRepSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = salesRepSchema.parse(body);

    const rep = await prisma.salesRep.upsert({
      where: { email: payload.email },
      update: {
        name: payload.name,
        territory: payload.territory,
        monthlyGoal: payload.monthlyGoal,
        aggressiveness: payload.aggressiveness,
      },
      create: payload,
    });

    return NextResponse.json(rep);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to upsert rep" }, { status: 400 });
  }
}
