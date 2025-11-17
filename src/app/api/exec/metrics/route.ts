import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateExecMetrics } from "@/lib/metrics";

export async function GET() {
  try {
    const episodes = await prisma.episode.findMany({
      include: { attempts: true },
    });

    const metrics = calculateExecMetrics(episodes);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch metrics" }, { status: 500 });
  }
}
