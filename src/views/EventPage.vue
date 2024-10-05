<template>
	<div class="container mx-auto px-4 py-6">
		<h1 class="text-2xl font-bold mb-4">{{ event.title }}</h1>
		<p class="mb-2"><strong>Описание:</strong> {{ event.description }}</p>
		<p class="mb-2"><strong>Дата:</strong> {{ event.date }}</p>
		<p class="mb-2"><strong>Место:</strong> {{ event.location }}</p>
		<button @click="goBack" class="bg-blue-500 text-white p-2 rounded mb-4">
			Назад
		</button>

		<!-- Отображаем кнопки только если текущий пользователь является автором мероприятия -->
		<div v-if="userId">
			<button
				@click="goToEdit"
				class="bg-yellow-500 text-white p-2 rounded mr-2"
			>
				Редактировать
			</button>
			<button @click="deleteEvent" class="bg-red-500 text-white p-2 rounded">
				Удалить
			</button>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import { ref } from "vue";
	import { useRoute, useRouter } from "vue-router";

	export default {
		name: "EventPage",
		setup() {
			const event = ref({});
			const route = useRoute();
			const router = useRouter();
			const userId = ref(false); // Проверка, является ли текущий пользователь автором

			const getEvent = async () => {
				const eventId = route.params.id; // Получаем ID из параметров маршрута
				try {
					const response = await axios.get(
						//`http://localhost:3000/events/${eventId}`,
						`http://176.32.33.100/events/${eventId}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`, // Отправляем токен
							},
						},
					);
					event.value = response.data; // Сохраняем данные мероприятия

					// Проверяем, является ли текущий пользователь автором мероприятия
					const currentId = JSON.parse(
						atob(localStorage.getItem("token").split(".")[1]),
					).userId; // Получаем id из токена
					userId.value = currentId === event.value.userId;
				} catch (error) {
					console.error("Ошибка при получении мероприятия:", error);
				}
			};

			const goBack = () => {
				router.go(-1); // Вернуться на предыдущую страницу
			};

			const goToEdit = () => {
				router.push({ name: "EditEventPage", params: { id: route.params.id } }); // Переход на страницу редактирования
			};

			const deleteEvent = async () => {
				try {
					await axios.delete(
						//`http://localhost:3000/events/${route.params.id}`,
						`http://176.32.33.100:3000/events/${route.params.id}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`, // Отправляем токен для авторизации
							},
						},
					);
					alert("Мероприятие удалено");
					router.push("/events"); // Переход на список мероприятий после удаления
				} catch (error) {
					console.error("Ошибка при удалении мероприятия:", error);
				}
			};

			getEvent(); // Получаем данные при загрузке компонента

			return { event, goBack, goToEdit, deleteEvent, userId };
		},
	};
</script>

<style></style>
