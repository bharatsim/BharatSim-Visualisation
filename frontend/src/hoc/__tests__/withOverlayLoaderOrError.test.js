import React, { useContext } from 'react';
import { render, within, fireEvent } from '@testing-library/react';
import Button from '@material-ui/core/Button';
import withOverlayLoaderOrError from '../withOverlayLoaderOrError';
import { overlayLoaderContext } from '../../contexts/overlayLoaderContext';

function DummyComponent() {
  const { showError, stopLoader, startLoader } = useContext(overlayLoaderContext);
  return (
    <div>
      <Button onClick={() => startLoader('loading ')}>startLoader</Button>
      <Button onClick={stopLoader}>stopLoader</Button>
      <Button onClick={() => showError(1001)}>showError</Button>
      Dummy Component
    </div>
  );
}

describe('withOverlayLoaderOrError', () => {
  const Component = withOverlayLoaderOrError(DummyComponent);
  it('should provide overlay loader error context to child component', () => {
    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
  });
  it('should start loader from the overlay loader error context', () => {
    const { getByText } = render(<Component />);
    const startLoaderButton = getByText('startLoader');

    fireEvent.click(startLoaderButton);
    const loaderComponent = document.querySelector('svg');

    expect(loaderComponent).toBeInTheDocument();
  });

  it('should stop loader from the overlay loader error context', () => {
    const { getByText } = render(<Component />);
    const stopLoaderButton = getByText('stopLoader');
    const startLoaderButton = getByText('startLoader');

    fireEvent.click(startLoaderButton);
    document.querySelector('svg');

    fireEvent.click(stopLoaderButton);
    const loaderComponentAfterStop = document.querySelector('svg');

    // TODO: search by loading message when added
    expect(loaderComponentAfterStop).toBeNull();
  });
  it('should stop loader if the last instance of loader', () => {
    const { getByText } = render(<Component />);
    const stopLoaderButton = getByText('stopLoader');
    const startLoaderButton = getByText('startLoader');

    fireEvent.click(startLoaderButton);
    document.querySelector('svg');

    fireEvent.click(stopLoaderButton);
    fireEvent.click(stopLoaderButton);
    const loaderComponentAfterStop = document.querySelector('svg');

    // TODO: search by loading message when added
    expect(loaderComponentAfterStop).toBeNull();
  });

  it('should show error from the overlay loader error context', () => {
    const { getByText } = render(<Component />);
    const showErrorButton = getByText('showError');

    fireEvent.click(showErrorButton);
    const { getByText: getByTextFromModal } = within(document.querySelector('.MuiPaper-root'));

    expect(getByTextFromModal('Error while loading the page')).toBeInTheDocument();
  });

  it('should hide error from the overlay loader error context', async () => {
    const { getByText } = render(<Component />);
    const showErrorButton = getByText('showError');

    fireEvent.click(showErrorButton);
    const { getByText: getByTextFromModal } = within(document.querySelector('.MuiPaper-root'));

    const closeErrorButton = getByTextFromModal('Okay');
    fireEvent.click(closeErrorButton);

    expect(document.querySelector('.MuiDialog-container')).toBeNull();
  });
});
