import { api } from "./client";

export function getPreventivi() {
    return api.get("/preventivi");
}
