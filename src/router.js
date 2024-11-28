import { createRouter, createWebHistory } from 'vue-router';
import Signup from './views/SignupPage.vue';
import Login from './Components/Login.vue';
import UserList from './Components/UserList.vue';
import Posts from './Components/Posts.vue';

const routes = [
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/users', component: UserList },
  { path: '/', component: Posts },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
