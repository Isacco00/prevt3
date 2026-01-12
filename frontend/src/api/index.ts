import axios from "axios";

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
        return Promise.reject(err);
    }
);
