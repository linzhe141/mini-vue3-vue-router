# 实现`Vue3`简易版的`vue-router`插件

### tips

- 路由描述的是 URL 与 UI 之间的映射关系，这种映射是单向的，即 URL 变化引起 UI 更新（**无需刷新页面**）。

### Vue3 简易版 vue-router 的实现，包含如下功能：

- `history 路由` ：需要服务器支持，当找不到对应的资源后，需要返回 index.html
- `RouterLink`
- `RouterView`
- `router.push`
- `useRouter`
- `useRoute`
- `beforeEach:(to, from, next)=>void 路由导航守卫` ： 其中 next(): 进行的下一个钩子。如果全部钩子执行完了，则导航到 to` 但是最新的vue-router，这个next不是必须调用的了`
  [vue-router:beforeEach 文档](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)

### TODO

- `addRoute` ：如果该路由规则有 name，并且已经存在一个与之相同的名字，则会覆盖它

### history 路由大致原理：

- 利用 h5 的 history API 的 pushState,这个方法改变 URL 的 path 部分不会引起页面刷新
- 并通过 popstate 事件，监听用户点击浏览器前进后退,来改变 `currentRoute`
- 当调用 router.push 时，手动改变 `currentRoute`
- 把路由的状态(`currentRoute`)，通过 `shallowRef(START_LOCATION_NORMALIZED：初始值)` 定义成响应式数据
- 这样当改变这个`currentRoute` 的时候，RouterView 会对 currentRoute 进行依赖收集，就可以响应式更新了，即 URL 变化引起 UI 更新（**无需刷新页面**）
