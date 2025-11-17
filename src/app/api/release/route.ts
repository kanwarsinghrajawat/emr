import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { releaseSchema } from "@/lib/validators";
import { emitNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const episodeId = url.searchParams.get("episode_id") ?? "";
    const body = await request.json();

    const payload = releaseSchema.parse({
      episodeId,
      classification: body.classification,
      romScore: body.romScore,
    });

    const episode = await prisma.episode.findUnique({
      where: { id: payload.episodeId },
      include: { attempts: { orderBy: { attemptNo: "desc" }, take: 1 } },
    });

    if (!episode || episode.attempts.length === 0) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    const attempt = episode.attempts[0];

    await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        status: "RELEASED",
        classification: payload.classification,
        romScore: payload.romScore,
      },
    });

    await prisma.episode.update({
      where: { id: episode.id },
      data: { status: "RELEASED" },
    });

    const assignment = await prisma.clinicAssignment.findFirst({
      where: { clinic: episode.clinic },
    });

    if (assignment?.repEmail) {
      await emitNotification({
        repEmail: assignment.repEmail,
        kind: "RESULT_RELEASED",
        payload: {
          episodeId: episode.id,
          classification: payload.classification,
          romScore: payload.romScore,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to release result" }, { status: 400 });
  }
}
