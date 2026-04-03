import axios from "axios";
import {toast} from "@/hooks/use-toast";
import i18n from "@/i18n";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    silent?: boolean;
  }
}

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let listeners: ((v: boolean) => void)[] = [];
let pending = 0;

export const subscribeApiLoading = (fn: (v: boolean) => void) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
};

const notify = () => {
  const value = pending > 0;
  listeners.forEach(l => l(value));
};

export const apiStart = () => {
  pending++;
  notify();
};

export const apiEnd = () => {
  pending = Math.max(0, pending - 1);
  notify();
};

api.interceptors.request.use(config => {
  apiStart();
  return config;
});

api.interceptors.response.use(
    res => {
      apiEnd();
      return res;
    },
    err => {
      apiEnd();
      if (err.config?.silent) return Promise.reject(err);
      const backendErrors = err?.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        const errorKey = backendErrors[0].message;
        toast({
          title: i18n.t("errors.validation"),
          description: i18n.t(errorKey),
          variant: "destructive",
        });
      } else if (err.response?.status === 401) {
        toast({
          title: i18n.t("errors.sessionExpired"),
          description: i18n.t("errors.loginAgain"),
          variant: "destructive",
        });
        window.location.href = "/login";
      } else {
        toast({
          title: i18n.t("errors.genericTitle"),
          description: i18n.t("errors.generic"),
          variant: "destructive",
        });
      }
      return Promise.reject(err);
    }
);