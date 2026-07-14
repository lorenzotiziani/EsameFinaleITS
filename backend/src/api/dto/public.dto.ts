import * as z from "zod";

export const idRequirements = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
});