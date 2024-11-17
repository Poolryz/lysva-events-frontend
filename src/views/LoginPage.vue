<template>
	<form @submit.prevent="loginSubmit" class="form-login">
		<div class="form-login__body">
			<div class="form-login__content container">
				<input v-model="login" type="text" placeholder="Логин" class="form-login__input" required />
				<input v-model="password" type="password" placeholder="Пароль" class="form-login__input" required />
				<button type="submit" class="form-login__submit">
					Войти
				</button>
			</div>
		</div>
	</form>
</template>

<script>
import axios from "axios";
import urlChanger from "../services/constElement";
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
				const response = await axios.post(`${urlChanger()}login`, {
					//const response = await axios.post("http://176.32.33.100:3000/login", {
					login: this.login,
					password: this.password,
				});
				if (response.data.message) {
					const message = response.data.message;
					alert(message);
				} else {
					// Сохраняем токен на клиенте
					const token = response.data.token;
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
				this.$router.push("/");
			} catch (error) {
				console.error("Ошибка при входе", error);
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.form-login {
	&__body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f9f9f9;
	}

	&__content {
		width: 100%;
		max-width: 400px;
		padding: 20px;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	&__input {
		width: 100%;
		padding: 10px 15px;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		margin: 0 0 20px;
	}

	&__input:focus {
		border-color: #007bff;
		outline: none;
	}

	&__submit {
		width: 100%;
		padding: 10px 15px;
		border: none;
		background-color: #007bff;
		color: #fff;
		font-size: 16px;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;

		&:hover {
			background-color: #0056b3;
		}
	}
}

</style>
