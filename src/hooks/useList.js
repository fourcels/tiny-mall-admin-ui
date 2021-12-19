import useSWR from 'swr';
import axios from 'axios';

async function fetcher(url, params) {
    const res = await axios.get(url, {
        params
    })
    const total = res.headers['x-total']
    return {
        list: res.data,
        total: +total,
    }
};


export default function useList(url, params) {
    const { data, error, mutate } = useSWR([url, params], fetcher, {
        revalidateOnFocus: false
    });
    const loading = !data && !error;
    return {
        loading,
        list: [],
        total: 0,
        mutate,
        ...data
    };
}
