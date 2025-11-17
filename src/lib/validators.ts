import { z } from "zod";

export const orderSchema = z.object({
  clinic: z.string().min(2),
  provider: z.string().min(2),
  patientName: z.string().min(2),
  patientDob: z.string(),
  patientMrn: z.string().min(2),
  icd10: z.string().min(3),
  mobile: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5),
});

export const progressSchema = z.object({
  episodeId: z.string().cuid(),
  day: z.union([z.literal("1"), z.literal("2"), z.literal("3")]),
});

export const missSchema = z.object({
  episodeId: z.string().cuid(),
});

export const qcRetestSchema = z.object({
  episodeId: z.string().cuid(),
  reason: z.string().min(3),
});

export const releaseSchema = z.object({
  episodeId: z.string().cuid(),
  classification: z.enum(["positive", "negative"]),
  romScore: z.number().int().min(0).max(100),
});

export const salesRepSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  territory: z.string().min(2),
  monthlyGoal: z.number().int().min(1),
  aggressiveness: z.enum(["BASE", "AGGRESSIVE", "STRETCH"]).default("BASE"),
});

export const assignClinicSchema = z.object({
  clinic: z.string().min(2),
  repEmail: z.string().email(),
});

export const salesNotificationQuery = z.object({
  rep_email: z.string().email(),
});

export const salesMetricsQuery = z.object({
  rep_email: z.string().email(),
});

export const providerUpsertSchema = z.object({
  npi: z.string().min(5),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  specialty: z.string().min(2),
  org: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email().optional(),
});

export const assignRepSchema = z.object({
  npi: z.string().min(5),
  repEmail: z.string().email(),
});

export const providerGetQuery = z.object({
  npi: z.string().min(5),
});

export const providerNoteSchema = z.object({
  npi: z.string().min(5),
  body: z.string().min(3),
});

export const providerInteractionSchema = z.object({
  npi: z.string().min(5),
  channel: z.string().min(2),
  summary: z.string().min(3),
});

export const providerStatsBulkSchema = z.object({
  npi: z.string().min(5),
  stats: z.array(
    z.object({
      period: z.string(),
      icd10: z.string(),
      count: z.number().int(),
      reimb: z.number().int(),
    })
  ),
});

export const providerInsightsQuery = z.object({
  npi: z.string().min(5),
});

export type OrderPayload = z.infer<typeof orderSchema>;
