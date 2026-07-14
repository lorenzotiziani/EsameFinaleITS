import { Ruolo } from './Ruolo';

export type User = {
    id: number;
    email: string;
    nome: string;
    cognome: string;
    ruolo: Ruolo;
};
