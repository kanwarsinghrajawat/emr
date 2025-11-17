import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { qcRetestSchema } from "@/lib/validators";
import { emitNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = qcRetestSchema.parse(body);

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
      data: { status: "ADMIN_RETEST", qcReason: payload.reason },
    });

    await prisma.episode.update({
      where: { id: episode.id },
      data: { status: "ADMIN_RETEST" },
    });

    const nextAttempt = await prisma.attempt.create({
      data: {
        episodeId: episode.id,
        attemptNo: attempt.attemptNo + 1,
        status: "OPEN",
        qcReason: payload.reason,
        day1Status: "OPEN",
        day2Status: "OPEN",
        day3Status: "OPEN",
      },
    });

    const assignment = await prisma.clinicAssignment.findFirst({
      where: { clinic: episode.clinic },
    });

    if (assignment?.repEmail) {
      await emitNotification({
        repEmail: assignment.repEmail,
        kind: "RETEST_TRIGGERED",
        payload: {
          episodeId: episode.id,
          attemptId: nextAttempt.id,
          reason: payload.reason,
        },
      });
    }

    return NextResponse.json({ attempt_id: nextAttempt.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to trigger admin retest" }, { status: 400 });
  }
}
