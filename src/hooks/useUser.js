import useSWRImmutable from 'swr/immutable'
import fetcher from '../fetcher';


export default function useUser() {
    const { data, error, isValidating } = useSWRImmutable("/users/info", fetcher);
    const loading = !data && !error;
    return {
        loading: loading || isValidating,
        user: data,
    };
}
