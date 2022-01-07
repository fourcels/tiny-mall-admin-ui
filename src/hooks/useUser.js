import useSWRImmutable from 'swr/immutable'
import fetcher from '../fetcher';


export default function useUser() {
    const { data, error, isValidating } = useSWRImmutable("/auth/user", fetcher);
    const loading = !data && !error;
    return {
        loading: loading || isValidating,
        user: data,
    };
}
