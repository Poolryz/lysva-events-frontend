<template>
	<section class="event-list">
		<div class="event-list__body">
			<div class="event-list__content container mx-auto px-4 py-6">
				<h2 class="text-2xl font-bold mb-4">Все мероприятия</h2>

				<!-- Поле для поиска -->
				<input v-model="searchQuery" class="border rounded p-2 mb-4 w-full" placeholder="Поиск мероприятий"
					type="text" />

				<!-- Переключатель сортировки -->
				<div class="mb-4">
					<label class="mr-2">Сортировка:</label>
					<select v-model="sortOrder" class="border p-2 rounded">
						<option value="asc">По возрастанию (ближайшие)</option>
						<option value="desc">По убыванию (поздние)</option>
					</select>
				</div>

				<div v-if="filteredEvents.length">
					<!-- Список мероприятий -->
					<div v-for="event in filteredEvents" :key="event._id" @click="goToEvent(event._id)"
						class="max-w-sm rounded overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl inline-block m-5 cursor-pointer">
						<img class="w-full h-48 object-cover" :src="urlChanger() + event.image" alt="Event Image">
						<div class="px-6 py-4">
							<div class="font-bold text-xl mb-2">{{ event.title }}</div>
							<p class="text-gray-700 text-base">
								Краткое описание мероприятия, которое даёт общее представление о событии.
							</p>
						</div>
						<div class="px-6 py-4">
							<div class="flex items-center">
								<MapPinIcon class="w-5 h-5 text-gray-700 mr-2" />
								<p class="text-gray-600">{{ event.location }}</p>
							</div>
							<div class="flex items-center mt-2">
								<CalendarIcon class="w-5 h-5 text-gray-700 mr-2" />
								<p class="text-gray-600">{{ formatDate(event.date) }}</p>
							</div>
						</div>
					</div>
				</div>

				<div v-else>
					<p>Мероприятий пока нет.</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import axios from "axios";
import urlChanger from "../services/constElement";
import { MapPinIcon, CalendarIcon } from '@heroicons/vue/24/solid';

export default {
	components: {
		MapPinIcon,
		CalendarIcon
	},
	data() {
		return {
			events: [],
			searchQuery: "",
			sortOrder: "asc", // 'asc' для ближайших событий или 'desc' для обратного порядка
			loading: false,
		};
	},
	computed: {
		filteredEvents() {
			return this.events
				.filter((event) =>
					event.title.toLowerCase().includes(this.searchQuery.toLowerCase())
				)
				.sort((a, b) => {
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);
					return this.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
				});
		},
	},
	methods: {
		async fetchEvents() {
			this.loading = true;
			try {
				const response = await axios.get(`${urlChanger()}events`);
				this.events = response.data;
			} catch (error) {
				console.error("Ошибка при получении мероприятий:", error);
			} finally {
				this.loading = false;
			}
		},
		formatDate(dateString) {
			const date = new Date(dateString);
			return date.toLocaleDateString("ru-RU", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		},
		goToEvent(id) {
			this.$router.push({ name: "EventPage", params: { id } });
		},
		urlChanger,
	},
	created() {
		this.fetchEvents();
	},
};
</script>
