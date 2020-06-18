import Vue from 'vue';
import VueRouter from 'vue-router';
import Profile from './views/Profile.vue';
import Home from './views/Home.vue';
import Queues from './views/Queues.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/queues',
    name: 'Queues',
    component: Queues,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
