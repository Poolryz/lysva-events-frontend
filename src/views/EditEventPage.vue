<template>
	<div class="container mx-auto px-4 py-6">
		<h1 class="text-2xl font-bold mb-4">Редактировать мероприятие</h1>

		<form @submit.prevent="updateEvent" class="space-y-4">
			<input
				v-model="title"
				type="text"
				placeholder="Название"
				class="border p-2 w-full rounded"
				required
			/>
			<textarea
				v-model="description"
				placeholder="Описание"
				class="border p-2 w-full rounded"
				required
			></textarea>
			<input
				v-model="date"
				type="date"
				class="border p-2 w-full rounded"
				required
			/>
			<input
				v-model="location"
				type="text"
				placeholder="Место"
				class="border p-2 w-full rounded"
				required
			/>
			<button type="submit" class="bg-blue-500 text-white p-2 rounded">
				Обновить мероприятие
			</button>
		</form>
	</div>
</template>

<script>
	import axios from "axios";
	import { ref } from "vue";
	import { useRoute, useRouter } from "vue-router";

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
						//`http://localhost:3000/events/${eventId}`,
						`http://176.32.33.100:3000/events/${eventId}`,
					);
					const event = response.data;
					title.value = event.title;
					description.value = event.description;
					date.value = event.date;
					location.value = event.location;
				} catch (error) {
					console.error("Ошибка при получении мероприятия:", error);
				}
			};

			const updateEvent = async () => {
				const eventId = route.params.id;
				try {
					//await axios.put(`http://localhost:3000/events/${eventId}`, {
					await axios.put(`http://176.32.33.100:3000/events/${eventId}`, {
						title: title.value,
						description: description.value,
						date: date.value,
						location: location.value,
					});
					alert("Мероприятие обновлено!");
					router.push(`/event/${eventId}`);
				} catch (error) {
					console.error("Ошибка при обновлении мероприятия:", error);
				}
			};

			getEvent();

			return { title, description, date, location, updateEvent };
		},
	};
</script>

<style>
	/* Стили */
</style>
