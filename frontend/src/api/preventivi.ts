import { api } from '@/api/index';

export function getPreventivi() {
    return api.get("/preventivi");
}
