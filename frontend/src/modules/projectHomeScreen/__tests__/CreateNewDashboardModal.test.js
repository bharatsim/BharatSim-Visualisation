import React from 'react';
import { render, within } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import CreateNewDashboardModal from '../CreateNewDashboardModal';
import withThemeProvider from '../../../theme/withThemeProvider';
import withSnackBar from '../../../hoc/withSnackBar';
import withOverlayLoaderOrError from '../../../hoc/withOverlayLoaderOrError';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api', () => ({
  api: {
    saveProject: jest.fn().mockResolvedValue({ projectId: 'projectId' }),
    addNewDashboard: jest.fn().mockResolvedValue({ _id: 'dashboardId' }),
  },
}));
describe('<CreateNewDashboardModal />', () => {
  const CreateNewDashboardModalComponent = withOverlayLoaderOrError(
    withSnackBar(withThemeProvider(CreateNewDashboardModal)),
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

  it('should show snackbar on successful creation of project', async () => {
    const renderedComponent = render(
      <CreateNewDashboardModalComponent isOpen closeModal={jest.fn()} />,
    );

    const { getByLabelText, getByText } = within(document.querySelector('.MuiPaper-root'));
    const event = { target: { value: 'New Project Name', id: 'project-title' } };

    fireEvent.change(getByLabelText('Project Title'), event);
    fireEvent.click(getByText('create'));

    await renderedComponent.findByText('Project New Project Name is saved');
    expect(renderedComponent.getByText('Project New Project Name is saved')).toBeInTheDocument();
  });
  it('should show snackbar on successful creation of dashboard', async () => {
    const renderedComponent = render(
      <CreateNewDashboardModalComponent isOpen closeModal={jest.fn()} />,
    );

    const { getByLabelText, getByText } = within(document.querySelector('.MuiPaper-root'));
    const event = { target: { value: 'New Dashboard Name', id: 'dashboard-title' } };

    fireEvent.change(getByLabelText('Dashboard Title'), event);
    fireEvent.click(getByText('create'));

    await renderedComponent.findByText('Dashboard New Dashboard Name is saved');
    expect(
      renderedComponent.getByText('Dashboard New Dashboard Name is saved'),
    ).toBeInTheDocument();
  });
  it('should show error if any while creating project', async () => {
    api.saveProject.mockRejectedValueOnce();
    const renderedComponent = render(
      <CreateNewDashboardModalComponent isOpen closeModal={jest.fn()} />,
    );

    const { getByLabelText, getByText } = within(document.querySelector('.MuiPaper-root'));
    const event = { target: { value: 'New Project Name', id: 'project-title' } };

    fireEvent.change(getByLabelText('Project Title'), event);
    fireEvent.click(getByText('create'));

    await renderedComponent.findByText(
      'Aw Snap! Failed to create project New Project Name and dashboard Untitled Dashboard',
    );
    expect(
      renderedComponent.getByText(
        'Aw Snap! Failed to create project New Project Name and dashboard Untitled Dashboard',
      ),
    ).toBeInTheDocument();
  });
});
