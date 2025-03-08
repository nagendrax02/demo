import { useEffect, useState } from 'react';

function useRequest<T>(
  fetchData: (signal: AbortSignal) => Promise<T | null>,
  dependencies: unknown[]
): {
  isLoading: boolean;
  error: Error | null;
  response: T | null;
} {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function handleFetchAndAbort() {
    const abortController = new AbortController();

    async function handleFetch(): Promise<void> {
      try {
        setIsLoading(true);
        setResponse((await fetchData(abortController.signal)) || null);
      } catch (err) {
        setError(err);
        setResponse(null);
      } finally {
        setIsLoading(false);
      }
    }

    handleFetch();

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    isLoading,
    error,
    response
  };
}

export default useRequest;
