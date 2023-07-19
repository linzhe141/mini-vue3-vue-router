import {
  Router,
  RouterOptions,
  routerKey,
  routeKey,
  RouteInfo,
  BeforeEachHooks
} from './types/index';
import { createRouterMatcher } from './matcher';
import { App, inject, ref, shallowReactive, shallowRef } from 'vue';
import { RouterLink } from './components/router-link';
import { RouterView } from './components/router-view';

// 初始化的默认值
const START_LOCATION_NORMALIZED: RouteInfo = {
  path: '/',
  matched: []
};
function useCallback<T>() {
  const handlers: T[] = [];

  function add(handler: T) {
    handlers.push(handler);
  }
  return {
    add,
    list: () => handlers
  };
}
//! tips
//! new Promise((resolve) => {
//!   console.log(32132112);
//!   resolve(); //! 如果没有resolve，那么这个promise一直是pending，then和catch就一直不会执行
//! }).then(() => console.log("resolve"));
function runGuardQueue(guards: (() => Promise<void>)[]) {
  return guards.reduce(
    //! 只有前一个 promise resolve掉，才能执行后面的then，所有用户必须要调用next
    //! 但是最新的vue-router，这个next不是必须调用的了
    //! 最新文档 https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
    (promise, guard) => promise.then(() => guard()),
    Promise.resolve()
  );
}
function guardToPromise(
  guard: BeforeEachHooks,
  to: RouteInfo,
  from: RouteInfo
) {
  return () =>
    new Promise<void>(resolve => {
      const next = () => resolve();
      guard(to, from, next);

      // let fnReturn = guard(to, from, next);
      // return Promise.resolve(fnReturn).then(next);
    });
}

export function createRouter(options: RouterOptions): Router {
  const matcher = createRouterMatcher(options.routes);
  const routerHistory = options.history;
  // const currentRoute = ref(START_LOCATION_NORMALIZED);
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  const beforeGuards = useCallback<BeforeEachHooks>();
  function push(to: string) {
    const targetLocation = matcher.resolve({ path: to });
    const from = currentRoute.value;
    navigate(targetLocation, from).then(() => {
      routerHistory.push(targetLocation.path);
      currentRoute.value = targetLocation;
    });
  }
  // 执行导航守卫
  function navigate(to: RouteInfo, from: RouteInfo) {
    let guards = [];
    for (const guard of beforeGuards.list()) {
      guards.push(guardToPromise(guard, to, from));
    }
    return runGuardQueue(guards);
  }
  return {
    //! ps “导航”表示路由正在发生改变。
    beforeEach: beforeGuards.add,
    push,
    install(app: App) {
      const router = this;
      app.component('RouterLink', RouterLink);
      app.component('RouterView', RouterView);
      app.provide(routerKey, router);
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key as keyof RouteInfo]
        });
      }
      app.provide(routeKey, reactiveRoute);
      // 初始化的时候 默认根据当前的url，进行一次跳转
      router.push(routerHistory.location.value);
      // 关联history的popStateHandle回调，当执行这个popStateHandle触发时
      // 改变currentRoute这个响应式数据
      routerHistory.listen((to: string) => {
        const targetLocation = matcher.resolve({ path: to });
        const from = currentRoute.value;
        navigate(targetLocation, from).then(() => {
          currentRoute.value = targetLocation;
        });
      });
    }
  };
}

export function useRouter() {
  return inject(routerKey) as Router;
}
export function useRoute() {
  return inject(routeKey) as RouteInfo;
}
