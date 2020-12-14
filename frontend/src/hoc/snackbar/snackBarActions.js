import uniqKey from "../../utils/uniqKeyGenerator";
export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export const enqueueSnackbar = (notification) => {
    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
                key: key || uniqKey(),
        },
    };
};


export const removeSnackbar = key => ({
    type: REMOVE_SNACKBAR,
    key,
});
