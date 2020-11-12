import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import ProjectHeader from '../ProjectHeader';
import withThemeProvider from '../../theme/withThemeProvider';
import { ProjectLayoutProvider } from '../../contexts/projectLayoutContext';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('<ProjectHeader />', () => {
  const ProjectHeaderWithProviders = withThemeProvider(() => (
    <ProjectLayoutProvider value={{ projectMetadata: { name: 'project1' } }}>
      <ProjectHeader />
    </ProjectLayoutProvider>
  ));
  it('should match snapshot', () => {
    const { getByText } = render(<ProjectHeaderWithProviders />);
    const projectName = getByText('project1');

    expect(projectName).toBeInTheDocument();
  });

  it('should navigate to recent projects on click of back to recent button', () => {
    const { getByText } = render(<ProjectHeaderWithProviders />);

    fireEvent.click(getByText('Back to recent projects'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });
});
