import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { StatisticheAcademyFilters, StatisticaAcademyRow } from './statistiche.dto';

type RawRow = {
  mese: string;
  categoria: string;
  numeroAssegnazioni: number;
  numeroCompletamenti: number;
};

export class StatisticheService {
  static async getRiepilogoAcademy(
    filters: StatisticheAcademyFilters
  ): Promise<StatisticaAcademyRow[]> {
    const conditions: Prisma.Sql[] = [];

    if (filters.mese !== undefined) {
      conditions.push(
        Prisma.sql`to_char(a."dataAssegnazione", 'YYYY-MM') = ${filters.mese}`
      );
    }
    if (filters.categoria !== undefined) {
      conditions.push(Prisma.sql`c."categoria" = ${filters.categoria}`);
    }
    if (filters.dipendenteId !== undefined) {
      conditions.push(Prisma.sql`a."dipendenteId" = ${filters.dipendenteId}`);
    }

    const whereClause = conditions.length
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.empty;

    const rows = await prisma.$queryRaw<RawRow[]>(Prisma.sql`
      SELECT
        to_char(a."dataAssegnazione", 'YYYY-MM')                              AS "mese",
        c."categoria"                                                         AS "categoria",
        COUNT(*)::int                                                         AS "numeroAssegnazioni",
        COUNT(*) FILTER (WHERE a."stato"::text = 'Completato')::int           AS "numeroCompletamenti"
      FROM "AssegnazioneCorso" a
      JOIN "CorsoAcademy" c ON c."id" = a."corsoId"
      ${whereClause}
      GROUP BY to_char(a."dataAssegnazione", 'YYYY-MM'), c."categoria"
      ORDER BY "mese" ASC, c."categoria" ASC
    `);

    return rows.map((r) => ({
      mese: r.mese,
      categoria: r.categoria,
      numeroAssegnazioni: r.numeroAssegnazioni,
      numeroCompletamenti: r.numeroCompletamenti,
      percentualeCompletamento:
        r.numeroAssegnazioni === 0
          ? 0
          : Math.round((r.numeroCompletamenti / r.numeroAssegnazioni) * 10000) / 100,
    }));
  }
}
