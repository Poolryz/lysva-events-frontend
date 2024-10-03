import { createRouter, createWebHistory } from 'vue-router';
import EventsList from '../views/EventsList.vue';
import CreateEvent from '../views/CreateEvent.vue';

const routes = [
  { path: '/', component: EventsList },
  { path: '/create', component: CreateEvent }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
