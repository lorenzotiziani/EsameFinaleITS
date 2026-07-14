import { AssegnazioneCorso, Prisma, Ruolo, Stati } from '@prisma/client';
import { prisma } from '../../config/prisma';
import {
  AssegnazioneCreateDTO,
  AssegnazioneUpdateDTO,
  AssegnazioneListFilters,
} from './assegnazioni.dto';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors';

const assegnazioneInclude = {
  corso: true,
  dipendente: {
    select: { id: true, nome: true, cognome: true, email: true },
  },
} satisfies Prisma.AssegnazioneCorsoInclude;

type AssegnazioneConRelazioni = Prisma.AssegnazioneCorsoGetPayload<{
  include: typeof assegnazioneInclude;
}>;

export class AssegnazioniService {
  static async getAssegnazioni(
    filters: AssegnazioneListFilters,
    userId: number,
    ruolo: string
  ): Promise<AssegnazioneConRelazioni[]> {
    const where: Prisma.AssegnazioneCorsoWhereInput = {};

    if (ruolo === Ruolo.DIPENDENTE) {
      where.dipendenteId = userId;
    } else if (filters.dipendenteId !== undefined) {
      where.dipendenteId = filters.dipendenteId;
    }

    if (filters.stato !== undefined) {
      where.stato = filters.stato;
    }
    if (filters.corsoId !== undefined) {
      where.corsoId = filters.corsoId;
    }
    if (filters.categoria !== undefined) {
      where.corso = { categoria: filters.categoria };
    }

    return await prisma.assegnazioneCorso.findMany({
      where,
      include: assegnazioneInclude,
      orderBy: { dataScadenza: 'asc' },
    });
  }

  static async getAssegnazioneById(
    id: number,
    userId: number,
    ruolo: string
  ): Promise<AssegnazioneConRelazioni> {
    const where: Prisma.AssegnazioneCorsoWhereInput = { id };

    if (ruolo === Ruolo.DIPENDENTE) {
      where.dipendenteId = userId;
    }

    const assegnazione = await prisma.assegnazioneCorso.findFirst({
      where,
      include: assegnazioneInclude,
    });

    if (!assegnazione) {
      throw new NotFoundError('Assegnazione non trovata');
    }

    return assegnazione;
  }

  static async createAssegnazione(
    data: AssegnazioneCreateDTO
  ): Promise<AssegnazioneConRelazioni> {
    await this.isCorsoAttivo(data.corsoId);
    await this.isDipendente(data.dipendenteId);
    await this.alreadyAssigned(data);

    const dataAssegnazione = data.dataAssegnazione ?? new Date();
    this.assertDate(dataAssegnazione, data.dataScadenza, null);

    // Una nuova assegnazione non può iniziare né scadere prima di oggi.
    const oggi = new Date();
    oggi.setUTCHours(0, 0, 0, 0);
    if (dataAssegnazione < oggi) {
      throw new BadRequestError('La data di assegnazione non può essere precedente a oggi');
    }
    if (data.dataScadenza < oggi) {
      throw new BadRequestError('La data di scadenza non può essere precedente a oggi');
    }

    return await prisma.assegnazioneCorso.create({
      data: {
        corsoId: data.corsoId,
        dipendenteId: data.dipendenteId,
        dataAssegnazione,
        dataScadenza: data.dataScadenza,
        stato: Stati.Assegnato,
      },
      include: assegnazioneInclude,
    });
  }

  static async updateAssegnazione(
    id: number,
    data: AssegnazioneUpdateDTO
  ): Promise<AssegnazioneConRelazioni> {
    const existing = await this.findOrThrow(id);

    if (data.corsoId !== undefined) {
      await this.isCorsoAttivo(data.corsoId);
    }
    if (data.dipendenteId !== undefined) {
      await this.isDipendente(data.dipendenteId);
    }

    const dataAssegnazione = data.dataAssegnazione ?? existing.dataAssegnazione;
    const dataScadenza = data.dataScadenza ?? existing.dataScadenza;
    const dataCompletamento =
      data.dataCompletamento !== undefined
        ? data.dataCompletamento
        : existing.dataCompletamento;

    this.assertDate(dataAssegnazione, dataScadenza, dataCompletamento);

    return await prisma.assegnazioneCorso.update({
      where: { id },
      data,
      include: assegnazioneInclude,
    });
  }

  static async deleteAssegnazione(id: number): Promise<AssegnazioneCorso> {
    await this.findOrThrow(id);

    return await prisma.assegnazioneCorso.delete({
      where: { id },
    });
  }

  static async completaAssegnazione(
    id: number,
    userId: number,
    ruolo: string
  ): Promise<AssegnazioneConRelazioni> {
    const assegnazione = await this.getAssegnazioneById(id, userId, ruolo);

    if (assegnazione.stato === Stati.Annullato) {
      throw new ConflictError('Impossibile completare un\'assegnazione annullata');
    }
    if (assegnazione.stato === Stati.Completato) {
      throw new ConflictError('Assegnazione già completata');
    }

    const dataCompletamento = new Date();
    this.assertDate(assegnazione.dataAssegnazione, assegnazione.dataScadenza, dataCompletamento);

    return await prisma.assegnazioneCorso.update({
      where: { id },
      data: { stato: Stati.Completato, dataCompletamento },
      include: assegnazioneInclude,
    });
  }

  static async annullaAssegnazione(id: number): Promise<AssegnazioneConRelazioni> {
    const existing = await this.findOrThrow(id);

    if (existing.stato === Stati.Annullato) {
      throw new ConflictError('Assegnazione già annullata');
    }

    return await prisma.assegnazioneCorso.update({
      where: { id },
      data: { stato: Stati.Annullato },
      include: assegnazioneInclude,
    });
  }

  private static async isCorsoAttivo(corsoId: number) {
    const corso = await prisma.corsoAcademy.findUnique({ where: { id: corsoId } });
    if (!corso) {
      throw new BadRequestError('Il corso indicato non esiste');
    }
    if (!corso.attivo) {
      throw new ConflictError('Un corso non attivo non può essere assegnato');
    }
    return corso;
  }

  private static async isDipendente(dipendenteId: number) {
    const utente = await prisma.tUtente.findUnique({ where: { id: dipendenteId } });
    if (!utente) {
      throw new BadRequestError('Il dipendente indicato non esiste');
    }
    if (utente.ruolo !== Ruolo.DIPENDENTE) {
      throw new BadRequestError('L\'utente selezionato non è un dipendente');
    }
    return utente;
  }

  private static assertDate(
    dataAssegnazione: Date,
    dataScadenza: Date,
    dataCompletamento: Date | null
  ): void {
    if (dataScadenza < dataAssegnazione) {
      throw new BadRequestError(
        'La data di scadenza non può essere precedente alla data di assegnazione'
      );
    }
    if (dataCompletamento && dataCompletamento < dataAssegnazione) {
      throw new BadRequestError(
        'La data di completamento non può essere precedente alla data di assegnazione'
      );
    }
  }

  private static async findOrThrow(id: number): Promise<AssegnazioneCorso> {
    const assegnazione = await prisma.assegnazioneCorso.findUnique({ where: { id } });
    if (!assegnazione) {
      throw new NotFoundError('Assegnazione non trovata');
    }
    return assegnazione;
  }

  private static async alreadyAssigned(data: AssegnazioneCreateDTO) {
    const { corsoId, dipendenteId } = data;

    const assigned = await prisma.assegnazioneCorso.findFirst({
      where: {
        corsoId,
        dipendenteId,
      },
    });

    if (assigned && assigned.stato !== Stati.Annullato && assigned.stato !== Stati.Completato) {
      throw new ConflictError('Il dipendente è già assegnato a questo corso');
    }
  }
}
