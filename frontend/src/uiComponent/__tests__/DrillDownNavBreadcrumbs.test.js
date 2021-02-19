import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import DropDownNavBreadcrumbs from '../DrillDownNavBreadcrumbs';

describe('<DrillDownNavBreadcrumbs />', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <DropDownNavBreadcrumbs
        items={[
          { label: 'top level', onClick: jest.fn() },
          { label: 'level 2', onClick: jest.fn() },
          { label: 'level 3', onClick: jest.fn() },
        ]}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should not create button for last element', () => {
    render(
      <DropDownNavBreadcrumbs
        items={[
          { label: 'top level', onClick: jest.fn() },
          { label: 'level 2', onClick: jest.fn() },
          { label: 'level 3', onClick: jest.fn() },
        ]}
      />,
    );

    const allItems = document.getElementsByTagName('li');

    expect(allItems[allItems.length - 1]).toMatchSnapshot();
  });

  it('should called callback on click on clickable list item', () => {
    const callback = jest.fn();
    const { getByText } = render(
      <DropDownNavBreadcrumbs
        items={[
          { label: 'top level', onClick: callback },
          { label: 'level 2', onClick: jest.fn() },
          { label: 'level 3', onClick: jest.fn() },
        ]}
      />,
    );

    const topLevelButton = getByText('top level');
    fireEvent.click(topLevelButton);

    expect(callback).toHaveBeenCalled();
  });
});
