<template>
	<div class="container mx-auto px-4 py-6">
		<h1 class="text-2xl font-bold mb-4">Редактировать мероприятие</h1>

		<form @submit.prevent="updateEvent" class="space-y-4">
			<input v-model="title" type="text" placeholder="Название" class="border p-2 w-full rounded" required />
			<textarea v-model="description" placeholder="Описание" class="border p-2 w-full rounded"
				required></textarea>
			<input v-model="date" type="date" class="border p-2 w-full rounded" required />
			<input v-model="location" type="text" placeholder="Место" class="border p-2 w-full rounded" required />
			<button type="submit" class="bg-blue-500 text-white p-2 rounded">
				Обновить мероприятие
			</button>
		</form>
	</div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import urlChanger from "../services/constElement";

export default {
	name: "EditEventPage",
	setup() {
		const title = ref("");
		const description = ref("");
		const date = ref("");
		const location = ref("");
		const route = useRoute();
		const router = useRouter();

		const getEvent = async () => {
			const eventId = route.params.id;
			try {
				const response = await axios.get(
					`${urlChanger()}events/${eventId}`
				);
				const event = response.data;
				title.value = event.title;
				description.value = event.description;
				date.value = event.date.split('T')[0]; // Преобразуем дату в нужный формат
				location.value = event.location;
			} catch (error) {
				alert("Ошибка при получении мероприятия. Попробуйте еще раз.");
				console.error("Ошибка при получении мероприятия:", error);
			}
		};

		const updateEvent = async () => {
			const eventId = route.params.id;
			try {
				await axios.put(`${urlChanger()}events/${eventId}`, {
					title: title.value,
					description: description.value,
					date: date.value,
					location: location.value,
				});
				alert("Мероприятие обновлено!");
				router.push(`/event/${eventId}`);
			} catch (error) {
				alert("Ошибка при обновлении мероприятия. Попробуйте еще раз.");
				console.error("Ошибка при обновлении мероприятия:", error);
			}
		};

		onMounted(getEvent); // Загрузка данных при монтировании компонента

		return { title, description, date, location, updateEvent };
	},
};
</script>

<style>
/* Стили */
</style>
