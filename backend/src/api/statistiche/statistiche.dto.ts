import * as z from "zod";

export const statisticheAcademyRequirements = z.object({
  query: z.object({
    mese: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Formato mese non valido (atteso YYYY-MM)")
      .optional(),
    categoria: z.string().min(1).max(100).optional(),
    dipendenteId: z.coerce.number().int().positive().optional(),
  }),
});

export type StatisticheAcademyFilters = {
  mese?: string;
  categoria?: string;
  dipendenteId?: number;
};

export type StatisticaAcademyRow = {
  mese: string;
  categoria: string;
  numeroAssegnazioni: number;
  numeroCompletamenti: number;
  percentualeCompletamento: number;
};
