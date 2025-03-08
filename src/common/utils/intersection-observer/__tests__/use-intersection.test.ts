import { renderHook } from '@testing-library/react';
import useIntersectionObserver from '../use-intersection-observer';

const observe = jest.fn();
const unobserve = jest.fn();

// Mock the IntersectionObserver
class IntersectionObserverMock {
  observe = observe;
  unobserve = unobserve;
}

const options = {
  root: document.body
};

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useRef: () => {
      return {
        current: 'ref'
      };
    }
  };
});

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    window.IntersectionObserver = IntersectionObserverMock as any;
  });

  test('Should observe and unobserve element correctly', () => {
    // Arrange
    const { unmount } = renderHook(() => useIntersectionObserver(options));

    // Assert that observe is called
    expect(observe).toHaveBeenCalled();

    // Unmount the component
    unmount();

    // Assert that unobserve is called
    expect(unobserve).toHaveBeenCalled();
  });
});
