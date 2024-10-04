import { createRouter, createWebHistory } from "vue-router";
import EventsList from "../views/EventsList.vue";
import CreateEvent from "../views/CreateEvent.vue";
import LoginPage from "../views/LoginPage.vue";

const routes = [
	{ path: "/", component: EventsList },
	{ path: "/create", component: CreateEvent },
	{
		path: "/login",
		name: "Login",
		component: LoginPage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
