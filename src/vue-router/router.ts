import {
  Router,
  RouterOptions,
  routerKey,
  routeKey,
  CurrentRoute
} from './types/index';
import { createRouterMatcher } from './matcher';
import { App, inject, ref, shallowReactive, shallowRef } from 'vue';
import { RouterLink } from './components/router-link';
import { RouterView } from './components/router-view';

// 初始化的默认值
const START_LOCATION_NORMALIZED: CurrentRoute = {
  path: '/',
  matched: []
};
export function createRouter(options: RouterOptions): Router {
  const matcher = createRouterMatcher(options.routes);
  const routerHistory = options.history;
  // const currentRoute = ref(START_LOCATION_NORMALIZED);
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);

  function push(to: string) {
    const targetLocation = matcher.resolve({ path: to });
    routerHistory.push(targetLocation.path);
    currentRoute.value = targetLocation;
  }
  return {
    install(app: App) {
      const router = this;
      app.component('RouterLink', RouterLink);
      app.component('RouterView', RouterView);
      app.provide(routerKey, router);
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key as keyof CurrentRoute],
          enumerable: true
        });
      }
      app.provide(routeKey, reactiveRoute);
      // 初始化的时候 默认进行一次跳转
      router.push(routerHistory.location.value);
      // 关联history的popStateHandle回调，当执行这个popStateHandle触发时
      // 改变currentRoute这个响应式数据
      routerHistory.listen((to: string) => {
        const targetLocation = matcher.resolve({ path: to });
        currentRoute.value = targetLocation;
      });
    },
    push
  };
}

export function useRouter() {
  return inject(routerKey) as Router;
}
export function useRoute() {
  return inject(routeKey) as CurrentRoute;
}
