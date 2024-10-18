<template>
	<div class="container mx-auto px-4 py-6">
		<img :src="urlChanger() + event.image" alt="Event Image">
		<h1 class="text-2xl font-bold mb-4">{{ event.title }}</h1>
		<p class="mb-2"><strong>Описание:</strong> {{ event.description }}</p>
		<p class="mb-2"><strong>Дата:</strong> {{ formatDate(event.date) }}</p>
		<p class="mb-2"><strong>Место:</strong> {{ event.location }}</p>
		<button @click="goBack" class="bg-blue-500 text-white p-2 rounded mb-4">
			Назад
		</button>

		<!-- Отображаем кнопки только если текущий пользователь авторизован и является автором мероприятия -->
		<div v-if="isAuthorized && userId">
			<button @click="goToEdit" class="bg-yellow-500 text-white p-2 rounded mr-2">
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import urlChanger from "../services/constElement";

export default {
	name: "EventPage",
	setup() {
		const event = ref({}); // Данные мероприятия
		const route = useRoute();
		const router = useRouter();
		const userId = ref(false); // Проверка, является ли текущий пользователь автором
		const isAuthorized = ref(false); // Проверка, авторизован ли пользователь

		// Функция для получения и декодирования токена
		const getTokenData = () => {
			const token = localStorage.getItem("token");
			if (token) {
				try {
					const payload = JSON.parse(atob(token.split(".")[1]));
					return payload;
				} catch (error) {
					console.error("Ошибка при декодировании токена:", error);
					return null;
				}
			}
			return null;
		};

		const formatDate = (dateString) => {
			if (!dateString) return '';
			const date = new Date(dateString);
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
			const year = date.getFullYear();
			return `${day}.${month}.${year}`; // Форматирование в dd.MM.yyyy
		};

		const getEvent = async () => {
			const eventId = route.params.id; // Получаем ID из параметров маршрута
			try {
				const response = await axios.get(`${urlChanger} ${eventId}`);
				event.value = response.data; // Сохраняем данные мероприятия

				// Проверяем токен и авторство
				const tokenData = getTokenData();
				if (tokenData) {
					userId.value = tokenData.userId === event.value.userId; // Проверка авторства
					isAuthorized.value = true; // Устанавливаем, что пользователь авторизован
				}
			} catch (error) {
				alert("Ошибка при получении мероприятия. Попробуйте еще раз."); // Добавлено сообщение об ошибке
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
			if (confirm("Вы уверены, что хотите удалить это мероприятие?")) {
				try {
					await axios.delete(`${urlChanger()}events/${route.params.id}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`, // Отправляем токен для авторизации
						},
					});
					alert("Мероприятие удалено");
					router.push("/"); // Переход на список мероприятий после удаления
				} catch (error) {
					alert("Ошибка при удалении мероприятия. Попробуйте еще раз."); // Добавлено сообщение об ошибке
					console.error("Ошибка при удалении мероприятия:", error);
				}
			}
		};

		onMounted(getEvent); // Получаем данные при загрузке компонента

		return { event, goBack, goToEdit, deleteEvent, userId, isAuthorized, formatDate };
	},
	methods: {
		urlChanger
	}
};
</script>

<style></style>
