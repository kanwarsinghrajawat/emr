import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { providerInteractionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = providerInteractionSchema.parse(body);

    const interaction = await prisma.providerInteraction.create({
      data: {
        providerNpi: payload.npi,
        channel: payload.channel,
        summary: payload.summary,
      },
    });

    return NextResponse.json(interaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to log interaction" }, { status: 400 });
  }
}
