import axios from 'axios';
import Router from 'next/router'
import { APIError } from './errors';
import notistack from './notistack';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
axios.interceptors.request.use(function (config) {
    if (localStorage && localStorage.token) {
        config.headers.Authorization = `Bearer ${localStorage.token}`
    }
    return config;
});

axios.interceptors.response.use((response) => response, (error) => {
    let message = '未知错误'
    let status = 500
    if (error.response) {
        status = error.response.status
        if (401 === status) {
            message = '权限错误'
            Router.push('/sign-in')
        } else if (400 === status) {
            message = error.response.data.detail
        } else if (422 === status) {
            message = '参数错误'
        } else if (500 === status) {
            message = '系统错误'
        }
    } else {
        message = error.message
    }
    notistack.error(message)
    return Promise.reject(new APIError(status, message));
})
