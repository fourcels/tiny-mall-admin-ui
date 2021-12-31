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


export default function useList(key) {
    const { data, error, isValidating, mutate } = useSWR(key, fetcher, {
        revalidateOnFocus: false
    });
    const loading = !data && !error;
    return {
        loading: loading || isValidating,
        list: [],
        total: -1,
        mutate,
        ...data
    };
}
