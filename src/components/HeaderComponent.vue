<template>
  <header class="header">
    <div class="header__body container">
      <div class="header__content">
        <nav class="nav">
          <router-link class="nav__link" to="/">Все мероприятия</router-link> |
          <router-link v-if="token" class="nav__link" to="/create"
            >Создать мероприятие</router-link
          >|
          <router-link v-if="!token" class="nav__link" to="/login"
            >Войти как редактор</router-link
          >
          <router-link v-else class="nav__link" to="/profile"
            >Профиль</router-link
          >
        </nav>
        <div @click="toggleBurger" class="burger">
          <div></div>
          <div class="burger__center"></div>
          <div></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      token: localStorage.getItem('token') || '',
    };
  },
  methods: {
    toggleBurger() {
      const nav = document.querySelector('.nav');
      const burger = document.querySelector('.burger');

      nav.classList.toggle('nav_active');
      burger.classList.toggle('burger_active');
    },
    updateToken() {
      this.token = localStorage.getItem('token');
    },
  },
  mounted() {
    // Первоначальная установка токена при загрузке компонента
    this.updateToken();

    // Слушаем изменения в localStorage
    window.addEventListener('storage', this.updateToken);

    // Проверяем localStorage каждые 500 мс (на случай, если storage событие не сработает)
    this.tokenCheckInterval = setInterval(() => {
      this.updateToken();
    }, 500);
  },
  beforeDestroy() {
    // Убираем обработчики событий
    window.removeEventListener('storage', this.updateToken);
    clearInterval(this.tokenCheckInterval);
  },
};
</script>

<style lang="scss" scoped>
.header {
  &__body {
    background-color: rgb(48, 48, 48);
    border-radius: 0 0 20px 20px;
    margin-bottom: 20px;
  }

  &__content {
    height: 80px;
    @media (max-width: 768px) {
      display: flex;
      justify-content: end;
      gap: 20px;
      align-items: center;
      position: relative;
    }
  }
}

.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  transition: all 0.3s ease-out;
  @media (max-width: 768px) {
    position: absolute;
    z-index: 10000;
    flex-direction: column;
    background-color: rgb(48, 48, 48);
    padding: 20px 10px;
    border-radius: 0 0 20px 20px;
    transform: translate(0, -100%);
    height: max-content;
    &_active {
      transform: translate(0, 70%);
    }
  }

  &__link {
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
.burger {
  width: 40px;
  height: 25px;
  position: relative;
  display: none;
  cursor: pointer;
  box-sizing: border-box;

  div {
    position: absolute;
    width: 100%;
    background-color: white;
    height: 3px;
    box-sizing: border-box;
    transform-origin: center;
    transition: all 0.3s ease-out;
    &:first-child {
      transform: translate(0, 12.5px) rotate(0);
    }
    &:last-child {
      transform: translate(0, 25px) rotate(0);
    }
  }
  &_active {
    div {
      &:first-child {
        transform: translate(0, 12.5px) rotate(45deg);
      }
      &:last-child {
        transform: translate(0, 12.5px) rotate(-45deg);
      }
    }
    .burger__center {
      opacity: 0x;
    }
  }
  @media (max-width: 768px) {
    display: inline-block;
  }
}
</style>
