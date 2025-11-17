import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { providerGetQuery } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const payload = providerGetQuery.parse({
      npi: url.searchParams.get("npi"),
    });

    const provider = await prisma.provider.findUnique({
      where: { npi: payload.npi },
      include: {
        rep: true,
        notes: { orderBy: { createdAt: "desc" }, take: 10 },
        interactions: { orderBy: { createdAt: "desc" }, take: 10 },
        stats: { orderBy: { period: "desc" }, take: 20 },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch provider" }, { status: 400 });
  }
}
