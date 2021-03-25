import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import withThemeProvider from '../../../theme/withThemeProvider';
import AnnotationConfig from '../AnnotationConfig';
import { FormProvider } from '../../../contexts/FormContext';
import { selectDropDownOption } from '../../../testUtil';
import withMuiDatePicker from '../../../hoc/datePicker/withMuiDatePicker';

jest.mock('../../../uiComponent/ColorPicker', () => ({ onChange, value, dataTestId }) => (
  <input type="text" onChange={onChange} value={value} data-testid={dataTestId} />
));

jest.mock('../../../utils/dateUtils', () => ({
  currentDate: jest.fn(() => new Date(1999, 3, 1, 1, 2, 2, 2)),
}));

const TestForm = ({ onSubmit, isEditMode }) => {
  const configKey = 'annotation';
  const initialValues = {
    annotation: {
      annotationToggle: true,
      annotations: [
        {
          start: '2',
          end: '4',
          direction: 'vertical',
          label: 'lockdown',
          color: { r: 1, g: 2, b: 3, a: 1 },
          opacity: 0.2,
        },
      ],
    },
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
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
            <AnnotationConfig configKey={configKey} />
            <button type="submit">submit</button>
          </form>
        </FormProvider>
      )}
    />
  );
};

describe('<AnnotationConfig />', () => {
  const FormForAnnotationConfig = withThemeProvider(withMuiDatePicker(TestForm));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not add extra dropbox if form is in edit mode', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} isEditMode />);
    const { getAllByText } = renderedContainer;
    const labelInputFields = getAllByText('Enter label');

    expect(labelInputFields.length).toBe(1);
  });

  it('should call on submit with selected config', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByRole, getAllByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    const radioButtons = getAllByRole('radio');
    fireEvent.click(radioButtons[1]);
    fireEvent.change(radioButtons[1], { target: { checked: true } });

    fireEvent.change(getByTestId('label-input'), { target: { value: 'label' } });
    fireEvent.change(getByTestId('start-input'), { target: { value: 2 } });
    fireEvent.change(getByTestId('end-input'), { target: { value: 5 } });
    fireEvent.change(getByTestId('color-picker'), {
      target: { value: 'color' },
    });
    fireEvent.change(getByTestId('opacity-input'), { target: { value: 0.2 } });

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        annotation: {
          annotationToggle: true,
          annotations: [
            {
              numeric: {
                start: '2',
                end: '5',
              },
              direction: 'horizontal',
              label: 'label',
              color: 'color',
              opacity: '0.2',
              type: 'numeric',
            },
          ],
        },
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should add y axis field on click of add annotation button', () => {
    const onSubmit = jest.fn();
    const { getByText, getAllByText, getByRole } = render(
      <FormForAnnotationConfig onSubmit={onSubmit} />,
    );
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    const addFieldButton = getByText('Add Annotation');

    fireEvent.click(addFieldButton);

    const labelInputFields = getAllByText('Enter label');

    expect(labelInputFields.length).toBe(2);
  });

  it('should delete annotation field on click of delete button', () => {
    const onSubmit = jest.fn();
    const { getByText, getAllByText, getByRole, getByTestId } = render(
      <FormForAnnotationConfig onSubmit={onSubmit} />,
    );
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    const addFieldButton = getByText('Add Annotation');

    fireEvent.click(addFieldButton);

    let labelInputFields = getAllByText('Enter label');

    expect(labelInputFields.length).toBe(2);

    const deleteButton = getByTestId('delete-button-1');

    fireEvent.click(deleteButton);

    labelInputFields = getAllByText('Enter label');

    expect(labelInputFields.length).toBe(1);
  });

  it('should show error on call of submit for incomplete form', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByRole, getAllByText } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    fireEvent.click(renderedContainer.getByText('submit'));

    expect(getAllByText('Field is required').length).toBe(3);
  });

  it('should display start input for date if date is selected', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'type-of-annotation-value', 'Date');

    const inputStart = getByTestId('start-input');
    const inputEnd = getByTestId('end-input');

    expect(inputStart).toHaveAttribute('type', 'text');
    expect(inputEnd).toHaveAttribute('type', 'text');
  });

  it('should display start input for number if numeric is selected', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByRole, getByTestId } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    selectDropDownOption(renderedContainer, 'type-of-annotation-value', 'Numeric');

    const inputStart = getByTestId('start-input');
    const inputEnd = getByTestId('end-input');

    expect(inputStart).toHaveAttribute('type', 'number');
    expect(inputEnd).toHaveAttribute('type', 'number');
  });

  it('should not have delete button if only one annotation config is present', () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByRole, queryAllByAltText } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    const deleteIcons = queryAllByAltText('delete-icon');

    expect(deleteIcons.length).toBe(0);
  });
});
