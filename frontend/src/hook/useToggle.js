import { useState } from 'react';

function useToggle(defaultState = false) {
  const [state, setState] = useState(defaultState);

  function toggleState(providedState) {
    setState((prevState) => providedState || !prevState);
  }

  return { state, toggleState };
}

export default useToggle;
