import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { toPng } from 'html-to-image';
import Widget from '../Widget';
import withThemeProvider from '../../../theme/withThemeProvider';

jest.mock('html-to-image', () => ({
  toPng: jest.fn().mockResolvedValue('dataUrl'),
}));

describe('<Widget />', () => {
  const WidgetWithProvider = withThemeProvider(Widget);
  it('should match snapshot', async () => {
    const { container } = render(
      <WidgetWithProvider
        title="Line Chart"
        onDelete={() => {}}
        onEdit={() => {}}
        onDuplicate={jest.fn()}
      >
        Line Chart
      </WidgetWithProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should delete widget', () => {
    const onDeleteMock = jest.fn();
    const { getByTestId, getByText } = render(
      <WidgetWithProvider
        title="Line Chart"
        onDelete={onDeleteMock}
        onEdit={() => {}}
        onDuplicate={jest.fn()}
      >
        Line Chart
      </WidgetWithProvider>,
    );
    fireEvent.click(getByTestId('widget-menu'));
    fireEvent.click(getByText('Delete Chart'));
    fireEvent.click(getByTestId('delete-chart-confirm'));
    expect(onDeleteMock).toBeCalled();
  });

  it('should Edit widget', () => {
    const onDeleteMock = jest.fn();
    const onEditMock = jest.fn();
    const { getByTestId } = render(
      <WidgetWithProvider
        title="Line Chart"
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onDuplicate={jest.fn()}
      >
        Line Chart
      </WidgetWithProvider>,
    );
    fireEvent.click(getByTestId('widget-menu'));
    fireEvent.click(getByTestId('EditChart'));

    expect(onEditMock).toBeCalled();
  });

  it('should duplicate widget', () => {
    const onDeleteMock = jest.fn();
    const onEditMock = jest.fn();
    const onDuplicate = jest.fn();
    const { getByTestId } = render(
      <WidgetWithProvider
        title="Line Chart"
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onDuplicate={onDuplicate}
      >
        Line Chart
      </WidgetWithProvider>,
    );

    fireEvent.click(getByTestId('duplicate-button'));

    expect(onDuplicate).toBeCalled();
  });

  it('should cancel delete', () => {
    const onDeleteMock = jest.fn();

    const { getByTestId, getByText } = render(
      <WidgetWithProvider
        title="Line Chart"
        onDelete={onDeleteMock}
        onEdit={() => {}}
        onDuplicate={jest.fn()}
      >
        Line Chart
      </WidgetWithProvider>,
    );
    fireEvent.click(getByTestId('widget-menu'));
    fireEvent.click(getByText('Delete Chart'));
    fireEvent.click(getByTestId('button-icon-close'));
    expect(onDeleteMock).not.toBeCalled();
  });
  it('should take snapshot of line chart', () => {
    const onDeleteMock = jest.fn();

    const { getByTestId } = render(
      <WidgetWithProvider
        title="Line Chart"
        onDelete={onDeleteMock}
        onEdit={() => {}}
        onDuplicate={jest.fn()}
      >
        Line Chart
      </WidgetWithProvider>,
    );
    fireEvent.click(getByTestId('snapshot-button'));

    expect(toPng).toHaveBeenCalled();
  });
});
