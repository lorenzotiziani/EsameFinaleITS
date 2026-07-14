import bcrypt from 'bcrypt';
import { Ruolo, Stati } from '@prisma/client';
import { prisma } from '../src/config/prisma';

// Password comune di test (rispetta le regole del register: maiuscola, minuscola, numero, speciale).
const TEST_PASSWORD = 'Password1!';

async function main() {
  const hashed = await bcrypt.hash(TEST_PASSWORD, 12);

  // Pulizia (ordine coerente con i vincoli FK).
  await prisma.assegnazioneCorso.deleteMany();
  await prisma.corsoAcademy.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.tUtente.deleteMany();

  // --- Utenti ---
  const referente = await prisma.tUtente.create({
    data: {
      nome: 'Giulia',
      cognome: 'Referenti',
      email: 'referente@academy.it',
      password: hashed,
      ruolo: Ruolo.REFERENTE_ACADEMY,
    },
  });

  const mario = await prisma.tUtente.create({
    data: {
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario.rossi@academy.it',
      password: hashed,
      ruolo: Ruolo.DIPENDENTE,
    },
  });

  const laura = await prisma.tUtente.create({
    data: {
      nome: 'Laura',
      cognome: 'Bianchi',
      email: 'laura.bianchi@academy.it',
      password: hashed,
      ruolo: Ruolo.DIPENDENTE,
    },
  });

  // --- Corsi ---
  const sicurezza = await prisma.corsoAcademy.create({
    data: {
      titolo: 'Sicurezza sul lavoro',
      descrizione: 'Formazione generale sulla sicurezza nei luoghi di lavoro.',
      categoria: 'Sicurezza',
      durataOre: 8,
      obbligatorio: true,
      attivo: true,
    },
  });

  const gdpr = await prisma.corsoAcademy.create({
    data: {
      titolo: 'GDPR e Privacy',
      descrizione: 'Trattamento dei dati personali e adempimenti privacy.',
      categoria: 'Privacy',
      durataOre: 4,
      obbligatorio: true,
      attivo: true,
    },
  });

  const comunicazione = await prisma.corsoAcademy.create({
    data: {
      titolo: 'Comunicazione efficace',
      descrizione: 'Tecniche di comunicazione interpersonale e in team.',
      categoria: 'Soft Skills',
      durataOre: 6,
      obbligatorio: false,
      attivo: true,
    },
  });

  const primoSoccorso = await prisma.corsoAcademy.create({
    data: {
      titolo: 'Primo soccorso',
      descrizione: 'Addetti al primo soccorso aziendale.',
      categoria: 'Sicurezza',
      durataOre: 12,
      obbligatorio: true,
      attivo: true,
    },
  });

  // Corso non attivo: non deve essere proponibile per nuove assegnazioni.
  await prisma.corsoAcademy.create({
    data: {
      titolo: 'Excel avanzato',
      descrizione: 'Funzioni avanzate, tabelle pivot e automazioni.',
      categoria: 'Formazione',
      durataOre: 10,
      obbligatorio: false,
      attivo: false,
    },
  });

  // --- Assegnazioni (mix di mesi, categorie e stati per i filtri e le statistiche) ---
  const d = (s: string) => new Date(s + 'T00:00:00.000Z');

  await prisma.assegnazioneCorso.createMany({
    data: [
      // Maggio 2026 - Sicurezza: 2 assegnati, 2 completati (100%)
      {
        corsoId: sicurezza.id,
        dipendenteId: mario.id,
        dataAssegnazione: d('2026-05-05'),
        dataScadenza: d('2026-06-05'),
        stato: Stati.Completato,
        dataCompletamento: d('2026-05-20'),
      },
      {
        corsoId: sicurezza.id,
        dipendenteId: laura.id,
        dataAssegnazione: d('2026-05-05'),
        dataScadenza: d('2026-06-05'),
        stato: Stati.Completato,
        dataCompletamento: d('2026-05-25'),
      },
      // Maggio 2026 - Privacy: 2 assegnati, 0 completati (0%)
      {
        corsoId: gdpr.id,
        dipendenteId: mario.id,
        dataAssegnazione: d('2026-05-10'),
        dataScadenza: d('2026-06-10'),
        stato: Stati.Assegnato,
      },
      {
        corsoId: gdpr.id,
        dipendenteId: laura.id,
        dataAssegnazione: d('2026-05-12'),
        dataScadenza: d('2026-05-20'),
        stato: Stati.Scaduto,
      },
      // Giugno 2026 - Soft Skills: 2 assegnati, 1 completato (50%)
      {
        corsoId: comunicazione.id,
        dipendenteId: mario.id,
        dataAssegnazione: d('2026-06-01'),
        dataScadenza: d('2026-07-01'),
        stato: Stati.Completato,
        dataCompletamento: d('2026-06-15'),
      },
      {
        corsoId: comunicazione.id,
        dipendenteId: laura.id,
        dataAssegnazione: d('2026-06-02'),
        dataScadenza: d('2026-07-02'),
        stato: Stati.Annullato,
      },
      // Giugno 2026 - Sicurezza: 1 assegnato (in corso)
      {
        corsoId: primoSoccorso.id,
        dipendenteId: laura.id,
        dataAssegnazione: d('2026-06-10'),
        dataScadenza: d('2026-07-10'),
        stato: Stati.Assegnato,
      },
      // Luglio 2026 - Sicurezza: 1 assegnato (in corso)
      {
        corsoId: primoSoccorso.id,
        dipendenteId: mario.id,
        dataAssegnazione: d('2026-07-01'),
        dataScadenza: d('2026-08-01'),
        stato: Stati.Assegnato,
      },
    ],
  });

  console.log('Seed completato.');
  console.log('Credenziali di test (password comune: %s)', TEST_PASSWORD);
  console.log('  Referente : referente@academy.it');
  console.log('  Dipendente: mario.rossi@academy.it');
  console.log('  Dipendente: laura.bianchi@academy.it');
}

main()
  .catch((e) => {
    console.error('Errore nel seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
