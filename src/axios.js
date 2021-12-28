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
    let message = ''
    if (error.response) {
        const { status, data } = error.response
        if (401 === status) {
            Router.push('/sign-in')
            message = data.detail
        } else if (400 === status) {
            message = data.detail
        } else if (422 === status) {
            message = '参数错误'
        }
    } else {
        message = error.message
    }
    message && notistack.error(message)
    return Promise.reject(error);
})
