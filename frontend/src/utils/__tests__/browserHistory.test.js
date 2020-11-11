import {
  reloadPage,
  navigateToPreviousPage,
  initHistory,
  BrowserHistory,
  navigateToHome,
} from '../browserHistory';

describe('Browser History', () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });

  it('initialise browser history', () => {
    initHistory({ history: 'history' });

    expect(BrowserHistory).toEqual({ history: 'history' });
  });

  it('should call go back to navigate to previous page', () => {
    const goBack = jest.fn();
    initHistory({ goBack });

    navigateToPreviousPage();

    expect(goBack).toHaveBeenCalled();
  });

  it('should call history.push to navigate to home page', () => {
    const push = jest.fn();
    initHistory({ push });

    navigateToHome();

    expect(push).toHaveBeenCalledWith('/');
  });

  it('should call location.reload to refresh page', () => {
    reloadPage();

    expect(window.location.reload).toHaveBeenCalled();
  });
});
