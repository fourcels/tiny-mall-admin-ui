import axios from 'axios';
import Router from 'next/router'
import notistack from './notistack';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
axios.interceptors.request.use(function (config) {
    if (localStorage && localStorage.token) {
        config.headers.Authorization = `Bearer ${localStorage.token}`
    }
    return config;
});

axios.interceptors.response.use((response) => response, (error) => {
    if (401 === error.response.status) {
        Router.push('/sign-in')
    }
    return Promise.reject(error);

})