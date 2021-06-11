import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Field, Form } from 'react-final-form';

import withThemeProvider from '../../../theme/withThemeProvider';
import { FormProvider } from '../../../contexts/FormContext';
import withMuiDatePicker from '../../../hoc/datePicker/withMuiDatePicker';
import AxisConfig from '../AxisConfig';
import { selectDropDownOption } from '../../../testUtil';

const TestForm = ({ onSubmit, isEditMode }) => {
  const configKey = 'axisConfig';
  const initialValues = {
    xAxis: {
      columnName: 'xAxis',
    },
    axisConfig: {
      axisTitle: 'xAxisTestTitle',
      axisRange: false,
    },
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={isEditMode ? initialValues : undefined}
      render={({ handleSubmit }) => (
        <FormProvider
          value={{
            isEditMode: !!isEditMode,
            registerDatasource: jest.fn(),
            unRegisterDatasource: jest.fn(),
          }}
        >
          <form onSubmit={handleSubmit}>
            <Field name="xAxis.columnName" data-testid="x-axis-input" component="input" />
            <AxisConfig configKey={configKey} axis="xAxis.columnName" title="x Axis" />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<AxisConfig />', () => {
  const FormForAxisConfig = withThemeProvider(withMuiDatePicker(TestForm));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with selected config', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAxisConfig onSubmit={onSubmit} />);
    const { getByTestId, getByText } = renderedContainer;

    const xAxisTitle = getByTestId('axis-title');

    fireEvent.change(xAxisTitle, { target: { value: 'xAxisTestTitle' } });
    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        axisConfig: {
          axisTitle: 'xAxisTestTitle',
          axisRange: false,
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should call on submit with x axis title as selected x axis column name if it not changed', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAxisConfig onSubmit={onSubmit} />);
    const { getByTestId, getByText } = renderedContainer;

    const xAxis = getByTestId('x-axis-input');

    fireEvent.change(xAxis, { target: { value: 'xAxisTestTitle' } });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        axisConfig: {
          axisTitle: 'xAxisTestTitle',
          axisRange: false,
        },
        xAxis: {
          columnName: 'xAxisTestTitle',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should load initial value for x axis and y axis in edit mode', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAxisConfig onSubmit={onSubmit} isEditMode />);
    const { getByText } = renderedContainer;

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        axisConfig: {
          axisTitle: 'xAxisTestTitle',
          axisRange: false,
        },
        xAxis: {
          columnName: 'xAxis',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should display start input for date if date is selected', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAxisConfig onSubmit={onSubmit} />);
    const { getByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'type-of-range', 'Date');

    const inputStart = getByTestId('start-input');
    const inputEnd = getByTestId('end-input');

    expect(inputStart).toHaveAttribute('type', 'text');
    expect(inputEnd).toHaveAttribute('type', 'text');
  });

  it('should display start input for number if numeric is selected', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAxisConfig onSubmit={onSubmit} />);
    const { getByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'type-of-range', 'Numeric');

    const inputStart = getByTestId('start-input');
    const inputEnd = getByTestId('end-input');

    expect(inputStart).toHaveAttribute('type', 'number');
    expect(inputEnd).toHaveAttribute('type', 'number');
  });

  it('should call on submit with selected config and range', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAxisConfig onSubmit={onSubmit} />);
    const { getByTestId, getByText, getByRole } = renderedContainer;

    const xAxisTitle = getByTestId('axis-title');

    fireEvent.change(xAxisTitle, { target: { value: 'xAxisTestTitle' } });
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });
    fireEvent.change(getByTestId('start-input'), { target: { value: 2 } });
    fireEvent.change(getByTestId('end-input'), { target: { value: 5 } });
    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        axisConfig: {
          axisRange: true,
          axisRangeType: 'numeric',
          axisTitle: 'xAxisTestTitle',
          numeric: {
            end: '5',
            start: '2',
          },
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
