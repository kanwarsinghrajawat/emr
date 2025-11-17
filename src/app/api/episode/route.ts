import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const episodeId = url.searchParams.get("episode_id");
    if (!episodeId) {
      return NextResponse.json({ error: "episode_id required" }, { status: 400 });
    }

    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: { attempts: { orderBy: { attemptNo: "asc" } } },
    });

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    return NextResponse.json(episode);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch episode" }, { status: 400 });
  }
}
