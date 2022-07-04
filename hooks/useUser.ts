import useSWR from 'swr'
import fetcher from './fetcher'
function useUser() {
    const { data, error, mutate } = useSWR(`/api/user`, fetcher)
    return {
        user: data,
        isLoading: !error && !data,
        isError: error,
        refetchUser: mutate
    }
}

export { useUser }