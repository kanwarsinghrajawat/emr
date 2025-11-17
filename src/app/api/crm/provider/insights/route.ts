import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { providerInsightsQuery } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const payload = providerInsightsQuery.parse({
      npi: url.searchParams.get("npi"),
    });

    const provider = await prisma.provider.findUnique({
      where: { npi: payload.npi },
      include: { stats: true, interactions: true },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const avgReimb =
      provider.stats.reduce((sum, stat) => sum + stat.reimb, 0) /
      (provider.stats.length || 1);

    const insights = [
      {
        title: "High ROM Yield",
        body: `Average reimbursement ${avgReimb.toFixed(0)} USD. Prioritize follow-up within 7 days of release.`,
      },
      {
        title: "Engagement cadence",
        body: provider.interactions.length > 0
          ? `Last interaction ${new Date(provider.interactions[0].createdAt).toLocaleDateString()}. Keep cadence bi-weekly.`
          : "No interactions logged. Add one after your next call.",
      },
    ];

    return NextResponse.json(insights);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch insights" }, { status: 400 });
  }
}
