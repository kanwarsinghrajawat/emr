import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignRepSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = assignRepSchema.parse(body);

    const rep = await prisma.salesRep.findUnique({ where: { email: payload.repEmail } });

    if (!rep) {
      return NextResponse.json({ error: "Rep not found" }, { status: 404 });
    }

    const provider = await prisma.provider.update({
      where: { npi: payload.npi },
      data: { repEmail: payload.repEmail },
    });

    return NextResponse.json(provider);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to assign rep" }, { status: 400 });
  }
}
