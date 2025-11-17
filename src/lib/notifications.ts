import { NotificationKind, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function emitNotification(params: {
  repEmail?: string;
  kind: NotificationKind;
  payload: Prisma.JsonObject;
}) {
  return prisma.notification.create({
    data: {
      repEmail: params.repEmail,
      kind: params.kind,
      payload: params.payload,
    },
  });
}
