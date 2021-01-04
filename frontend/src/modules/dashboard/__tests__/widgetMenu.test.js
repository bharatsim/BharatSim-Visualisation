import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import WidgetMenu from '../WidgetMenu';
import withThemeProvider from '../../../theme/withThemeProvider';

describe('<widgetMenu>', () => {
  it('should render all the menu', () => {
    const MenuWithProviders = withThemeProvider(WidgetMenu);
    const { container, getByTestId } = render(<MenuWithProviders onDelete={() => {}} />);
    fireEvent.click(getByTestId('widget-menu'));

    expect(container).toMatchSnapshot();
  });
});
