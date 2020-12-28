import { startLoader, stopLoader, hideErrors, showErrors } from '../actions';
import reducer from '../reducer';

describe('LoaderOrError Reducer ', () => {
  const initialState = { loaderCount: 0, isError: false, errorConfig: null };

  it('should increase loader count on startLoader', () => {
    const nextState = reducer(initialState, startLoader());
    expect(nextState).toEqual({ ...initialState, loaderCount: 1 });
  });
  it('should decrease loader count on stopLoader', () => {
    const nextState = reducer({ ...initialState, loaderCount: 1 }, stopLoader());
    expect(nextState).toEqual(initialState);
  });
  it('should not decrease loader count to negative on startLoader', () => {
    const nextState = reducer(initialState, stopLoader());
    expect(nextState).toEqual(initialState);
  });

  it('should stop loaders and show error on showError', () => {
    const error = { message: 'error' };
    const nextState = reducer({ ...initialState, loaderCount: 1 }, showErrors(error));
    expect(nextState).toEqual({ loaderCount: 0, isError: true, errorConfig: error });
  });

  it('should remove error on hideError', () => {
    const error = { message: 'error' };
    const nextState = reducer({ loaderCount: 0, isError: true, errorConfig: error }, hideErrors());
    expect(nextState).toEqual(initialState);
  });
});
