import React from 'react';
import { render } from '@testing-library/react';
import {fireEvent, within} from '@testing-library/dom';
import { selectDropDownOption } from '../../../testUtil';
import YAxisChartConfig from '../YAxisChartConfig';
import withThemeProvider from '../../../theme/withThemeProvider';

describe('<YAxisChartConfig />', () => {
  const YAxisChartConfigWithTheme = withThemeProvider(YAxisChartConfig);
  const props = {
    headers: [
      { name: 'column1', type: 'number' },
      { name: 'column2', type: 'number' },
      { name: 'column3', type: 'number' },
    ],
    handleConfigChange: jest.fn(),
    configKey: 'yAxis',
    error: '',
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should match snapshot', () => {
    const { container } = render(<YAxisChartConfigWithTheme {...props} />);

    expect(container).toMatchSnapshot();
  });

  it('should call setConfig callback after value change for default y axis', () => {
    const renderedContainer = render(<YAxisChartConfigWithTheme {...props} />);

    selectDropDownOption(renderedContainer, 'dropdown-y-0', 'column1');

    expect(props.handleConfigChange).toHaveBeenCalledWith('yAxis', [
      { name: 'column1', type: 'number' },
    ]);
  });

  it('should prefill existing value when value are passed in props', () => {
    const existingValue = {name: 'column1', type: 'number'}

    const {getByTestId} = render(<YAxisChartConfigWithTheme {...props} value={[existingValue]} />);

    const dropDown = getByTestId('dropdown-y-0')
    expect(within(dropDown).queryByText(existingValue.name)).toBeInTheDocument()

  });


  it('should allow add y axis in addition to existing values', () => {
    const existingValue = [{name: 'column1', type: 'number'}, {name: 'column2', type: 'number'}]

    const renderedComponent = render(<YAxisChartConfigWithTheme {...props} value={existingValue} />);
    const { getByText } = renderedComponent;

    const addFieldButton = getByText('Add Metric');
    fireEvent.click(addFieldButton);
    selectDropDownOption(renderedComponent, 'dropdown-y-2', ['column3']);


    expect(props.handleConfigChange).toHaveBeenCalledWith('yAxis', [
      { name: 'column1', type: 'number' },
      { name: 'column2', type: 'number' },
      { name: 'column3', type: 'number' },
    ]);
    expect(props.handleConfigChange).toHaveBeenCalledTimes(2);
  });

  it('should add y axis field on click of add metric button', () => {
    const { getByText, queryByTestId } = render(<YAxisChartConfigWithTheme {...props} />);
    const addFieldButton = getByText('Add Metric');
    fireEvent.click(addFieldButton);
    const newField = queryByTestId('dropdown-y-1');

    expect(newField).toBeInTheDocument();
  });

  it('should handleConfigChange for multiple y axis fields', () => {
    const renderedComponent = render(<YAxisChartConfigWithTheme {...props} />);
    const { getByText } = renderedComponent;

    const addFieldButton = getByText('Add Metric');
    selectDropDownOption(renderedComponent, 'dropdown-y-0', ['column1']);

    fireEvent.click(addFieldButton);
    selectDropDownOption(renderedComponent, 'dropdown-y-1', ['column2']);

    expect(props.handleConfigChange).toHaveBeenCalledWith('yAxis', [
      { name: 'column1', type: 'number' },
    ]);
    expect(props.handleConfigChange).toHaveBeenCalledWith('yAxis', [
      { name: 'column1', type: 'number' },
      { name: 'column2', type: 'number' },
    ]);
    expect(props.handleConfigChange).toHaveBeenCalledTimes(3);
  });

  it('should delete y axis field on click of delete button', () => {
    const { getByText, queryByTestId, getByTestId } = render(
      <YAxisChartConfigWithTheme {...props} />,
    );
    const addFieldButton = getByText('Add Metric');
    fireEvent.click(addFieldButton);
    const newField = queryByTestId('dropdown-y-1');

    const deleteButton = getByTestId('delete-button-dropdown-y-1');
    fireEvent.click(deleteButton);

    expect(newField).not.toBeInTheDocument();
  });
  it('should remove the value of deleted y axis field from update config call', () => {
    const renderedComponent = render(<YAxisChartConfigWithTheme {...props} />);
    const { getByText, getByTestId } = renderedComponent;

    const addFieldButton = getByText('Add Metric');
    selectDropDownOption(renderedComponent, 'dropdown-y-0', ['column1']);

    fireEvent.click(addFieldButton);
    selectDropDownOption(renderedComponent, 'dropdown-y-1', ['column2']);

    const deleteButton = getByTestId('delete-button-dropdown-y-1');
    fireEvent.click(deleteButton);

    expect(props.handleConfigChange).toHaveBeenLastCalledWith('yAxis', [
      { name: 'column1', type: 'number' },
    ]);
    expect(props.handleConfigChange).toHaveBeenCalledTimes(4);
  });
});
