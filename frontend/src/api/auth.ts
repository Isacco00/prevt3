import {AuthUser} from '@/types/auth';
import {api} from "@/api/index.ts";

const entryPoint = "/auth";

export const AuthAPI = {
    login: async (email: string, password: string): Promise<AuthUser> => {
        const res = await api.post(entryPoint + '/login', { email, password });
        return res.data;
    },

    logout: async (): Promise<void> => {
        await api.post(entryPoint + '/logout');
    },

    loggedUser: async (): Promise<AuthUser> => {
        const res = await api.get(entryPoint + '/loggedUser');
        return res.data;
    },

};
