import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

export default (WrappedComponent) => (props) =>
  (
    <Provider store={store}>
      <WrappedComponent {...props} />
    </Provider>
  );
