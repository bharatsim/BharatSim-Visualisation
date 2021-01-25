import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import WidgetMenu from '../WidgetMenu';
import withThemeProvider from '../../../theme/withThemeProvider';

describe('<widgetMenu>', () => {
  it('should render all the menu', () => {
    const MenuWithProviders = withThemeProvider(WidgetMenu);
    const { getByTestId } = render(<MenuWithProviders onDelete={() => {}} onEdit={() => {}} />);
    fireEvent.click(getByTestId('widget-menu'));

    expect(document.body).toMatchSnapshot();
  });
});
