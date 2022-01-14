import useSWRInfinite from 'swr/infinite';
import fetcher from '../fetcher';

export default function useInfinite(getKey, pageSize = 10) {
    const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(
        getKey, fetcher, {
        revalidateOnFocus: false
    });
    const isLoadingInitialData = !data && !error;
    const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < pageSize);
    const isRefreshing = isValidating && data && data.length === size;
    return {
        loading: isLoadingMore,
        hasNextPage: !isReachingEnd,
        error,
        list: data ? [].concat(...data) : [],
        mutate,
        size,
        setSize,
    };
}
