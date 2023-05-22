import { waitRender } from '@/../__mocks__/test-utils';
import { act, render } from '@testing-library/react';
import React, { useState } from 'react';
import { Editor, EditorEvent, EditorEventType } from './editor';
import { Button } from '@mui/base';

jest.requireActual('monaco-editor');

const DummyEditor = ({ onEvent }: { onEvent: EditorEvent }) => {
  const [language, setLanguage] = useState<string>('json');

  const toggle = () => {
    setLanguage(language == 'json' ? 'graphql' : 'json');
  };

  return (
    <>
      <Button onClick={toggle} />
      <Editor language={language} hoverEnabled={true} onEvent={onEvent} />
    </>
  );
};

describe('Monaco editor', () => {
  it('renders without crash', async () => {
    const fn = jest.fn();

    try {
      const { getByRole } = render(<DummyEditor onEvent={fn} />);
      expect(fn).toBeCalledWith(null, EditorEventType.willMount);
      await waitRender();
      expect(fn).toHaveBeenLastCalledWith(expect.any(Object), EditorEventType.Mounted);
      const toggler = getByRole('button');
      act(() => toggler.click());
      await waitRender();
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
