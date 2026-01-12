import { useEffect, useState } from "react";
import {subscribeApiLoading} from "@/api";

const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
);

export const GlobalApiLoader = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return subscribeApiLoading(setLoading);
    }, []);

    if (!loading) return null;
    return <LoadingOverlay />;
};
