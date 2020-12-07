import React from 'react';
import { render, within } from '@testing-library/react';

import { fireEvent } from '@testing-library/dom';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import withThemeProvider from '../../theme/withThemeProvider';

describe('<DeleteConfirmationModal />', () => {
  const DeleteConfirmationModalWithTheme = withThemeProvider(DeleteConfirmationModal);

  it('should match snapshot', () => {
    render(
      <DeleteConfirmationModalWithTheme
        open
        handleClose={jest.fn()}
        title="Modal"
        deleteAction={{ name: 'Delete', onDelete: jest.fn(), dataTestId: 'test' }}
      >
        Hello this is modal
      </DeleteConfirmationModalWithTheme>,
    );

    expect(document.querySelector('.MuiPaper-root')).toMatchSnapshot();
  });

  it('should call handle close callback on click of close icon button', () => {
    const handleClose = jest.fn();
    render(
      <DeleteConfirmationModalWithTheme
        open
        handleClose={handleClose}
        title="Modal"
        deleteAction={{ name: 'Delete', onDelete: jest.fn(), dataTestId: 'test' }}
      >
        Hello this is modal
      </DeleteConfirmationModalWithTheme>,
    );

    const modal = within(document.querySelector('.MuiPaper-root'));

    const closeIconButton = modal.getByTestId('button-icon-close');

    fireEvent.click(closeIconButton);

    expect(handleClose).toHaveBeenCalled();
  });

  it('should call action callback on click of first action button', () => {
    const onDelete = jest.fn();
    render(
      <DeleteConfirmationModalWithTheme
        open
        handleClose={jest.fn()}
        title="Modal"
        das
        deleteAction={{ name: 'Delete', onDelete, dataTestId: 'testId' }}
      >
        Hello this is modal
      </DeleteConfirmationModalWithTheme>,
    );

    const modal = within(document.querySelector('.MuiPaper-root'));
    const deleteButton = modal.getByTestId('testId');

    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalled();
  });
});
