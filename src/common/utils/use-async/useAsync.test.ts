import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('Should initialize with default values', () => {
    // Arrange
    const asyncFunction = jest.fn().mockResolvedValue('data');

    // Act
    const { result } = renderHook(() => useAsync({ asyncFunction }));

    // Assert
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(true);
  });

  it('Should set loading state while async function is running', async () => {
    // Arrange
    const asyncFunction = jest.fn().mockResolvedValue('data');

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useAsync({ asyncFunction }));
    act(() => {
      result.current.loading = true;
    });

    // Assert
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
  });

  it('Should set data when async function resolves', async () => {
    // Arrange
    const asyncFunction = jest.fn().mockResolvedValue('data');

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useAsync({ asyncFunction }));
    await waitForNextUpdate();

    // Assert
    expect(result.current.data).toBe('data');
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('Should set error when async function rejects', async () => {
    // Arrange
    const asyncFunction = jest.fn().mockRejectedValue(new Error('error'));

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useAsync({ asyncFunction }));
    await waitForNextUpdate();

    // Assert
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('error');
    expect(result.current.loading).toBe(false);
  });

  it('Should not run async function when disabled', () => {
    // Arrange
    const asyncFunction = jest.fn().mockResolvedValue('data');

    // Act
    const { result } = renderHook(() => useAsync({ asyncFunction, options: { enabled: false } }));

    // Assert
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(asyncFunction).not.toHaveBeenCalled();
  });
});
