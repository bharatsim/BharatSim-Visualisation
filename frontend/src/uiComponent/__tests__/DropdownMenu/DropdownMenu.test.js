import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import DropdownMenu from '../../dropdownMenu/DropdownMenu';
import withThemeProvider from '../../../theme/withThemeProvider';
import deleteIcon from '../../../assets/images/delete.svg';

describe('<DropdownMenu />', () => {
  const DropdownMenuComponent = withThemeProvider(DropdownMenu);
  it('should match snapshot', () => {
    const { container } = render(
      <DropdownMenuComponent
        anchorEl={null}
        closeMenu={jest.fn()}
        menuItems={[
          {
            label: 'Delete Dashboard',
            icon: <img src={deleteIcon} alt="delete-logo" />,
            onClick: jest.fn(),
            dataTestId: `delete-option-test-id`,
          },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should call onclick action of menu item on click of option', () => {
    const mockClickFunction = jest.fn();
    const { getByTestId } = render(
      <DropdownMenuComponent
        anchorEl={document.createElement('div')}
        closeMenu={jest.fn()}
        menuItems={[
          {
            label: 'Delete Dashboard',
            icon: <img src={deleteIcon} alt="delete-logo" />,
            onClick: mockClickFunction,
            dataTestId: `delete-option-test-id`,
          },
        ]}
      />,
    );
    const option = getByTestId('delete-option-test-id');
    fireEvent.click(option);
    expect(mockClickFunction).toHaveBeenCalled();
  });
});
