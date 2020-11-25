import { renderHook, act } from '@testing-library/react-hooks';
import useLoader from '../useLoader';

describe('hook useInlineLoader', () => {
  it('should return empty state and message as initial state of loaderOrError', () => {
    const { result } = renderHook(() => useLoader());
    expect(result.current.loadingState).toEqual('');
    expect(result.current.message).toEqual('');
  });

  it('should return loading state and message on startLoader', () => {
    const { result } = renderHook(() => useLoader());
    act(() => {
      result.current.startLoader('loading');
    });

    expect(result.current.loadingState).toEqual('LOADING');
    expect(result.current.message).toEqual('loading');
  });

  it('should stopLoaderAfterSuccess', () => {
    const { result } = renderHook(() => useLoader());
    act(() => {
      result.current.stopLoaderAfterSuccess('success');
    });

    expect(result.current.loadingState).toEqual('SUCCESS');
    expect(result.current.message).toEqual('success');
  });

  it('should stopLoaderAfterError', () => {
    const { result } = renderHook(() => useLoader());
    act(() => {
      result.current.stopLoaderAfterError('error');
    });

    expect(result.current.loadingState).toEqual('ERROR');
    expect(result.current.message).toEqual('error');
  });

  it('should resetLoader', () => {
    const { result } = renderHook(() => useLoader());
    act(() => {
      result.current.stopLoaderAfterSuccess('success');
    });
    expect(result.current.loadingState).toEqual('SUCCESS');
    expect(result.current.message).toEqual('success');

    act(() => {
      result.current.resetLoader();
    });
    expect(result.current.loadingState).toEqual('');
    expect(result.current.message).toEqual('');
  });
});
