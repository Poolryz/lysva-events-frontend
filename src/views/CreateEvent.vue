<template>
	<div class="container mx-auto px-4 py-6">
		<h1 class="text-2xl font-bold mb-4">Создать мероприятие</h1>

		<!-- Уведомление об успешном создании мероприятия -->
		<div v-if="showSuccessMessage" class="bg-green-500 text-white p-4 mb-4 rounded">
			Мероприятие успешно создано!
		</div>

		<form @submit.prevent="createEvent" class="space-y-4">
			<input v-model="title" type="text" placeholder="Название" class="border p-2 w-full rounded" required />
			<textarea v-model="description" placeholder="Описание" class="border p-2 w-full rounded"
				required></textarea>
			<input v-model="date" type="date" class="border p-2 w-full rounded" required />
			<input v-model="location" type="text" placeholder="Место" class="border p-2 w-full rounded" required />
			<input type="file" @change="onFileChange" class="border p-2 rounded" accept="image/*">
			<button type="submit" class="bg-blue-500 text-white p-2 rounded">
				Создать мероприятие
			</button>
		</form>
	</div>
</template>

<script>
import urlChanger from "../services/constElement";
import axios from "axios";
export default {
	data() {
		return {
			title: "",
			description: "",
			date: "",
			location: "",
			userId: "",
			file: "",
			showSuccessMessage: false, // Показывать или нет уведомление
		};
	},
	methods: {
		onFileChange(event) {
			this.file = event.target.files[0];
		},
		async createEvent() {

			try {
				const token = localStorage.getItem("token"); // Получаем токен из localStorage
				if (!token) {
					throw new Error("Токен не найден. Авторизуйтесь заново.");
				}
				let formData = new FormData();
				formData.append('title', this.title);
				formData.append('description', this.description);
				formData.append('date', this.date);
				formData.append('location', this.location);
				formData.append('userId', JSON.parse(atob(token.split(".")[1])).userId); // ID пользователя
				formData.append('image', this.file); // Добавляем файл

				await axios.post(

					`${urlChanger()}events`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`, // Отправляем токен в заголовке
							'Content-Type': 'multipart/form-data',// Указываем, что данные формируются как multipart
						},
					},
				);

				// Сбросить форму
				this.title = "";
				this.description = "";
				this.date = "";
				this.location = "";
				this.file = null; // Сбросить файл

				// Показать уведомление об успешном создании
				this.showSuccessMessage = true;

				// Автоматически скрыть уведомление через 3 секунды
				setTimeout(() => {
					this.showSuccessMessage = false;
				}, 3000);
			} catch (error) {
				console.error("Ошибка при создании мероприятия:", error);
				alert("Ошибка! Возможно, вы не авторизованы.");
			}
		},
	},
};
</script>
