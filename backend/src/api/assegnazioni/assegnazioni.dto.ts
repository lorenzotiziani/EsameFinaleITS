import { Stati } from "@prisma/client";
import * as z from "zod";

export const statiEnum = z.enum(Stati);


export const assegnazioneCreateRequirements = z.object({
  body: z.object({
    corsoId: z.number().int().positive(),
    dipendenteId: z.number().int().positive(),
    dataAssegnazione: z.coerce.date().optional(),
    dataScadenza: z.coerce.date(),
  }),
});


export const assegnazioneUpdateRequirements = z.object({
  body: z.object({
      corsoId: z.number().int().positive().optional(),
      dipendenteId: z.number().int().positive().optional(),
      dataAssegnazione: z.coerce.date().optional(),
      dataScadenza: z.coerce.date().optional(),
      stato: statiEnum.optional(),
      dataCompletamento: z.coerce.date().nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Devi modificare almeno un campo",
    }),
});

export const assegnazioneListRequirements = z.object({
  query: z.object({
    stato: statiEnum.optional(),
    categoria: z.string().min(1).max(100).optional(),
    corsoId: z.coerce.number().int().positive().optional(),
    dipendenteId: z.coerce.number().int().positive().optional(),
  }),
});

export type AssegnazioneListFilters = {
  stato?: Stati;
  categoria?: string;
  corsoId?: number;
  dipendenteId?: number;
};

export type AssegnazioneCreateDTO = z.infer<typeof assegnazioneCreateRequirements>["body"];
export type AssegnazioneUpdateDTO = z.infer<typeof assegnazioneUpdateRequirements>["body"];


