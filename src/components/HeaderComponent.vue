<template>
	<header class="bg-gray-800">
		<div class="header__body">
			<div class="header__content container px-4 mx-auto flex justify-between">
				<nav>
					<router-link class="nav-link" to="/">Все мероприятия</router-link> |
					<router-link class="nav-link" to="/create"
						>Создать мероприятие</router-link
					>|
					<router-link class="nav-link" to="/login"
						>Войти как редактор</router-link
					>
				</nav>
			</div>
		</div>
	</header>
</template>
<script>
	export default {
		name: "HeaderComponent",
	};
</script>
<style scoped>
	.nav-link {
		@apply relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white;
	}
</style>
