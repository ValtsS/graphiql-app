import { Debouncer } from './debounce';

describe('Debouncer', () => {
  let debouncer: Debouncer;
  const actionMock = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    debouncer = new Debouncer(100);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    actionMock.mockReset();
  });

  test('should run the action after the debounce time', () => {
    debouncer.run(actionMock);
    expect(actionMock).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(actionMock).toHaveBeenCalledTimes(1);
  });

  test('should cancel the previous action if run is called multiple times within the debounce time', () => {
    debouncer.run(actionMock);
    jest.advanceTimersByTime(50);
    debouncer.run(actionMock);
    jest.advanceTimersByTime(100);
    expect(actionMock).toHaveBeenCalledTimes(1);
  });

  test('should clear the timeout when clear method is called', () => {
    debouncer.run(actionMock);
    debouncer.clear();
    jest.advanceTimersByTime(100);
    expect(actionMock).not.toHaveBeenCalled();
  });

  test('should dispose the debouncer and clear the timeout', () => {
    debouncer.run(actionMock);
    debouncer.dispose();
    jest.advanceTimersByTime(100);
    expect(actionMock).not.toHaveBeenCalled();
  });
});
