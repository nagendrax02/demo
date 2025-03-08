interface IIntersectionState {
  isInView: boolean;
  intersectionRef: React.RefObject<HTMLDivElement>;
}

interface IIntersectionObserverOptions {
  root: Element | null;
  rootMargin?: string;
  thresholds?: number[];
}

export type { IIntersectionState, IIntersectionObserverOptions };
