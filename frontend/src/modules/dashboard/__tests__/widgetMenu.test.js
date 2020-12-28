import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import WidgetMenu from '../WidgetMenu';

describe('<widgetMenu>', () => {
  it('should render all the menu', () => {
    const { container, getByTestId } = render(<WidgetMenu onDelete={() => {}} />);
    fireEvent.click(getByTestId('widget-menu'));

    expect(container).toMatchSnapshot();
  });
});
