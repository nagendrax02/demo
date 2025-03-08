import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';

const getInitialValue = <T>(key: StorageKey, initialValue: T): T => {
  try {
    const item = getItem<T>(key);
    return item ?? initialValue;
  } catch {
    return initialValue;
  }
};

// Hook for local storage synchronization across tabs
export function useSyncLocalStorage<T>(
  key: StorageKey,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(getInitialValue<T>(key, initialValue));

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (value) => {
      setState((prevState) => {
        const valueToStore = value instanceof Function ? value(prevState) : value;
        setItem<T>(key, valueToStore);
        window.dispatchEvent(new CustomEvent(`local-storage-${key}`, { detail: valueToStore }));
        return valueToStore;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key === key || event.key === null) {
        const parsedValue = getItem<T>(key);
        if (parsedValue) setState(parsedValue);
        else setState(initialValue);
      }
    };

    const handleCustomEvent = (event: CustomEvent): void => {
      setState(event.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(`local-storage-${key}`, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`local-storage-${key}`, handleCustomEvent);
    };
  }, [initialValue, key]);

  return [state, setValue];
}
