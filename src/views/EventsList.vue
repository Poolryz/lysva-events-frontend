<template>
	<section class="event-list">
		<div class="event-list__body">
			<div class="event-list__content container mx-auto px-4 py-6">
				<h2 class="text-2xl font-bold mb-4">Все мероприятия</h2>

				<!-- Поле для поиска -->
				<input v-model="searchQuery" @input="updateSearch" class="border rounded p-2 mb-4 w-full"
					placeholder="Поиск мероприятий" type="text" />

				<!-- Переключатель сортировки -->
				<div class="mb-4">
					<label class="mr-2">Сортировка:</label>
					<select v-model="sortOrder" @change="updateSortOrder" class="border p-2 rounded">
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
								<svg class="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor"
									viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M17.657 16.657L13 12m0 0L8.343 16.657M13 12l4.657-4.657M13 12L8.343 7.343M21 21L3 3">
									</path>
								</svg>
								<p class="text-gray-600">{{ event.location }}</p>
							</div>
							<div class="flex items-center mt-2">
								<svg class="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor"
									viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8">
									</path>
								</svg>
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
import { mapState, mapGetters, mapMutations } from "vuex";
import urlChanger from "../services/constElement";

export default {
	computed: {
		...mapState(["searchQuery", "sortOrder"]),
		...mapGetters(["filteredEvents"]),
	},
	methods: {
		urlChanger,
		...mapMutations(["SET_SEARCH_QUERY", "SET_SORT_ORDER"]),
		formatDate(dateString) {
			const date = new Date(dateString);
			return date.toLocaleDateString("ru-RU", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		},
		updateSearch(event) {
			this.SET_SEARCH_QUERY(event.target.value);
		},
		updateSortOrder(event) {
			this.SET_SORT_ORDER(event.target.value);
		},
		goToEvent(id) {
			this.$router.push({ name: "EventPage", params: { id } });
		},
	},
	created() {
		this.$store.dispatch("fetchEvents");
	},
};
</script>
