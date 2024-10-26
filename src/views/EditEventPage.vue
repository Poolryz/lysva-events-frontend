<template>
	<div class="container mx-auto px-4 py-6">
		<h1 class="text-2xl font-bold mb-4">Редактировать мероприятие</h1>

		<form @submit.prevent="updateEvent" class="space-y-4">
			<input v-model="title" type="text" placeholder="Название" class="border p-2 w-full rounded" required />
			<textarea v-model="description" placeholder="Описание" class="border p-2 w-full rounded"
				required></textarea>
			<input v-model="date" type="date" class="border p-2 w-full rounded" required />
			<input v-model="location" type="text" placeholder="Место" class="border p-2 w-full rounded" required />
			<input type="file" @change="onFileChange" class="border p-2 rounded" accept="image/*">
			<button type="submit" class="bg-blue-500 text-white p-2 rounded">
				Обновить мероприятие
			</button>
		</form>
	</div>
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import urlChanger from "../services/constElement";

export default {
	name: "EditEventPage",
	data() {
		return {
			title: "",
			description: "",
			date: "",
			location: "",
			image: null,
		};
	},
	// Получаем данные маршрута и роутера
	setup() {
		return {
			route: useRoute(),
			router: useRouter(),
		};
	},
	methods: {
		// Метод для изменения файла изображения
		onFileChange(event) {
			this.image = event.target.files[0];
		},
		// Получение данных мероприятия
		async getEvent() {
			const eventId = this.route.params.id;
			try {
				const response = await axios.get(`${urlChanger()}events/${eventId}`);
				const event = response.data;
				this.title = event.title;
				this.description = event.description;
				this.date = event.date.split('T')[0]; // Преобразуем дату в нужный формат
				this.location = event.location;
			} catch (error) {
				alert("Ошибка при получении мероприятия. Попробуйте еще раз.");
				console.error("Ошибка при получении мероприятия:", error);
			}
		},
		// Обновление мероприятия
		async updateEvent() {
			const eventId = this.route.params.id;
			try {
				// Создаем объект FormData для отправки данных, включая изображение
				const formData = new FormData();
				formData.append("title", this.title);
				formData.append("description", this.description);
				formData.append("date", this.date);
				formData.append("location", this.location);
				if (this.image) {
					formData.append("image", this.image);
				}
				// Отправляем запрос на обновление с FormData
				await axios.put(`${urlChanger()}events/${eventId}`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				alert("Мероприятие обновлено!");
				this.router.push(`/event/${eventId}`);
			} catch (error) {
				alert("Ошибка при обновлении мероприятия. Попробуйте еще раз.");
				console.error("Ошибка при обновлении мероприятия:", error);
			}
		},
	},
	// Монтирование и вызов метода getEvent
	created() {
		this.getEvent();
	},
};
</script>

<style>
/* Стили */
</style>
