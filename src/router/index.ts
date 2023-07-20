// import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from '@/vue-router';
import Home from '../views/home/index.vue';
import HomeA from '../views/home/home-a.vue';
import HomeB from '../views/home/home-b.vue';
import HomeC from '../views/home/home-c.vue';
import About from '../views/about/index.vue';
import AboutA from '../views/about/about-a.vue';
import AboutB from '../views/about/about-b.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'a',
        name: 'HomeA',
        component: HomeA
      },
      {
        path: 'b',
        name: 'HomeB',
        component: HomeB
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a',
        name: 'AboutA',
        component: AboutA
      },
      {
        path: 'b',
        name: 'AboutB',
        component: AboutB
      }
    ]
  }
];
// debugger;
const router = createRouter({
  history: createWebHistory(),
  routes
});
router.beforeEach(async (to, from) => {
  console.log('beforeEach 1--->to', to);
  console.log('beforeEach 1--->from', from);
  // await 1;
  //! 最新 vue-router  return 和next参数不能同时存在
  //! 1、当eturn 一个有意义的值时，就不能再这个hook函数写next参数
  //! 否则会报错 [Vue Router warn]: The "next" callback was never called inside of
  //! 2、当写了 next 参数时，这个hook中就必须得调用 next函数 否则这次导航就不会到to
  // return false;
  // next();
});
router.beforeEach((to, from, next) => {
  console.log('beforeEach 2--->to', to);
  console.log('beforeEach 2--->from', from);
  // next();
  // return false;
});
// @ts-ignore
window.__router = router;
// @ts-ignore
window.__test_route = {
  path: '/',
  name: 'Home',
  component: Home,
  children: [
    {
      path: 'c',
      name: 'HomeC',
      component: HomeC
    }
  ]
};

export default router;
