import { act, render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import React from 'react';
import { useForm } from 'react-hook-form';
import DatasourceSelector from '../DatasourceSelector';
import { selectDropDownOption, withProjectLayout, withRouter } from '../../../../testUtil';
import { api } from '../../../../utils/api';
import withThemeProvider from '../../../../theme/withThemeProvider';

jest.mock('../../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { name: 'datasource1', _id: 'id1' },
        { name: 'datasource2', _id: 'id2' },
      ],
    }),
  },
}));

const FormWithDatasourceSelector = ({ onSubmit, isEditMode, filter }) => {
  const { control, errors, handleSubmit } = useForm({ mode: 'onChange' });
  const props = {
    headers: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' },
      { name: 'c', type: 'number' },
    ],
    configKey: 'dataSource',
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DatasourceSelector
        disabled={isEditMode}
        control={control}
        name={props.configKey}
        error={errors[props.configKey]}
        header="Data Source"
        id="dropdown-dataSources"
        label="select data source"
        filterDatasource={filter}
      />
      <button type="submit">submit</button>
    </form>
  );
};

describe('<DatasourceSelector />', () => {
  const DemoForm = withThemeProvider(withRouter(withProjectLayout(FormWithDatasourceSelector)));

  it('should call on submit with datasource id', async () => {
    const onSubmit = jest.fn();
    const renderedComponent = render(<DemoForm onSubmit={onSubmit} isEditMode={false} />);
    const { findByText } = renderedComponent;

    await findByText('Data Source');

    selectDropDownOption(renderedComponent, 'dropdown-dataSources', 'datasource1');

    await act(async () => {
      fireEvent.click(renderedComponent.getByText('submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith(
      {
        dataSource: 'id1',
      },
      expect.anything(),
    );
  });

  it('should make datasource disable when edit mode is on', async () => {
    const renderedComponent = render(<DemoForm onSubmit={jest.fn()} isEditMode />);
    const { findByText } = renderedComponent;

    await findByText('Data Source');

    const dropDown = renderedComponent.getByTestId('dropdown-dataSources');

    expect(dropDown).toHaveClass('Mui-disabled');
  });

  it('should call filter on dataSources if filer is present', async () => {
    const filter = jest.fn();
    const renderedComponent = render(<DemoForm onSubmit={jest.fn()} isEditMode filter={filter} />);
    const { findByText } = renderedComponent;

    await findByText('Data Source');

    expect(filter).toHaveBeenCalled();
  });

  it('should show loader while fetching data', async () => {
    const renderedComponent = render(<DemoForm onSubmit={jest.fn()} isEditMode />);

    const loaderComponent = document.getElementsByTagName('svg');

    expect(loaderComponent).not.toBeNull();

    await renderedComponent.findByText('select data source');
  });

  it('should show error if error occur while fetching data', async () => {
    api.getDatasources.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(<DemoForm onSubmit={jest.fn()} isEditMode />);

    await findByText('Unable to fetch data sources');

    expect(getByText('Unable to fetch data sources')).toBeInTheDocument();
  });

  it('should refetch data on click on retry button present on error banner', async () => {
    api.getDatasources.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(<DemoForm onSubmit={jest.fn()} isEditMode />);

    await findByText('Unable to fetch data sources');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    await findByText('select data source');

    expect(api.getDatasources).toHaveBeenCalled();
  });
});
