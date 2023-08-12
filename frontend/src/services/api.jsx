import axios from 'axios';
export const apiCep = axios.create({
    baseURL: 'https://viacep.com.br/ws/',
});

export const apiFactoring = axios.create({
    baseURL: import.meta.env.VITE_URL_API,
});

export const apiBancos = axios.create({
    baseUrl: 'https://brasilapi.com.br/api/banks/v1',
});
