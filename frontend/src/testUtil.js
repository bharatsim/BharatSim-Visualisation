/* eslint-disable */
import React from 'react';
import { fireEvent, render as rtlRender, within, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { composeStore } from './hoc/redux/store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ProjectLayoutProvider } from './contexts/projectLayoutContext';

export async function selectDropDownOption(container, dropDownId, optionId) {
  const dropDown = container.getByTestId(dropDownId);
  fireEvent.mouseDown(within(dropDown).getByRole('button'));
  const options = within(
    within(document.getElementById(`menu-${dropDownId}`)).getByRole('listbox'),
  );
  await act(async () => {
    fireEvent.click(options.getByTestId(`${dropDownId}-${optionId}`));
  });
}

export function withRouter(WrappedComponent) {
  const history = createMemoryHistory();
  return (props) => (
    <Router history={history}>
      <WrappedComponent {...props} />
    </Router>
  );
}

export function withProjectLayout(WrappedComponent) {
  return (props) => (
    <ProjectLayoutProvider
      value={{
        projectMetadata: {
          id: '1',
          name: 'project1',
        },
        selectedDashboardMetadata: {
          _id: 'id1',
          name: 'dashboard1',
        },
        addDashboard: jest.fn(),
        deleteDashboard: jest.fn(),
      }}
    >
      <WrappedComponent {...props} />
    </ProjectLayoutProvider>
  );
}

export function renderWithRedux(ui, { store = composeStore(), ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
