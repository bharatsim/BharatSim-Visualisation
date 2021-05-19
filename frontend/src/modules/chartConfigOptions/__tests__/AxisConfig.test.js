import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Field, Form } from 'react-final-form';

import withThemeProvider from '../../../theme/withThemeProvider';
import { FormProvider } from '../../../contexts/FormContext';
import withMuiDatePicker from '../../../hoc/datePicker/withMuiDatePicker';
import AxisConfig from '../AxisConfig';

const TestForm = ({ onSubmit, isEditMode }) => {
  const configKey = 'axisConfig';
  const initialValues = {
    xAxis: {
      columnName: 'xAxis',
    },
    axisConfig: {
      xAxisTitle: 'xAxisTitle',
      yAxisTitle: 'yAxisTitle',
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
            <AxisConfig configKey={configKey} xAxis="xAxis.columnName" />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<AxisConfig />', () => {
  const FormForAnnotationConfig = withThemeProvider(withMuiDatePicker(TestForm));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call on submit with selected config', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByTestId, getByText } = renderedContainer;

    const xAxisTitle = getByTestId('x-axis-title');
    const yAxisTitle = getByTestId('y-axis-title');

    fireEvent.change(xAxisTitle, { target: { value: 'xAxisTestTitle' } });
    fireEvent.change(yAxisTitle, { target: { value: 'yAxisTestTitle' } });
    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        axisConfig: {
          xAxisTitle: 'xAxisTestTitle',
          yAxisTitle: 'yAxisTestTitle',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should call on submit with x axis title as selected x axis column name if it not changed', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByTestId, getByText } = renderedContainer;

    const xAxis = getByTestId('x-axis-input');

    fireEvent.change(xAxis, { target: { value: 'xAxisTestTitle' } });

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        axisConfig: {
          xAxisTitle: 'xAxisTestTitle',
          yAxisTitle: '',
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
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} isEditMode />);
    const { getByText } = renderedContainer;

    fireEvent.click(getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        axisConfig: {
          xAxisTitle: 'xAxisTitle',
          yAxisTitle: 'yAxisTitle',
        },
        xAxis: {
          columnName: 'xAxis',
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });
});
