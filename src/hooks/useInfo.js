import useSWR from 'swr';
import fetcher from '../fetcher';


export default function useInfo(key) {
    const { data, error, isValidating, mutate } = useSWR(key, fetcher, {
        revalidateOnFocus: false
    });
    const loading = !data && !error;
    return {
        loading: loading || isValidating,
        isValidating,
        mutate,
        data,
    };
}
