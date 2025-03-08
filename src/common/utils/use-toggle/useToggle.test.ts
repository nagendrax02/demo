import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import useToggle from './useToggle';

describe('useToggle', () => {
  it('Should initialize with the default value', () => {
    // Act
    const { result } = renderHook(() => useToggle());

    // Assert
    expect(result.current[0]).toBe(false);
  });

  it('Should initialize with the provided value', () => {
    // Act
    const { result } = renderHook(() => useToggle(true));

    // Assert
    expect(result.current[0]).toBe(true);
  });

  it('Should toggle the value', () => {
    // Act
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current[1]();
    });

    // Assert
    expect(result.current[0]).toBe(true);

    // Act
    act(() => {
      result.current[1]();
    });

    // Assert
    expect(result.current[0]).toBe(false);
  });
});
