import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salesNotificationQuery } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const payload = salesNotificationQuery.parse({
      rep_email: url.searchParams.get("rep_email"),
    });

    const notifications = await prisma.notification.findMany({
      where: { repEmail: payload.rep_email },
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch notifications" }, { status: 400 });
  }
}
