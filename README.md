# Academy Aziendale — Gestione percorsi formativi

Applicazione web full‑stack per la gestione dei percorsi formativi dei dipendenti
(Prova pratica — Web Developer Full Stack).

I referenti Academy creano corsi, li organizzano per categoria e li assegnano ai
dipendenti; i dipendenti consultano i corsi assegnati, le scadenze e li segnano come
completati. È inoltre disponibile un riepilogo statistico dei completamenti per mese
e categoria.

## Stack tecnologico

- **Frontend**: Angular (CSR), Bootstrap, ng2-charts
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Neon) con Prisma ORM
- **Autenticazione**: JWT (access + refresh token)
- **Validazione**: Zod (lato server)

## Applicazione online

- **Frontend**: https://esameits-lorenzo-tiziani.netlify.app
- **Backend**: https://esamefinaleits.onrender.com

## Credenziali di test

Password comune a tutti gli account: **`ProvaEsameITS1!`**

| Ruolo | Email |
|-------|-------|
| Referente Academy | lorenzo.tiziani97@gmail.com |
| Dipendente | ettore.cisco@gmail.com |
| Dipendente | lorenzo.damiani@gmail.com |

## Test delle API

Collezione **Postman** pronta all'uso: [`postman/Academy.postman_collection.json`](postman/Academy.postman_collection.json).

1. Postman → *Import* → seleziona il file.
2. Imposta la variabile di collezione `baseUrl` (produzione già preimpostata; per il
   locale usa `http://localhost:3000/api`).
3. Esegui una richiesta di **Login**: l'access token viene salvato automaticamente e
   usato da tutte le altre chiamate.

## Avvio in locale

### Backend
```bash
cd backend
cp .env.example .env        # poi compila DATABASE_URL e i JWT secret
npm install
npx prisma migrate deploy   # crea le tabelle nel database
npx ts-node prisma/seed.ts  # (opzionale) popola dati di test
npm run dev                 # http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm start                   # http://localhost:4200
```

In locale il frontend usa `src/environments/environment.ts` (backend su
`http://localhost:3000/api`); la build di produzione usa `environment.prod.ts`
(backend su Render) tramite `fileReplacements`.

## Dati iniziali (seed)

Lo script [`backend/prisma/seed.ts`](backend/prisma/seed.ts) crea un set completo di
dati di test: un referente, due dipendenti, alcuni corsi (incluso uno non attivo) e
assegnazioni con stati e mesi diversi, utili a verificare filtri, ruoli e statistiche.
> Attenzione: il seed svuota le tabelle prima di reinserire i dati.

## Struttura del repository

```
backend/    API Express + Prisma (auth, corsi, assegnazioni-corsi, statistiche)
frontend/   applicazione Angular
postman/    collezione per il test delle API
```
