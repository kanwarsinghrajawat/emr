import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { progressSchema } from "@/lib/validators";

function resolveDayKey(day: string) {
  if (day === "1") return "day1Status" as const;
  if (day === "2") return "day2Status" as const;
  return "day3Status" as const;
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const payload = progressSchema.parse({
      episodeId: url.searchParams.get("episode_id"),
      day: url.searchParams.get("day") ?? undefined,
    });

    const episode = await prisma.episode.findUnique({
      where: { id: payload.episodeId },
      include: { attempts: { orderBy: { attemptNo: "desc" }, take: 1 } },
    });

    if (!episode || episode.attempts.length === 0) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    const attempt = episode.attempts[0];
    const dayKey = resolveDayKey(payload.day);

    const updatedAttempt = await prisma.attempt.update({
      where: { id: attempt.id },
      data: { [dayKey]: "COMPLETED" },
    });

    const completedAll =
      updatedAttempt.day1Status === "COMPLETED" &&
      updatedAttempt.day2Status === "COMPLETED" &&
      updatedAttempt.day3Status === "COMPLETED";

    if (completedAll) {
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: { status: "COLLECTED" },
      });
      await prisma.episode.update({
        where: { id: payload.episodeId },
        data: { status: "COLLECTED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update progress" }, { status: 400 });
  }
}
