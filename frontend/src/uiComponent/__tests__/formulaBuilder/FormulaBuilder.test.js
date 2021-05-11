import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import FormulaBuilder from '../../formulaBuilder/FormulaBuilder';
import withThemeProvider from '../../../theme/withThemeProvider';

const operator = ['+', '-', '*'];
const fields = ['field1', 'field2'];

const FormulaBuilderWithProviders = withThemeProvider(FormulaBuilder);

describe('<FormulaBuilder />', () => {
  it('should match snapshot of component', () => {
    const { container } = render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={jest.fn()}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should call onClick callback with entered formula', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={onClick}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    const field1Button = getByText('field1');
    const plusButton = getByText('+');
    const calculateButton = getByText('calculate');

    fireEvent.click(field1Button);
    fireEvent.click(plusButton);
    fireEvent.click(field1Button);
    fireEvent.click(calculateButton);

    expect(onClick).toHaveBeenCalledWith(' "field1"  +  "field1" ');
  });

  it('should through error if formula is wrong', () => {
    const onClick = jest.fn();
    const { getByText, queryByText } = render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={onClick}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    const field1Button = getByText('field1');
    const calculateButton = getByText('calculate');
    const plusButton = getByText('+');

    fireEvent.click(field1Button);
    fireEvent.click(field1Button);
    fireEvent.click(plusButton);
    fireEvent.click(calculateButton);

    expect(queryByText('SyntaxError: Unexpected operator "')).not.toBeNull();
  });

  it('should through error if formula is empty', () => {
    const onClick = jest.fn();
    const { getByText, queryByText } = render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={onClick}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    const calculateButton = getByText('calculate');
    fireEvent.click(calculateButton);

    expect(queryByText('Error: Expression can not be empty')).not.toBeNull();
  });

  it('should not allow other digit, opertor and space to type', async () => {
    const onClick = jest.fn();
    render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={onClick}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    const textArea = document.querySelector('.npm__react-simple-code-editor__textarea');

    userEvent.type(textArea, 'ab=}|@');

    expect(textArea).toHaveValue('');
  });

  it('should allow digit, operator and space to type', async () => {
    const onClick = jest.fn();
    render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={onClick}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    const textArea = document.querySelector('.npm__react-simple-code-editor__textarea');

    await userEvent.type(textArea, '12 + 13');

    expect(textArea).toHaveValue('12 + 13');
  });

  it('should remove error on change of expression', () => {
    const onClick = jest.fn();
    const { getByText, queryByText } = render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={onClick}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    const calculateButton = getByText('calculate');
    fireEvent.click(calculateButton);
    const textArea = document.querySelector('.npm__react-simple-code-editor__textarea');

    expect(queryByText('Error: Expression can not be empty')).not.toBeNull();
    userEvent.type(textArea, ' 12 + 13');
    expect(queryByText('Error: Expression can not be empty')).toBeNull();
  });

  it('should remove error on click of any field', () => {
    const onClick = jest.fn();
    const { getByText, queryByText } = render(
      <FormulaBuilderWithProviders
        operators={operator}
        onClick={onClick}
        fields={fields}
        buttonLabel="calculate"
      />,
    );

    const calculateButton = getByText('calculate');
    fireEvent.click(calculateButton);

    expect(queryByText('Error: Expression can not be empty')).not.toBeNull();
    const field1Button = getByText('field1');
    fireEvent.click(field1Button);
    expect(queryByText('Error: Expression can not be empty')).toBeNull();
  });
});
