import React from 'react';
import Header from './header/Header';

function withAppLayout(WrappedComponent) {
  return function ComponentWithHeader(props) {
    return (
      <div>
        <Header />
        <WrappedComponent {...props} />
      </div>
    );
  };
}

export default withAppLayout;
