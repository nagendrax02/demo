import { useState, useEffect, useRef } from 'react';

interface IUseAsyncOptions {
  enabled?: boolean;
}

interface IUseAsyncResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface IUseAsyncParams<T> {
  asyncFunction: () => Promise<T>;
  options?: IUseAsyncOptions;
}

interface IRunAsyncTaskParams<T> {
  asyncFunctionRef: React.MutableRefObject<() => Promise<T>>;
  setData: (data: T) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  isSubscribed: boolean;
}

const runAsyncTask = async <T>(args: IRunAsyncTaskParams<T>): Promise<void> => {
  const { asyncFunctionRef, setData, setError, setLoading, isSubscribed } = args;

  try {
    setLoading(true);
    setError(null);

    const result = await asyncFunctionRef.current();
    if (isSubscribed) {
      setData(result);
    }
  } catch (err) {
    setError(err.message ?? 'Something went wrong');
  } finally {
    if (isSubscribed) {
      setLoading(false);
    }
  }
};

/**
 * A custom React hook that handles async operations without caching and state management
 *
 * @template T - The type of data returned by the async operation
 * @param {IUseAsyncParams<T>} args - The parameters for the hook
 * @param {() => Promise<T>} args.asyncFunction - The async function to execute
 * @param {IUseAsyncOptions} [args.options] - Optional configuration options
 *
 * @returns {IUseAsyncResult<T>} An object containing the current state of the async operation
 *
 * @example
 * ```typescript
 * const { data, error, loading } = useAsync({
 *   asyncFunction: () => fetch('https://api.example.com/data')
 * });
 * ```
 */
export const useAsync = <T>(args: IUseAsyncParams<T>): IUseAsyncResult<T> => {
  const { asyncFunction, options = {} } = args;
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const asyncFunctionRef = useRef(asyncFunction);
  asyncFunctionRef.current = asyncFunction;

  useEffect(() => {
    if (!enabled) return;
    let isSubscribed = true;

    runAsyncTask({
      asyncFunctionRef,
      setData,
      setError,
      setLoading,
      isSubscribed
    });

    return () => {
      isSubscribed = false;
    };
  }, [enabled]);

  return { data, error, loading };
};
