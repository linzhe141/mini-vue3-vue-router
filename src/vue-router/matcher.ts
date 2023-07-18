import { Route, Record, LocationPath } from '@/vue-router/types';
type RouteRecordMatcher = {
  path: string;
  record: Record;
  parent: RouteRecordMatcher | undefined;
  children: RouteRecordMatcher[];
};

function createRouteRecordMatcher(record: Record, parent?: RouteRecordMatcher) {
  const matcher: RouteRecordMatcher = {
    path: record.path,
    record,
    parent,
    children: []
  };
  if (parent) {
    parent.children.push(matcher);
  }
  return matcher;
}

export function createRouterMatcher(routes: Route[]) {
  const matchers: RouteRecordMatcher[] = [];

  // TODO 重名添加应该会去掉旧的
  function addRoute(route: Route, parent?: RouteRecordMatcher) {
    const record: Record = {
      path: route.path,
      name: route.name,
      component: route.component,
      children: (route.children as unknown as Record[]) ?? []
    };
    if (parent) {
      const parentPath = parent.path;
      const connectingSlash =
        parentPath[parentPath.length - 1] === '/' ? '' : '/';
      record.path = parent.path + connectingSlash + record.path;
    }
    const matcher = createRouteRecordMatcher(record, parent);
    if (route.children) {
      route.children.forEach(childRoute => addRoute(childRoute, matcher));
    }
    matchers.push(matcher);
  }
  function resolve(location: LocationPath) {
    const matched: Record[] = [];
    const path = location.path;
    let matcher = matchers.find(m => m.path === path);
    while (matcher) {
      matched.unshift(matcher.record);
      matcher = matcher.parent;
    }
    return {
      path,
      matched
    };
  }
  routes.forEach(route => addRoute(route));
  console.log('matchers--->', matchers);
  console.log('测试匹配结果--->', resolve({ path: '/about/a' }));
  return { addRoute, resolve };
}
