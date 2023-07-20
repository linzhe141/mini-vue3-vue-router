import {
  Router,
  RouterOptions,
  routerKey,
  routeKey,
  RouteInfo,
  BeforeEachHooks,
  Route
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
//!   resolve(); //! 如果没有resolve、reject或报错，那么这个promise一直是pending，then和catch就一直不会执行
//! }).then(() => console.log("resolve"));
function runGuardQueue(guards: (() => Promise<void>)[]) {
  //! 本质就是一直给Promise.resolve()加then方法
  //! Promise.resolve() // 初始值
  //!   .then(() => new Promise((resolve, reject) => {resolve()/reject()})) //第一次迭代
  //!   .then(() => new Promise((resolve, reject) => {resolve()/reject()})) //第二次迭代

  //! 最后的处理   .then(res => console.log('res')).catch(error=>console.log(error))
  return guards.reduce(
    //! 只有前一个 promise resolve掉，才能执行后面的then，所以用户必须要调用next
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
    new Promise<void>((resolve, reject) => {
      const next = (valid: boolean | undefined) => {
        if (valid === false) {
          reject('Invalid navigation guard');
        }
        resolve();
      };
      //! old 用户 需要手动执行 next
      //! guard(to, from, next);

      let fnReturn = guard(to, from);
      //! 用户的每一个hooks就不用手动调用next了
      //! 如果用户的返回值是false，就reject，那么runGuardQueue就会被中断了
      //! 因为这个 runGuardQueue 只对 resolve(promise.then) 进行迭代
      next(fnReturn);

      //? 源码还包装了一层 Promise,可能是为了做精度更高的异常拦截?
      // Promise.resolve(fnReturn).then(next);
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
    navigate(targetLocation, from)
      .then(() => {
        routerHistory.push(targetLocation.path);
        currentRoute.value = targetLocation;
      })
      .catch(error => console.log(error));
  }
  // 执行导航守卫
  function navigate(to: RouteInfo, from: RouteInfo) {
    let guards = [];
    for (const guard of beforeGuards.list()) {
      guards.push(guardToPromise(guard, to, from));
    }
    return runGuardQueue(guards);
  }

  function addRoute(route: Route) {
    matcher.addRoute(route);
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
        navigate(targetLocation, from)
          .then(() => {
            currentRoute.value = targetLocation;
          })
          .catch(error => console.log(error));
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
