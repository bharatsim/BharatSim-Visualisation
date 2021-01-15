import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Dashboard } from '@material-ui/icons';
import ImageOption from '../ImageOption';
import withThemeProvider from '../../theme/withThemeProvider';

const ComponentWithProvider = withThemeProvider(({ icon, label, isSelected, value, onCLick }) => (
  <ImageOption onCLick={onCLick} isSelected={isSelected} label={label} icon={icon} value={value} />
));

describe('Image Option', () => {
  it('should match snapshot for unselected state', () => {
    const { container } = render(
      <ComponentWithProvider
        onCLick={jest.fn}
        label="line chart"
        icon={<Dashboard />}
        value="lineChart"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should call onClick with value', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <ComponentWithProvider
        onCLick={onClick}
        label="line chart"
        icon={<Dashboard />}
        value="lineChart"
      />,
    );

    const imageButton = getByText('line chart');

    fireEvent.click(imageButton);

    expect(onClick).toHaveBeenCalledWith('lineChart');
  });
});
