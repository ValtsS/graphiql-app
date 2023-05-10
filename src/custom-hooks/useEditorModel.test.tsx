import { getOrCreateModel } from '@/components/editor/editor';
import { act, renderHook } from '@testing-library/react';
import { editor } from 'monaco-editor';
import { Props, useCertainModel } from './useEditorModel';

jest.mock('@/components/editor/editor', () => ({
  getOrCreateModel: jest.fn(),
}));

describe('useCertainModel', () => {
  const mockOnChange = jest.fn();
  const mockModel: editor.ITextModel = {
    onDidChangeContent(_listener: () => void) {
      expect(_listener).toBeTruthy();
      mockOnChange(mockModel);
    },
  } as editor.ITextModel;

  const props: Props = {
    uuid: '123',
    initialValue: 'Initial Value',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getOrCreateModel as jest.Mock).mockReturnValue(mockModel);
  });

  test('should create and return the model', () => {
    const { result } = renderHook(() => useCertainModel(props));

    expect(result.current).toBe(mockModel);
    expect(getOrCreateModel).toHaveBeenCalledWith('123', 'Initial Value');
  });

  test('should call the onChange callback after debouncing', () => {
    expect(mockOnChange).not.toHaveBeenCalled();
    renderHook(() => useCertainModel(props));
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockOnChange).toHaveBeenCalledWith(mockModel);
  });
});
