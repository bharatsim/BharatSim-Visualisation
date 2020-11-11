// eslint-disable-next-line import/no-mutable-exports
let BrowserHistory;

function initHistory(history) {
  BrowserHistory = history;
}

function navigateToPreviousPage() {
  BrowserHistory.goBack();
}

function navigateToHome() {
  BrowserHistory.push('/');
}

function reloadPage() {
  // eslint-disable-next-line no-restricted-globals
  location.reload();
}

export { initHistory, navigateToPreviousPage, reloadPage, BrowserHistory, navigateToHome };
