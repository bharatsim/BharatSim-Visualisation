import React from 'react';

export default (props) => (
  <div>
    Table
    <div>{JSON.stringify(props, null, 2)}</div>
  </div>
);
