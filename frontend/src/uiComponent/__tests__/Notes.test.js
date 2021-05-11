import React from 'react';
import { render } from '@testing-library/react';
import { createEvent, fireEvent } from '@testing-library/dom';
import Notes from '../Notes';

describe('<Notes />', () => {
  it('should show only placeholder text at initial', () => {
    const { queryByText } = render(
      <Notes onBlur={jest.fn()} closeToolbar={jest.fn()} openToolBar={jest.fn()} />,
    );

    expect(queryByText('Click to add insights/notes')).not.toBeNull();
  });

  it('should call open toolbar callback on focus', () => {
    const openToolBar = jest.fn();
    const { getByRole } = render(
      <Notes onBlur={jest.fn()} closeToolbar={jest.fn()} openToolBar={openToolBar} />,
    );

    const textBox = getByRole('textbox');

    fireEvent.focus(textBox);

    expect(openToolBar).toHaveBeenCalled();
  });

  it('should call close toolbar callback on away event', () => {
    const closeToolbar = jest.fn();
    const { getByRole } = render(
      <Notes onBlur={jest.fn()} closeToolbar={closeToolbar} openToolBar={jest.fn()} />,
    );

    const textBox = getByRole('textbox');

    fireEvent.focus(textBox);

    fireEvent.blur(textBox);

    expect(closeToolbar).toHaveBeenCalled();
  });

  it('should show toolbar if showToolbar is true', () => {
    const closeToolbar = jest.fn();
    render(
      <Notes onBlur={jest.fn()} closeToolbar={closeToolbar} openToolBar={jest.fn()} toolbar />,
    );
    const toolbar = document.querySelector('.rdw-editor-toolbar');

    expect(toolbar).not.toBeNull();
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

    fireEvent.blur(textarea);

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
