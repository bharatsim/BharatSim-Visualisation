import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';

import withThemeProvider from '../../../theme/withThemeProvider';
import LineStylesConfig from '../LineStyleConfigs';
import { selectDropDownOption } from '../../../testUtil';

jest.mock('../../../uiComponent/ColorPicker', () => ({ onChange, value, dataTestId }) => (
  <input type="text" onChange={onChange} value={value} data-testid={dataTestId} />
));

const TestForm = ({ onSubmit }) => {
  const props = {
    name: 'lineStyle',
    seriesName: 'abcd',
    index: 1,
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <LineStylesConfig {...props} />
          <button type="submit">submit</button>
        </form>
      )}
    />
  );
};

describe('<LineStyle />', () => {
  const FormForLineStyleConfigDropdown = withThemeProvider(TestForm);
  it('should call setConfig callback with default value', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<FormForLineStyleConfigDropdown onSubmit={onSubmit} />);

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        lineStyle: {
          color: {
            a: 1,
            b: 25,
            g: 112,
            r: 246,
          },
          seriesType: 'dot',
          seriesWidth: '1',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });
  it('should call setConfig callback with changed values', () => {
    const onSubmit = jest.fn();
    const renderComponent = render(<FormForLineStyleConfigDropdown onSubmit={onSubmit} />);
    const { getByText, getByTestId } = renderComponent;

    selectDropDownOption(renderComponent, 'series-type', 'Dash');

    fireEvent.change(getByTestId('color-picker'), {
      target: { value: 'color' },
    });

    fireEvent.change(getByTestId('series-width'), {
      target: { value: 2 },
    });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        lineStyle: {
          color: 'color',
          seriesType: 'dash',
          seriesWidth: '2',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
