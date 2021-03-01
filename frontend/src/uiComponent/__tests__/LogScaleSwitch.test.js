import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import LogScaleSwitch from '../LogScaleSwitch';
import withThemeProvider from '../../theme/withThemeProvider';

const LogScaleSwitchWithProvider = withThemeProvider(LogScaleSwitch);

describe('<LogScaleSwitch />', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <LogScaleSwitchWithProvider onChange={jest.fn()} isChecked={false} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with checked switch', () => {
    const { container } = render(<LogScaleSwitchWithProvider onChange={jest.fn()} isChecked />);

    expect(container).toMatchSnapshot();
  });

  it('should called on change when checked', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<LogScaleSwitchWithProvider onChange={onChange} isChecked />);

    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    expect(onChange).toHaveBeenCalled();
  });
});
