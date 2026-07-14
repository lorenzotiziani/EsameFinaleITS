
import * as z from "zod"

const corsoSchema = z.object({
  titolo: z.string().min(3).max(255),
  descrizione: z.string().max(5000).nullable().optional(),
  categoria: z.string().min(2).max(100),
  durataOre: z.number().int().positive(),
  obbligatorio: z.boolean().default(false),
  attivo: z.boolean().default(true),
});

export const corsoCreateRequirements = z.object({
  body: corsoSchema,
});

export const corsoUpdateRequirements = z.object({
  body: corsoSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Devi modificare almeno un campo',
    }),
});

export const corsoChangeStatusRequirements = z.object({
  body: z.object({
    attivo: z.boolean(),
  }),
});

export const corsoListRequirements = z.object({
  query: z.object({
    categoria: z.string().min(1).max(100).optional(),
    attivo: z.enum(['true', 'false']).optional(),
  }),
});

export type CorsoListFilters = {
  categoria?: string;
  attivo?: boolean;
};

export type corsoCreateDTO = z.infer<typeof corsoCreateRequirements>['body'];
export type corsoUpdateDTO = z.infer<typeof corsoUpdateRequirements>['body'];
export type corsoChangeStatusDTO = z.infer<typeof corsoChangeStatusRequirements>['body'];