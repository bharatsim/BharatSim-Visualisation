import React from 'react';
import { renderWithRedux as render } from '../../../testUtil';
import ProjectMetadataCard from '../ProjectMetadataCard';
import withThemeProvider from '../../../theme/withThemeProvider';
import withSnackBar from '../../../hoc/snackbar/withSnackBar';

describe('ProjectMetadataCard', () => {
  const ProjectMetadataCardWithProviders = withThemeProvider(withSnackBar(ProjectMetadataCard));
  it('should match snapshot ProjectMetadataCard', async () => {
    const { container } = render(
      <ProjectMetadataCardWithProviders
        project={{ _id: 'projectId', name: 'projectName' }}
        onProjectClick={jest.fn()}
        deleteProject={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
