import axios from 'axios';
export const apiCep = axios.create({
    baseURL: 'https://viacep.com.br/ws/',
});

export const apiFactoring = axios.create({
    baseURL: 'http://localhost:8000',
});
