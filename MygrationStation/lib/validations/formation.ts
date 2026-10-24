import { z } from "zod";

export const residencyStatusSchema = z.enum([
  "ssn_holder",
  "itin_holder",
  "non_resident",
]);

export const step1Schema = z.object({
  residencyStatus: residencyStatusSchema,
});

export const step2Schema = z.object({
  stateCode: z
    .string()
    .length(2, "State code must be 2 characters")
    .toUpperCase(),
});

export const step3Schema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(200, "Business name must be under 200 characters")
    .refine(
      (name) => !/\b(inc\.?|corp\.?|corporation|incorporated)\b/i.test(name),
      "Business name cannot include terms like 'Inc.', 'Corp.', or 'Corporation' for an LLC"
    ),
});

export const memberSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  addressLine1: z.string().min(1, "Address is required").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "City is required").max(100),
  stateProvince: z.string().min(1, "State/Province is required").max(100),
  zipPostal: z.string().min(1, "ZIP/Postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(100),
  ownershipPercentage: z
    .number()
    .min(0.01, "Ownership must be greater than 0%")
    .max(100, "Ownership cannot exceed 100%"),
  idDocumentPath: z.string().optional(),
});

export const step4Schema = z
  .object({
    memberType: z.enum(["single", "multi"]),
    members: z.array(memberSchema).min(1, "At least one member is required"),
    foreignOwned: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.memberType === "single" && data.members.length !== 1) {
        return false;
      }
      return true;
    },
    { message: "Single-member LLC must have exactly one member" }
  )
  .refine(
    (data) => {
      const total = data.members.reduce(
        (sum, m) => sum + m.ownershipPercentage,
        0
      );
      return Math.abs(total - 100) < 0.01;
    },
    { message: "Ownership percentages must total 100%" }
  );

export const ownAgentSchema = z.object({
  name: z.string().min(1, "Agent name is required").max(200),
  addressLine1: z.string().min(1, "Address is required").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(2),
  zip: z.string().min(5, "ZIP code is required").max(10),
});

export const step5Schema = z.discriminatedUnion("registeredAgentChoice", [
  z.object({
    registeredAgentChoice: z.literal("mygrationstation"),
    mygrationstationRegisteredAgentId: z.string().uuid().optional(),
  }),
  z.object({
    registeredAgentChoice: z.literal("own"),
    ownRegisteredAgent: ownAgentSchema,
  }),
]);

export const step6Schema = z.object({
  signatureCompleted: z.literal(true, {
    errorMap: () => ({ message: "You must sign the Articles of Organization" }),
  }),
  docusealSubmissionId: z.string().optional(),
});

export const step7Schema = z.object({
  selectedPlan: z.enum(["standard", "pro", "premium"]),
});

/**
 * Complete formation draft schema for server-side validation.
 */
export const formationDraftSchema = z.object({
  currentStep: z.number().int().min(1).max(8),
  residencyStatus: residencyStatusSchema.optional(),
  stateCode: z.string().length(2).optional(),
  businessName: z.string().optional(),
  members: z.array(memberSchema).optional(),
  memberType: z.enum(["single", "multi"]).optional(),
  foreignOwned: z.boolean().optional(),
  registeredAgentChoice: z.enum(["mygrationstation", "own"]).optional(),
  ownRegisteredAgent: ownAgentSchema.optional(),
  mygrationstationRegisteredAgentId: z.string().uuid().optional(),
  signatureCompleted: z.boolean().optional(),
  docusealSubmissionId: z.string().optional(),
  selectedPlan: z.enum(["standard", "pro", "premium", "formation_only", "formation_ein"]).optional(),
  stripeSessionId: z.string().optional(),
  completedAt: z.string().optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type Step7Data = z.infer<typeof step7Schema>;
export type MemberData = z.infer<typeof memberSchema>;
export type FormationDraftData = z.infer<typeof formationDraftSchema>;
