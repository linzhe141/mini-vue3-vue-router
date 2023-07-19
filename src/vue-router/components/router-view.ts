import { defineComponent, inject, h, provide } from 'vue';
import { routeKey, RouteInfo } from '../types/index';

export const RouterView = defineComponent({
  name: 'RouterView',
  setup() {
    // setup只会执行一次
    const route = inject(routeKey) as RouteInfo;
    const depth = inject('depth', 0);
    // 让下一个RouterView的depth+1
    provide('depth', depth + 1);
    // const matchedRoute = route.matched[depth];
    return () => {
      //只会对setup返回的render函数进行依赖收集，从而触发重新渲染
      const matchedRoute = route.matched[depth];
      if (!matchedRoute) return null;
      const viewComponent = matchedRoute.component;
      return h(viewComponent);
    };
  }
});
