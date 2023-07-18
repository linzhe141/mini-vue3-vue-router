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

export default router;
