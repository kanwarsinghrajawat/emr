import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { providerNoteSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = providerNoteSchema.parse(body);

    const note = await prisma.providerNote.create({
      data: {
        providerNpi: payload.npi,
        body: payload.body,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to add note" }, { status: 400 });
  }
}
