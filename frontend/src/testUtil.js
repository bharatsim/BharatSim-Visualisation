/* eslint-disable */
import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './hoc/redux/reducer'
import { fireEvent, within } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ProjectLayoutProvider } from './contexts/projectLayoutContext';

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

export function withProjectLayout(WrappedComponent) {
  return (props) => (
    <ProjectLayoutProvider
      value={{
        projectMetadata: {
          id: '1',
          name: 'project1',
        },
        selectedDashboardMetadata: {
          _id: '1',
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



export function renderWithRedux(
    ui,
    {
        initialState={},
        store = createStore(reducer, initialState),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}
