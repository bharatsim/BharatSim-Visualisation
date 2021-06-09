import React from 'react';
import { createEvent, render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Notes from '../Notes';

describe('<Notes />', () => {
  it('should show only placeholder text at initial', () => {
    const { queryByText } = render(
      <Notes onBlur={jest.fn()} closeToolbar={jest.fn()} openToolBar={jest.fn()} />,
    );

    expect(queryByText('Click to add insights/notes')).not.toBeNull();
  });

  it('should call onblur with serialize text', () => {
    const closeToolbar = jest.fn();
    const onBlur = jest.fn();
    const { getByRole } = render(
      <Notes onBlur={onBlur} closeToolbar={closeToolbar} openToolBar={jest.fn()} toolbar />,
    );

    const textarea = getByRole('textbox');
    fireEvent.focus(textarea);
    const event = createEvent.paste(textarea, {
      clipboardData: {
        types: ['text/plain'],
        getData: () => 'notes',
      },
    });

    fireEvent(textarea, event);

    fireEvent.focusOut(textarea);

    expect(onBlur).toHaveBeenCalled();
  });

  it('should should deserialize text and initialize the editor', () => {
    const text =
      // eslint-disable-next-line max-len
      '{"blocks":[{"key":"93tkq","text":"notes","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
    const closeToolbar = jest.fn();
    const onBlur = jest.fn();
    const { getByText } = render(
      <Notes
        onBlur={onBlur}
        closeToolbar={closeToolbar}
        openToolBar={jest.fn()}
        toolbar
        text={text}
      />,
    );

    expect(getByText('notes')).toBeInTheDocument();
  });
});
