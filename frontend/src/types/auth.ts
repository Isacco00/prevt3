export interface AuthUser {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    avatarKey?: number; // 👈 SOLO PER FE
}
