import { LocationValue } from '../types';
function createCurrentLocation() {
  const { pathname } = window.location;
  return pathname;
}

function useHistoryStateNavigation() {
  const currentLocation = {
    value: createCurrentLocation()
  };
  function push(to: string) {
    changeLocation(to);
    currentLocation.value = to;
  }
  function changeLocation(to: string) {
    window.history.pushState({}, '', to);
  }
  return {
    location: currentLocation,
    push
  };
}

function useHistoryListeners(currentLocation: LocationValue) {
  const listeners: ((...args: any) => any)[] = [];
  // 订阅用户回调
  function listen(cb: (...args: any) => any) {
    listeners.push(cb);
  }
  function popStateHandle() {
    currentLocation.value = createCurrentLocation();
    listeners.forEach(cb => {
      cb(currentLocation.value);
    });
  }
  window.addEventListener('popstate', popStateHandle);
  return {
    listen
  };
}
export function createWebHistory() {
  const historyNavigation = useHistoryStateNavigation();
  const historyListeners = useHistoryListeners(historyNavigation.location);
  const routerHistory = {
    ...historyNavigation,
    ...historyListeners
  };
  return routerHistory;
}
