import { createRouter, createWebHistory } from "vue-router";
import EventsList from "../views/EventsList.vue";
import CreateEvent from "../views/CreateEvent.vue";
import LoginPage from "../views/LoginPage.vue";
import EventPage from "../views/EventPage.vue";

const routes = [
	{ path: "/", component: EventsList },
	{
		path: "/create",
		component: CreateEvent,
		beforeEnter: (to, from, next) => {
			// Проверяем наличие токена
			const token = localStorage.getItem("token");
			if (token) {
				next(); // Если токен есть, разрешаем доступ
			} else {
				next("/login"); // Если токена нет, перенаправляем на страницу логина
			}
		},
	},
	{
		path: "/login",
		name: "Login",
		component: LoginPage,
	},
	{
		path: "/event:id",
		name: "EventPage",
		component: EventPage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
