import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { selectDropDownOption, withProjectLayout, withRouter } from '../../../testUtil';
import withThemeProvider from '../../../theme/withThemeProvider';
import GISShapeLayerConfig from '../GISShapeLayerConfig';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api', () => ({
  api: {
    getDatasources: jest.fn().mockResolvedValue({
      dataSources: [
        { name: 'datasource1', _id: 'id1', fileType: 'csv' },
        { name: 'datasource2', _id: 'id2', fileType: 'geojson' },
        { name: 'datasource3', _id: 'id3', fileType: 'json' },
      ],
    }),
  },
}));

describe('<GISShapeLayerConfig />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const GISShapeLayerConfigWithProvides = withThemeProvider(
    withRouter(withProjectLayout(GISShapeLayerConfig)),
  );
  it('should match snapshot for GIS Shape Layer selector', async () => {
    const { container, getByText } = render(
      <GISShapeLayerConfigWithProvides
        handleConfigChange={jest.fn()}
        value=""
        error=""
        configKey="gisShapeLayer"
      />,
    );

    await waitFor(() => getByText('GIS Shape Layer'));

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for GIS Shape Layer selector in editMode', async () => {

    const { container, getByText } = render(
      <GISShapeLayerConfigWithProvides
        handleConfigChange={jest.fn()}
        value="id2"
        error=""
        isEditMode
        configKey="gisShapeLayer"
      />,
    );

    await waitFor(() => getByText('GIS Shape Layer'));


    expect(container).toMatchSnapshot();
  });

  it('should show no gis shape file present message if api have no gis files', async () => {
    api.getDatasources.mockResolvedValueOnce({
      dataSources: [{ name: 'datasource1', _id: 'id1', fileType: 'csv' }],
    });

    const { findByText, getByText } = render(
      <GISShapeLayerConfigWithProvides
        handleConfigChange={jest.fn()}
        value=""
        error=""
        configKey="gisShapeLayer"
      />,
    );

    await findByText('Before we can create any GIS visualization, we‘ll need some GIS layer data.');
    expect(
      getByText('Before we can create any GIS visualization, we‘ll need some GIS layer data.'),
    ).toBeInTheDocument();
  });

  it('should handle  GIS Shape Layer change on click of different GIS Shape Layer name', async () => {
    const handleConfigChange = jest.fn();
    const renderedComponent = render(
      <GISShapeLayerConfigWithProvides
        configKey="gisShapeLayer"
        handleConfigChange={handleConfigChange}
        value=""
        error=""
      />,
    );

    await waitFor(() => renderedComponent.getByText('GIS Shape Layer'));

    selectDropDownOption(renderedComponent, 'dropdown-gis-shape-layer', 'datasource2');
    expect(handleConfigChange).toHaveBeenCalledWith('gisShapeLayer', 'id2');
  });

  it('should show loader while fetching data', async () => {
    const handleConfigChange = jest.fn();
    const renderedComponent = render(
      <GISShapeLayerConfigWithProvides
        configKey="gisShapeLayer"
        handleConfigChange={handleConfigChange}
        value=""
        error=""
      />,
    );
    const loaderComponent = document.getElementsByTagName('svg');

    expect(loaderComponent).not.toBeNull();

    await renderedComponent.findByText('select GIS shape Layer');
  });

  it('should show error if error occur while fetching data', async () => {
    api.getDatasources.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <GISShapeLayerConfigWithProvides
        configKey="gisShapeLayer"
        handleConfigChange={jest.fn()}
        value=""
        error=""
      />,
    );

    await findByText('Unable to fetch data sources');

    expect(getByText('Unable to fetch data sources')).toBeInTheDocument();
  });

  it('should refetch data on click on retry button present on error banner', async () => {
    api.getDatasources.mockRejectedValueOnce('error');
    const { findByText, getByText } = render(
      <GISShapeLayerConfigWithProvides
        configKey="gisShapeLayer"
        handleConfigChange={jest.fn()}
        value=""
        error=""
      />,
    );

    await findByText('Unable to fetch data sources');
    const retryButton = getByText('Retry').closest('button');
    fireEvent.click(retryButton);

    await findByText('select GIS shape Layer');

    expect(api.getDatasources).toHaveBeenCalled();
  });
});
