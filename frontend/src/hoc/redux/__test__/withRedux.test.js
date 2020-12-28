import React from 'react';
import { useSelector } from 'react-redux';
import { renderWithRedux as render } from '../../../testUtil';
import withRedux from '../withRedux';

function DummyComponent() {
  const notifications = useSelector((state) => state.snackBar.notifications);
  return (
    <div id="testId">
      {'Dummy Component '}
      {notifications.length}
    </div>
  );
}

describe('withRedux', () => {
  const Component = withRedux(DummyComponent);
  it('should be able to access redux state', () => {
    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
  });
});
