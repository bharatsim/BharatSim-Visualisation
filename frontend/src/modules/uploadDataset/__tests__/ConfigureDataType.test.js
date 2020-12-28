import React from 'react';
import ConfigureDatatype from '../ConfigureDatatype';
import withThemeProvider from '../../../theme/withThemeProvider';
import { renderWithRedux as render } from '../../../testUtil';

jest.mock('../../../uiComponent/table/Table');

const Component = withThemeProvider(ConfigureDatatype);

describe('<ConfigureDatatype />', () => {
  it('should match snapshot for csv file preview', () => {
    const { container } = render(
      <Component
        previewData={[
          { col1: 'abc', col2: 123 },
          { col1: 'abcd', col2: 1234 },
        ]}
        schema={{ col1: 'string', col2: 'number' }}
        selectedFile={new File([''], 'filename.csv')}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should match snapshot for json file preview', () => {
    const { container } = render(
      <Component
        previewData={[
          { col1: 'abc', col2: 123 },
          { col1: 'abcd', col2: 1234 },
        ]}
        schema={{ col1: 'string', col2: 'number' }}
        selectedFile={new File([''], 'filename.json')}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should match snapshot for invalid file preview', () => {
    const { container } = render(
      <Component
        previewData={[
          { col1: 'abc', col2: 123 },
          { col1: 'abcd', col2: 1234 },
        ]}
        schema={{ col1: 'string', col2: 'number' }}
        selectedFile={new File([''], 'filename.error')}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
