import { createContext, useContext, useState, useEffect } from "react";
import { ProfileAPI } from "@/api/profile";
import { AuthUser } from "@/types/auth";
import {AuthAPI} from "@/api/auth.ts";

interface AuthContextType {
    user: AuthUser | null;
    authLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    setAvatarKey: () => void; // 👈
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // 🔑 bootstrap auth
    useEffect(() => {
        const loadUser = async () => {
            try {
                const me = await ProfileAPI.getProfile();
                setUser(me);
            } catch {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        loadUser();
    }, []);

    const signIn = async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            const me = await AuthAPI.login(email, password);
            setUser(me);
        } catch (err) {
            setUser(null);
            throw err; // lascia gestire il toast al chiamante
        } finally {
            setAuthLoading(false);
        }
    };

    const signOut = async () => {
        await AuthAPI.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        const me = await ProfileAPI.getProfile();
        setUser(me);
    };

    const setAvatarKey = () => {
        setUser(prev =>
            prev
                ? { ...prev, avatarKey: Date.now() }
                : prev
        );
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, signIn, signOut, refreshUser, setAvatarKey }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
