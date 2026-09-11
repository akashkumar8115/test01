import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const kycRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        documentType: z.enum(["license", "passport", "national_id"]),
        fullName: z.string().min(2),
        dateOfBirth: z.string().min(4),
        documentNumber: z.string().min(4),
        nationality: z.string().min(2),
        expiry: z.string().min(4),
      }),
    )
    .mutation(async ({ input }) => {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const stamp = Date.now().toString(36).toUpperCase();
      return {
        status: "pending" as const,
        referenceId: `HRB-${stamp.slice(-8)}`,
        estimatedMinutes: 5,
        submittedName: input.fullName,
      };
    }),
});
