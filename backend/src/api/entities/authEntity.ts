import { Ruolo } from "@prisma/client";

export interface User {
    id: number;
    email: string;
    password: string;
    nome: string;
    cognome: string;
    ruolo: Ruolo;
}
export interface UserSafe {
    id: number;
    email: string;
    nome: string;
    cognome: string;
    ruolo: Ruolo;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
}
export interface JwtPayload {
    userId: number;
    email: string;
    ruolo: string;
    iat?: number;
    exp?: number;
}
export interface RefreshToken {
    id: number;
    token: string;
    userId: number;
    expiresAt: Date;
    isRevoked: boolean | null;
    createdAt: Date;
}