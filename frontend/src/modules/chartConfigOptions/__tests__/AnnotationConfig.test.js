import React, { useEffect } from 'react';
import { act, render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent } from '@testing-library/dom';

import withThemeProvider from '../../../theme/withThemeProvider';
import AnnotationConfig from '../AnnotationConfig';

jest.mock('../../../uiComponent/ColorPicker', () => ({ onChange, value, dataTestId }) => <input type="text" onChange={onChange} value={value} data-testid={dataTestId} />);

const TestForm = ({ onSubmit, isEditMode }) => {
  const form = useForm({ mode: 'onChange' });
  const { handleSubmit, reset } = form;

  const configKey = 'annotation';

  useEffect(() => {
    if (isEditMode) {
      reset({
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
      });
    }
  }, []);

  const methods = { ...form, isEditMode, defaultValues: {} };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnnotationConfig configKey={configKey} />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

describe('<AnnotationConfig />', () => {
  const FormForAnnotationConfig = withThemeProvider(TestForm);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not add extra dropbox if form is in edit mode', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} isEditMode />);
    const { getAllByText } = renderedContainer;
    const labelInputFields = getAllByText('Enter label');

    expect(labelInputFields.length).toBe(1);
  });

  it('should call on submit with selected config', async () => {
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

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        annotation: {
          annotationToggle: true,
          annotations: [
            {
              start: '2',
              end: '5',
              direction: 'horizontal',
              label: 'label',
              color: 'color',
              opacity: '0.2',
            },
          ],
        },
      },
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

  it('should delete annotation field on click of delete button', async () => {
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

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    labelInputFields = getAllByText('Enter label');

    expect(labelInputFields.length).toBe(1);
  });

  it('should show error on call of submit for incomplete form', async () => {
    const onSubmit = jest.fn();
    const renderedContainer = render(<FormForAnnotationConfig onSubmit={onSubmit} />);
    const { getByRole, getAllByText } = renderedContainer;
    getByRole('checkbox').click();
    fireEvent.change(getByRole('checkbox'), { target: { checked: true } });

    await act(async () => {
      fireEvent.click(renderedContainer.getByText('submit'));
    });

    expect(getAllByText('Required').length).toBe(4);
  });
});
