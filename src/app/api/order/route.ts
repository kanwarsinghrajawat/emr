import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitNotification } from "@/lib/notifications";
import { orderSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = orderSchema.parse(body);

    const episode = await prisma.episode.create({
      data: {
        ...payload,
        patientDob: new Date(payload.patientDob),
        status: "OPEN",
      },
    });

    const attempt = await prisma.attempt.create({
      data: {
        episodeId: episode.id,
        attemptNo: 1,
        status: "OPEN",
        day1Status: "OPEN",
        day2Status: "OPEN",
        day3Status: "OPEN",
      },
    });

    const clinicAssignment = await prisma.clinicAssignment.findFirst({
      where: { clinic: payload.clinic },
      include: { rep: true },
    });

    if (clinicAssignment?.repEmail) {
      await emitNotification({
        repEmail: clinicAssignment.repEmail,
        kind: "ORDER_CREATED",
        payload: {
          episodeId: episode.id,
          clinic: payload.clinic,
          provider: payload.provider,
          patient: payload.patientName,
        },
      });
    }

    return NextResponse.json({ episode_id: episode.id, attempt_id: attempt.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create order" }, { status: 400 });
  }
}
