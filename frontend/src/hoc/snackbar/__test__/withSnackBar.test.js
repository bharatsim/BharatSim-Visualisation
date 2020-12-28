import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { fireEvent, waitFor } from '@testing-library/react';
import withSnackBar from '../withSnackBar';
import withThemeProvider from '../../../theme/withThemeProvider';
import { renderWithRedux as render } from '../../../testUtil';

function DummyComponent() {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    enqueueSnackbar('test snack bar');
  }, []);
  return <div>DummyController </div>;
}

describe('withSnackBar', () => {
  const Component = withThemeProvider(withSnackBar(DummyComponent));
  it('should provide snackbar context to child component', () => {
    const { queryByText } = render(<Component />);

    expect(queryByText('test snack bar')).not.toBeNull();
  });

  it('should dismiss snackbar on click on snackbar button', async () => {
    const { getByText, queryByText } = render(<Component />);

    const dismissButton = getByText('Dismiss');
    fireEvent.click(dismissButton);

    await waitFor(
      () => {
        expect(queryByText('test snack bar')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
