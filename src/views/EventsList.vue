<template>
	<section class="event-list">
		<div class="event-list__body">
			<div class="event-list__content container mx-auto px-4 py-6">
				<h2 class="text-2xl font-bold mb-4">Все мероприятия</h2>

				<!-- Поле для поиска -->
				<input
					v-model="searchQuery"
					@input="fetchEvents"
					class="border rounded p-2 mb-4 w-full"
					placeholder="Поиск мероприятий"
					type="text"
				/>

				<!-- Переключатель для сортировки -->
				<div class="mb-4">
					<label for="sortOrder" class="mr-2">Сортировка:</label>
					<select
						v-model="sortOrder"
						@change="sortEvents"
						class="border p-2 rounded"
					>
						<option value="asc">По возрастанию даты</option>
						<option value="desc">По убыванию даты</option>
					</select>
				</div>

				<div v-if="events.length">
					<ul class="flex justify-between flex-wrap font">
						<li
							v-for="event in events"
							:key="event._id"
							class="w-1/5 m-1 flex flex-col items-center"
						>
							<img
								class="w-fit"
								src="https://avatars.mds.yandex.net/get-ydo/2793943/2a0000017352e4846fc9fd47159986496caf/diploma"
								alt=""
							/>
							<h3 class="text-xl font-semibold text-center my-2">
								{{ event.title }}
							</h3>
							<span class="text-xs font-normal">
								{{ formatDate(event.date) }}
							</span>
							<p class="text-base">{{ event.location }}</p>
						</li>
					</ul>
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

	export default {
		data() {
			return {
				events: [],
				searchQuery: "", // Поле для поиска
				sortOrder: "asc", // По умолчанию сортировка по возрастанию
			};
		},
		async created() {
			// Загружаем мероприятия при загрузке компонента
			await this.fetchEvents();
			this.sortEvents(); // Сортируем после загрузки
		},
		methods: {
			// Получение мероприятий с фильтрацией
			async fetchEvents() {
				try {
					const params = this.searchQuery ? { search: this.searchQuery } : {};
					const response = await axios.get("http://localhost:3000/events", {
						params,
					});
					this.events = response.data;
					this.sortEvents(); // Сортируем после получения данных
				} catch (error) {
					console.error("Ошибка при получении мероприятий:", error);
				}
			},
			// Функция сортировки мероприятий в зависимости от выбранного значения
			sortEvents() {
				this.events.sort((a, b) => {
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);
					if (this.sortOrder === "asc") {
						return dateA - dateB; // По возрастанию
					} else {
						return dateB - dateA; // По убыванию
					}
				});
			},
			// Функция форматирования даты
			formatDate(dateString) {
				const date = new Date(dateString);
				return date.toLocaleDateString("ru-RU", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
			},
		},
	};
</script>
