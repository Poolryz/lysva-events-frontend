<template>
  <div class="profile">
    <div class="profile__body">
      <div class="profile__content container">
        <ul class="profile__menu menu">
          <li class="menu__item"> My profile </li>
          <li class="menu__item"> Events </li>
          <li class="menu__item"> Security </li>
        </ul>
        <div class="profile__info">
          <img
            src="/src/assets/svg icon/avatar.png"
            alt=""
            class="profile__avatar"
          />
          <div class="profile__wrap">
            <div class="profile__name">{{ loginInfo.name }}</div>
            <div class="profile__org">{{ loginInfo.organization }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import urlChanger from '../services/constElement';

export default {
  data() {
    return {
      loginInfo: '',
    };
  },
  computed: {},
  methods: {
    async getLoginInfo() {
      try {
        const response = await axios.get(`${urlChanger()}login`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Отправляем токен для авторизации
          },
        });
        this.loginInfo = response.data;
      } catch (error) {
        console.log('Ошибка при получении информации пользователя', error);
      }
    },
  },
  created() {
    this.getLoginInfo();
  },
};
</script>
<style lang="scss">
.profile {
  &__body {
  }

  &__content {
  }

  &__menu {
  }

  &__info {
    display: flex;
    gap: 20px;
    align-items: center;
    border: 1px solid #000000;
    border-radius: 20px;
    margin: 20px 0 0 0;
    padding: 20px 10px;
  }

  &__avatar {
    width: 100px;
    border-radius: 50%;
  }

  &__wrap {
  }

  &__name {
  }

  &__org {
  }
}

.menu {
  width: 100%;
  height: 50px;
  padding: 0 0 0 20px;
  box-sizing: border-box;
  gap: 20px;
  display: flex;
  align-items: center;
  background-color: rgb(48, 48, 48);
  border-radius: 20px;
  list-style: none;

  &__item {
    cursor: pointer;
    border-radius: 20px;
    font-size: 22px;
    padding: 5px 15px;
    background-color: grey;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease-out;

    &:hover {
      background-color: rgb(155, 154, 154);
    }
  }
}
</style>
