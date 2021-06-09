export const START_LOADER = 'START_LOADER';
export const STOP_LOADER = 'STOP_LOADER';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';

export const startLoader = () => ({
  type: START_LOADER,
});

export const stopLoader = () => ({
  type: STOP_LOADER,
});

export const showErrors = (errorConfig) => ({
  type: SHOW_ERROR,
  errorConfig,
});

export const hideErrors = () => ({
  type: HIDE_ERROR,
});
