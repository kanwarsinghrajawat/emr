import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { providerUpsertSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = providerUpsertSchema.parse(body);

    const provider = await prisma.provider.upsert({
      where: { npi: payload.npi },
      update: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        specialty: payload.specialty,
        org: payload.org,
        city: payload.city,
        state: payload.state,
        phone: payload.phone,
        fax: payload.fax,
        email: payload.email,
      },
      create: payload,
    });

    return NextResponse.json(provider);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to upsert provider" }, { status: 400 });
  }
}
