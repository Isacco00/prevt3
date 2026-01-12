import {api} from "@/api/index.ts";
import {UserBean} from "@/types/profile.ts";

const entryPoint = "/auth";

export const AuthAPI = {
    login: async (email: string, password: string): Promise<UserBean> => {
        const res = await api.post(entryPoint + '/login', {email, password});
        return res.data;
    },

    logout: async (): Promise<void> => {
        await api.post(entryPoint + '/logout');
    },

    resetPassword: async (email: string): Promise<void> => {
        await api.post(entryPoint + "/resetPassword", {email});
    },

    confirmResetPassword: async (
        token: string,
        password: string
    ): Promise<void> => {
        await api.post(entryPoint + "/resetPasswordConfirm", {
            token,
            password,
        });
    },
};
