import {AbstractSearchRequestBean} from "@/types/index.ts";

export interface UserBean {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl?: string | null;
  avatarKey?: number; // 👈 SOLO PER FE
  role: string;
  active: boolean;
}

export interface AvatarUploadResponse {
  avatarUrl: string | null;
}

export type UserRequestBean = AbstractSearchRequestBean