import { CorsoAcademy, Prisma, Ruolo } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { corsoCreateDTO, corsoUpdateDTO, CorsoListFilters } from './corsi.dto';
import { NotFoundError, ConflictError } from '../../errors';

export class CorsiService {
  static async getCorsi(
    filters: CorsoListFilters,
    userId: number,
    ruolo: string
  ): Promise<CorsoAcademy[]> {
    const where: Prisma.CorsoAcademyWhereInput = {};

    if (ruolo === Ruolo.DIPENDENTE) {
      
      where.attivo = true;
      where.assegnazioni = { some: { dipendenteId: userId } };

      if (filters.categoria !== undefined) {
        where.categoria = filters.categoria;
      }
      
    } else {
      if (filters.categoria !== undefined) {
        where.categoria = filters.categoria;
      }
      if (filters.attivo !== undefined) {
        where.attivo = filters.attivo;
      }
    }

    return await prisma.corsoAcademy.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  static async getCorsoById(corsoId: number,  userId:number, ruolo:string): Promise<CorsoAcademy> {
    const where: Prisma.CorsoAcademyWhereInput = { id: corsoId };

    if (ruolo === Ruolo.DIPENDENTE) {
      where.assegnazioni = { some: { dipendenteId: userId } };
    }

    const corso = await prisma.corsoAcademy.findFirst({ where });

    if (!corso) {
      throw new NotFoundError('Corso non trovato');
    }

    return corso;
  }

  static async createCorso(data: corsoCreateDTO): Promise<CorsoAcademy> {
    return await prisma.corsoAcademy.create({ data });
  }

  static async updateCorso(corsoId: number, data: corsoUpdateDTO): Promise<CorsoAcademy> {
    await this.findOrThrow(corsoId);

    return await prisma.corsoAcademy.update({
      where: { id: corsoId },
      data,
    });
  }

  static async deleteCorso(corsoId: number): Promise<CorsoAcademy> {
    await this.findOrThrow(corsoId);

    const assegnazioniCollegate = await prisma.assegnazioneCorso.count({
      where: { corsoId },
    });

    if (assegnazioniCollegate > 0) {
      throw new ConflictError(
        'Impossibile eliminare il corso: esistono assegnazioni collegate'
      );
    }

    return await prisma.corsoAcademy.delete({
      where: { id: corsoId },
    });
  }

  static async changeStatusCorso(corsoId: number, attivo: boolean): Promise<CorsoAcademy> {
    await this.findOrThrow(corsoId);

    return await prisma.corsoAcademy.update({
      where: { id: corsoId },
      data: { attivo },
    });
  }

  private static async findOrThrow(corsoId: number): Promise<CorsoAcademy> {
    const corso = await prisma.corsoAcademy.findUnique({
      where: { id: corsoId },
    });

    if (!corso) {
      throw new NotFoundError('Corso non trovato');
    }

    return corso;
  }
}
