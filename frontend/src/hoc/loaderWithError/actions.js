export const START_LOADER = 'START_LOADER';
export const STOP_LOADER = 'STOP_LOADER';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';

export const startLoader = () => {
  return {
    type: START_LOADER,
  };
};

export const stopLoader = () => {
  return {
    type: STOP_LOADER,
  };
};

export const showErrors = (errorConfig) => {
  return {
    type: SHOW_ERROR,
    errorConfig,
  };
};

export const hideErrors = () => {
  return {
    type: HIDE_ERROR,
  };
};
