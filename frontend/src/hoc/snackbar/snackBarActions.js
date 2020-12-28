import uniqKey from '../../utils/uniqKeyGenerator';

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export const enqueueSnackbar = (notification) => {
  const { options = {} } = notification;

  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: options.key || uniqKey(),
    },
  };
};

export const removeSnackbar = (key) => ({
  type: REMOVE_SNACKBAR,
  key,
});
