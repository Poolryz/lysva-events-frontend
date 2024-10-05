<template>
	<section class="event-list">
		<div class="event-list__body">
			<div class="event-list__content container mx-auto px-4 py-6">
				<h2 class="text-2xl font-bold mb-4">Все мероприятия</h2>

				<!-- Поле для поиска -->
				<input
					v-model="searchQuery"
					@input="updateSearch"
					class="border rounded p-2 mb-4 w-full"
					placeholder="Поиск мероприятий"
					type="text"
				/>

				<!-- Переключатель сортировки -->
				<div class="mb-4">
					<label class="mr-2">Сортировка:</label>
					<select
						v-model="sortOrder"
						@change="updateSortOrder"
						class="border p-2 rounded"
					>
						<option value="asc">По возрастанию (ближайшие)</option>
						<option value="desc">По убыванию (поздние)</option>
					</select>
				</div>

				<!-- Список мероприятий -->
				<div v-if="filteredEvents.length">
					<ul class="flex justify-betwen flex-wrap font">
						<li
							v-for="event in filteredEvents"
							:key="event._id"
							class="w-1/5 m-1 flex flex-col items-center cursor-pointer"
							@click="goToEvent(event._id)"
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
	import { mapState, mapGetters, mapMutations } from "vuex";
	import axios from "axios";
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";

	export default {
		computed: {
			...mapState(["searchQuery", "sortOrder"]),
			...mapGetters(["filteredEvents"]),
		},
		methods: {
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
		},
		created() {
			this.$store.dispatch("fetchEvents");
		},
		setup() {
			const events = ref([]);
			const router = useRouter();

			const fetchEvents = async () => {
				try {
					//const response = await axios.get("http://localhost:3000/events");
					const response = await axios.get("http://176.32.33.100:3000/events");
					events.value = response.data;
				} catch (error) {
					console.error("Ошибка при получении мероприятий:", error);
				}
			};

			const goToEvent = (id) => {
				router.push({ name: "EventPage", params: { id } }); // Переход на страницу мероприятия
			};

			onMounted(fetchEvents); // Получаем события при монтировании компонента

			return { events, goToEvent };
		},
	};
</script>
