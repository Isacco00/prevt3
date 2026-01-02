import {api} from '@/api/index';

import {AvatarUploadResponse, UserBean} from '@/types/profile';

const entryPoint = "/profile";

export const ProfileAPI = {

    getProfile: async (): Promise<UserBean> => {
        const res = await api.get(entryPoint + '/getProfile');
        return res.data;
    },

    saveProfile: async (profile: UserBean): Promise<void> => {
        await api.post(entryPoint + '/saveProfile', profile);
    },

    uploadAvatar: async (file: Blob): Promise<AvatarUploadResponse> => {
        const formData = new FormData();
        formData.append("file", file, "avatar.png");

        const res = await api.post<AvatarUploadResponse>(
            entryPoint + "/saveAvatar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data;
    },
};
