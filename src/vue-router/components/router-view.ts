import { defineComponent, inject, h, provide } from 'vue';
import { routeKey, CurrentRoute } from '../types/index';

export const RouterView = defineComponent({
  name: 'RouterView',
  setup() {
    const route = inject(routeKey) as CurrentRoute;
    const depth = inject('depth', 0);
    // 让下一个RouterView的depth+1
    provide('depth', depth + 1);
    return () => {
      const matchedRoute = route.matched[depth];
      if (!matchedRoute) return null;
      const viewComponent = matchedRoute.component;
      return h(viewComponent);
    };
  }
});
