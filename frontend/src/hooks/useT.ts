import { useTranslation } from "react-i18next";

export function useT() {
    const { t } = useTranslation();

    return (key: string, options?: Record<string, any>): string =>
        t(key, options);
}
