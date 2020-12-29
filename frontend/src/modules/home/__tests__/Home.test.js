import React from 'react';
import { renderWithRedux as render } from '../../../testUtil';
import Home from '../Home';
import { api } from '../../../utils/api';
import withSnackBar from '../../../hoc/snackbar/withSnackBar';

jest.mock('../../../utils/api', () => ({
  api: {
    getProjects: jest.fn(),
  },
}));

describe('Home', () => {
  const HomeWithProviders = withSnackBar(Home);
  it('should match snapshot for new user', async () => {
    api.getProjects.mockResolvedValue({ projects: [] });
    const { container, findByText } = render(<HomeWithProviders />);

    await findByText('Welcome to BharatSim');
    expect(container).toMatchSnapshot();
  });
  it('should match snapshot for existing users', async () => {
    api.getProjects.mockResolvedValue({ projects: [{ name: 'project1', _id: '1' }] });
    const { container, findByText } = render(<HomeWithProviders />);

    await findByText('project1');

    expect(container).toMatchSnapshot();
  });
});
