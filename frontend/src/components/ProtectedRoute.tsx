import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    // ⏳ Stato iniziale: verifichiamo il token
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // 🔐 Non autenticato → login
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // ✅ Autenticato → contenuto
    return <>{children}</>;
};
