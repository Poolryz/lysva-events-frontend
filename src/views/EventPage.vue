<template>
	<div class="container px-20 py-20 m-auto">
		<div class="body flex flex-col items-center">
			<img class="m-auto" :src="urlChanger() + event.image" alt="Event Image">
			<h2 class="text-2xl font-bold mb-4 my-5">{{ event.title }}</h2>
			<div class="mb-2 flex">
				<CalendarIcon class="w-5 h-5 text-gray-700 mr-2" /> {{ formatDate(event.date) }}</div>
			<div class="my-2 flex">
				<MapPinIcon class="w-5 h-5 text-gray-700 mr-2" />{{ event.location }}
			</div>
			<p class="mb-2 w-full"> {{ event.description }}</p>
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
	</div>
</template>

<script>
import axios from "axios";
import urlChanger from "../services/constElement";
import { MapPinIcon,CalendarIcon } from '@heroicons/vue/24/solid';

export default {
	name: "EventPage",
	components: {
    MapPinIcon,
	CalendarIcon     
  },

	data() {
		return {
			event: {}, // Данные мероприятия
			userId: null, // ID пользователя
			isAuthorized: false, // Проверка, авторизован ли пользователь
		};
	},
	
	methods: {
		urlChanger,
		// Получаем данные токена
		getTokenData() {
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
		},
		// Форматирование даты
		formatDate(dateString) {
			if (!dateString) return '';
			const date = new Date(dateString);
			const day = String(date.getDate()).padStart(2);
			const monthNames = [
				'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
				'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
			];
			const month = monthNames[date.getMonth()]; // Получаем название месяца

			const year = date.getFullYear();
			return `${day} ${month} ${year}`; // Форматирование в dd.MM.yyyy
		},
		// Получаем данные мероприятия
		async getEvent() {
			const eventId = this.$route.params.id; // Получаем ID из параметров маршрута
			try {
				const response = await axios.get(`${urlChanger()}events/${eventId}`);
				this.event = response.data; // Сохраняем данные мероприятия

				// Проверяем токен и авторство
				const tokenData = this.getTokenData();
				if (tokenData) {
					this.userId = tokenData.userId === this.event.userId; // Проверка авторства
					this.isAuthorized = true; // Устанавливаем, что пользователь авторизован
				}
			} catch (error) {
				alert("Ошибка при получении мероприятия. Попробуйте еще раз."); // Добавлено сообщение об ошибке
				console.error("Ошибка при получении мероприятия:", error);
			}
		},
		// Переход назад
		goBack() {
			this.$router.go(-1);
		},
		// Переход на страницу редактирования
		goToEdit() {
			this.$router.push({ name: "EditEventPage", params: { id: this.$route.params.id } });
		},
		// Удаление мероприятия
		async deleteEvent() {
			if (confirm("Вы уверены, что хотите удалить это мероприятие?")) {
				try {
					await axios.delete(`${urlChanger()}events/${this.$route.params.id}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`, // Отправляем токен для авторизации
						},
					});
					alert("Мероприятие удалено");
					this.$router.push("/"); // Переход на список мероприятий после удаления
				} catch (error) {
					alert("Ошибка при удалении мероприятия. Попробуйте еще раз."); // Добавлено сообщение об ошибке
					console.error("Ошибка при удалении мероприятия:", error);
				}
			}
		},
	},
	created() {
		this.getEvent(); // Получаем данные при загрузке компонента
	},
};
</script>

<style></style>
