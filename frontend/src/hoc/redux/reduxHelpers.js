const createReducer = (initialState, handlers) => (state = initialState, action) => {
  if (action.type in handlers) {
    return handlers[action.type](state, action);
  }

  return state;
};

export { createReducer };
