import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salesMetricsQuery } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const payload = salesMetricsQuery.parse({
      rep_email: url.searchParams.get("rep_email"),
    });

    const rep = await prisma.salesRep.findUnique({ where: { email: payload.rep_email } });

    if (!rep) {
      return NextResponse.json({ error: "Rep not found" }, { status: 404 });
    }

    const assignments = await prisma.clinicAssignment.findMany({
      where: { repEmail: payload.rep_email },
    });

    const clinics = assignments.map((assignment) => assignment.clinic);

    const episodes = clinics.length
      ? await prisma.episode.findMany({ where: { clinic: { in: clinics } } })
      : [];

    const orders = episodes.length;
    const released = episodes.filter((episode) => episode.status === "RELEASED").length;
    const goal = rep.monthlyGoal;
    const percentToGoal = goal > 0 ? Math.min(100, Math.round((released / goal) * 100)) : 0;

    return NextResponse.json({ orders, released, goal, percentToGoal });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch metrics" }, { status: 400 });
  }
}
