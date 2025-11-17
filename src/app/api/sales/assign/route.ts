import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignClinicSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = assignClinicSchema.parse(body);

    const rep = await prisma.salesRep.findUnique({ where: { email: payload.repEmail } });

    if (!rep) {
      return NextResponse.json({ error: "Rep not found" }, { status: 404 });
    }

    const assignment = await prisma.clinicAssignment.upsert({
      where: { clinic: payload.clinic },
      update: { repEmail: payload.repEmail },
      create: { clinic: payload.clinic, repEmail: payload.repEmail },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to assign clinic" }, { status: 400 });
  }
}
