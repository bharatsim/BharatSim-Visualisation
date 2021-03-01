import { act, renderHook } from '@testing-library/react-hooks';
import useToggle from '../useToggle';

describe('Use Toggle hook', () => {
  it('should return false as initial state', () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.state).toEqual(false);
  });

  it('should return default state if provided', () => {
    const { result } = renderHook(() => useToggle(true));

    expect(result.current.state).toEqual(true);
  });

  it('should return toggle state', () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current.toggleState();
    });

    expect(result.current.state).toEqual(false);
  });

  it('should return toggle state with provided state', () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current.toggleState(true);
    });

    expect(result.current.state).toEqual(true);
  });
});
