import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
	state: {
		events: [],
		searchQuery: "",
		sortOrder: "asc", // 'asc' для ближайших событий или 'desc' для обратного порядка
		loading: false,
	},
	mutations: {
		SET_EVENTS(state, events) {
			state.events = events;
		},
		SET_SEARCH_QUERY(state, query) {
			state.searchQuery = query;
		},
		SET_SORT_ORDER(state, order) {
			state.sortOrder = order;
		},
		SET_LOADING(state, isLoading) {
			state.loading = isLoading;
		},
	},
	actions: {
		async fetchEvents({ commit }) {
			commit("SET_LOADING", true);
			try {
				//const response = await axios.get("http://localhost:3000/events");
				const response = await axios.get("http://176.32.33.100/:3000/events");
				commit("SET_EVENTS", response.data);
			} catch (error) {
				console.error("Ошибка при получении мероприятий:", error);
			} finally {
				commit("SET_LOADING", false);
			}
		},
	},
	getters: {
		filteredEvents(state) {
			return state.events
				.filter((event) =>
					event.title.toLowerCase().includes(state.searchQuery.toLowerCase()),
				)
				.sort((a, b) => {
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);
					return state.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
				});
		},
	},
});

export default store;
