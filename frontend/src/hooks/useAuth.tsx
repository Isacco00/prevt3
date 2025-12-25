import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api";

interface AuthContextType {
    user: any;
    authLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth outside provider");
    return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // ✅ SOLO bootstrap iniziale
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token });
        }
        setAuthLoading(false);
    }, []);

    // ✅ LOGIN NON TOCCA authLoading
    const signIn = async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser({ email });
    };

    const signOut = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, authLoading, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};
