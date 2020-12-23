import React from 'react';
import {renderWithRedux as render, withProjectLayout } from '../../../testUtil';
import CreateNewDashboardModal from '../CreateNewDashboardModal';
import withThemeProvider from '../../../theme/withThemeProvider';
import withSnackBar from '../../../hoc/snackbar/withSnackBar';
import withOverlayLoaderOrError from '../../../hoc/loaderWithError/withOverlayLoaderOrError';


jest.mock('../../../utils/api', () => ({
  api: {
    saveProject: jest.fn().mockResolvedValue({ projectId: 'projectId' }),
    addNewDashboard: jest.fn().mockResolvedValue({ _id: 'dashboardId' }),
  },
}));
describe('<CreateNewDashboardModal />', () => {
  const CreateNewDashboardModalComponent = withOverlayLoaderOrError(
    withSnackBar(withThemeProvider(withProjectLayout(CreateNewDashboardModal))),
  );
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should match snapshot', () => {
    render(<CreateNewDashboardModalComponent isOpen closeModal={jest.fn()} />);

    const container = document.querySelector('.MuiPaper-root');

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot only with dashboard text field', () => {
    render(<CreateNewDashboardModalComponent isOpen closeModal={jest.fn()} onlyDashboardField />);

    const container = document.querySelector('.MuiPaper-root');

    expect(container).toMatchSnapshot();
  });
});
