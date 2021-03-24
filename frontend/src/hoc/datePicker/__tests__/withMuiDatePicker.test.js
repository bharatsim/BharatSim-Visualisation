import React from 'react';

import { DatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import { render } from '@testing-library/react';

import withMuiDatePicker from '../withMuiDatePicker';
import withThemeProvider from '../../../theme/withThemeProvider';
import { DATE_FORMAT } from '../../../constants/annotations';

function DummyComponent() {
  return (
    <DatePicker
      label="Basic example"
      value={format(new Date(), DATE_FORMAT)}
      onChange={jest.fn()}
    />
  );
}

describe('withSnackBar', () => {
  const Component = withThemeProvider(withMuiDatePicker(DummyComponent));
  it('should provide date fns utils context to child component', () => {
    const { container } = render(<Component />);

    expect(container).toMatchSnapshot();
  });
});
