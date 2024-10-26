<template>
	<header class="bg-gray-800">
		<div class="header__body">
			<div class="header__content container px-4 mx-auto">
				<nav class="flex justify-between">
					<router-link class="nav-link" to="/">Все мероприятия</router-link> |
					<router-link v-if="token" class="nav-link" to="/create"
						>Создать мероприятие</router-link
					>| 
					<router-link v-if="!token" class="nav-link" to="/login"
						>Войти как редактор</router-link
					>
					<router-link v-else class="nav-link" to="/profile"
						>Профиль</router-link
					>
				</nav>
			</div>
		</div>
	</header>
</template>

<script>
	export default {
		name: "HeaderComponent",
		data() {
			return {
				token: localStorage.getItem('token') || ""
			};
		},
		methods: {
			updateToken() {
				this.token = localStorage.getItem('token');
			}
		},
		mounted() {
			// Первоначальная установка токена при загрузке компонента
			this.updateToken();

			// Слушаем изменения в localStorage
			window.addEventListener("storage", this.updateToken);

			// Проверяем localStorage каждые 500 мс (на случай, если storage событие не сработает)
			this.tokenCheckInterval = setInterval(() => {
				this.updateToken();
			}, 500);
		},
		beforeDestroy() {
			// Убираем обработчики событий
			window.removeEventListener("storage", this.updateToken);
			clearInterval(this.tokenCheckInterval);
		}
	};
</script>

<style scoped>
	.nav-link {
		@apply relative inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white;
	}
</style>
