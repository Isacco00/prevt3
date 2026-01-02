export interface UserBean {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatarUrl: string | null;
}

export interface AvatarUploadResponse {
    avatarUrl: string | null;
}

