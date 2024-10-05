<template>
	<div>
		<form @submit.prevent="loginSubmit" class="flex flex-col items-center">
			<input
				v-model="login"
				type="text"
				placeholder="Логин"
				class="border p-2 w-1/4 rounded my-3"
				required
			/>
			<input
				v-model="password"
				type="text"
				placeholder="Пароль"
				class="border p-2 w-1/4 rounded mb-3"
				required
			/>
			<button type="submit" class="bg-blue-500 text-white p-2 rounded w-1/4">
				Войти
			</button>
		</form>
	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "LoginPage",
		data() {
			return {
				login: "",
				password: "",
				showSuccessMessage: false, // Показывать или нет уведомление
			};
		},
		methods: {
			async loginSubmit() {
				try {
					// Отправляем запрос на сервер с логином и паролем
					//const response = await axios.post("http://localhost:3000/login", {
					const response = await axios.post("http://176.32.33.100:3000/login", {
						login: this.login,
						password: this.password,
					});
					if (response.data.message) {
						const message = response.data.message;
						alert(message);
					} else {
						// Сохраняем токен на клиенте
						const token = response.data.token; // Здесь ты получаешь токен от сервера
						localStorage.setItem("token", token);
					}

					// Сбросить форму
					this.login = "";
					this.password = "";

					// Показать уведомление об успешном создании
					this.showSuccessMessage = true;

					// Автоматически скрыть уведомление через 3 секунды
					setTimeout(() => {
						this.showSuccessMessage = false;
					}, 3000);
				} catch (error) {
					console.error("Ошибка при входе", error);
				}
			},
		},
	};
</script>
<style></style>
