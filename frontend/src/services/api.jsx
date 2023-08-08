import axios from 'axios';
export const apiCep = axios.create({
    baseURL: import.meta.env.VITE_URL_CEP,
});

export const apiFactoring = axios.create({
    baseURL: import.meta.env.VITE_URL_API,
});
