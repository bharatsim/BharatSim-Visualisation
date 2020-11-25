/* eslint-disable */

import { fireEvent, within } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import React from 'react';

export function selectDropDownOption(container, dropDownId, optionId) {
  const dropDown = container.getByTestId(dropDownId);
  fireEvent.mouseDown(within(dropDown).getByRole('button'));
  const options = within(
    within(document.getElementById(`menu-${dropDownId}`)).getByRole('listbox'),
  );
  fireEvent.click(options.getByTestId(`${dropDownId}-${optionId}`));
}

export function withRouter(WrappedComponent) {
  const history = createMemoryHistory();
  return (props) => (
    <Router history={history}>
      <WrappedComponent {...props} />
    </Router>
  );
}
