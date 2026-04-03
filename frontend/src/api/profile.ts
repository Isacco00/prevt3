import {api} from '@/api/index';

import {AvatarUploadResponse, UserBean, UserRequestBean} from '@/types/profile';

const entryPoint = "/profile";

export const ProfileAPI = {

  getProfile: async (silent?: boolean): Promise<UserBean> => {
    const res = await api.get(entryPoint + '/getProfile', { silent });
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

  getUserList: async (filter: UserRequestBean = {}): Promise<UserBean[]> => {
    const res = await api.post(entryPoint + '/getUserList', filter);
    return res.data;
  },
};
