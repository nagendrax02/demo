import { useEffect, useRef, useState } from 'react';
import {
  IIntersectionObserverOptions,
  IIntersectionState
} from './use-intersection-observer.types';

const useIntersectionObserver = (options: IIntersectionObserverOptions): IIntersectionState => {
  const [isInView, setIsInView] = useState(false);
  const intersectionRef = useRef<HTMLDivElement>(null);

  const onIntersectionChange: IntersectionObserverCallback = (entries) => {
    const [entry] = entries;
    setIsInView(entry?.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersectionChange, options);
    const observableElement = intersectionRef?.current;
    if (observableElement) {
      observer?.observe?.(observableElement);
    }

    return () => {
      if (observableElement) {
        observer?.unobserve?.(observableElement);
      }
    };
  }, [options]);

  return { isInView, intersectionRef };
};

export default useIntersectionObserver;
