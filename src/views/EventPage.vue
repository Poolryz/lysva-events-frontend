<template>
  <div class="event">
    <div class="event__body container">
      <div class="event__content">
        <div class="event__preview">
          <div class="event__wrap-img">
            <img
              class="event__img"
              :src="urlChanger() + event.image"
              alt="Event Image"
            />
          </div>
          <div class="event__text-preview">
            <h2 class="event__title">{{ event.title }}</h2>
            <CalendarIcon class="icon" />
            <div class="event__date"
              >{{ formatDate(event.date) }}
              <div
                class="stock"
                style="display: inline-block"
                v-if="event.endDate"
                >-</div
              >
              {{ formatDate(event.endDate) }}</div
            >
            <ClockIcon class="icon" v-if="event.time" />
            <div class="event__time" v-if="event.time">{{ event.time }}</div>
            <MapPinIcon class="icon" />
            <div class="event__location">{{ event.location }}</div>
          </div>
        </div>

        <div class="event__wrap">
          <div class="event__text ql-editor" v-html="event.description"></div>

          <button @click="expText" class="event__btm-exp">Читать далее</button>
          <button @click="goBack" class="event__btm-back">Назад</button>

          <!-- Отображаем кнопки только если текущий пользователь авторизован и является автором мероприятия -->

          <div class="event__btms" v-if="isAuthorized && userId">
            <button @click="goToEdit" class="event__btm-edit">
              Редактировать
            </button>
            <button @click="deleteEvent" class="event__btm-del">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import urlChanger from '../services/constElement';
import { MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'EventPage',
  components: {
    MapPinIcon,
    CalendarIcon,
    ClockIcon,
  },

  data() {
    return {
      event: {}, // Данные мероприятия
      userId: null, // ID пользователя
      isAuthorized: false, // Проверка, авторизован ли пользователь
    };
  },

  methods: {
    urlChanger,
    // Получаем данные токена
    getTokenData() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload;
        } catch (error) {
          console.error('Ошибка при декодировании токена:', error);
          return null;
        }
      }
      return null;
    },
    // Форматирование даты
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2);
      const monthNames = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
      ];
      const month = monthNames[date.getMonth()]; // Получаем название месяца

      const year = date.getFullYear();
      return `${day} ${month} ${year}`; // Форматирование в dd.MM.yyyy
    },
    // Получаем данные мероприятия
    async getEvent() {
      const eventId = this.$route.params.id; // Получаем ID из параметров маршрута
      try {
        const response = await axios.get(`${urlChanger()}events/${eventId}`);
        this.event = response.data; // Сохраняем данные мероприятия

        // Проверяем токен и авторство
        const tokenData = this.getTokenData();
        if (tokenData) {
          this.userId = tokenData.userId === this.event.userId; // Проверка авторства
          this.isAuthorized = true; // Устанавливаем, что пользователь авторизован
        }
      } catch (error) {
        alert('Ошибка при получении мероприятия. Попробуйте еще раз.'); // Добавлено сообщение об ошибке
        console.error('Ошибка при получении мероприятия:', error);
      }
    },
    expText() {
      const text = document.querySelector('.event__text');
      text.classList.toggle('expanded');
      const btm = document.querySelector('.event__btm-exp');
      btm.textContent = text.classList.contains('expanded')
        ? 'Свернуть'
        : 'Читать далее';
    },
    // Переход назад
    goBack() {
      this.$router.go(-1);
    },
    // Переход на страницу редактирования
    goToEdit() {
      this.$router.push({
        name: 'EditEventPage',
        params: { id: this.$route.params.id },
      });
    },
    // Удаление мероприятия
    async deleteEvent() {
      if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
        try {
          await axios.delete(`${urlChanger()}events/${this.$route.params.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Отправляем токен для авторизации
            },
          });
          alert('Мероприятие удалено');
          this.$router.push('/'); // Переход на список мероприятий после удаления
        } catch (error) {
          alert('Ошибка при удалении мероприятия. Попробуйте еще раз.'); // Добавлено сообщение об ошибке
          console.error('Ошибка при удалении мероприятия:', error);
        }
      }
    },
  },
  created() {
    this.getEvent(); // Получаем данные при загрузке компонента
  },
};
</script>

<style lang="scss" scoped>
.event {
  &__body {
  }

  &__content {
  }

  &__preview {
    overflow: hidden;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: flex-end;
    position: relative;
    max-height: 550px;
    background: rgb(126, 126, 129);
    background: linear-gradient(
      90deg,
      rgba(126, 126, 129, 1) 0%,
      rgba(226, 226, 231, 1) 86%,
      rgba(176, 180, 181, 1) 100%
    );
    @media (max-width: 768px) {
      height: 350px;
    }
  }

  &__wrap-img {
    border-radius: 20px 0 0 20px;
    overflow: hidden;
    width: 40%;

    img {
      width: 100%;
    }
    @media (max-width: 768px) {
      height: 100%;

      width: inherit;
    }
  }

  &__text-preview {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }

  &__title {
    font-size: 50px;
    color: white;
    margin-bottom: 10px;
    @media (max-width: 768px) {
      font-size: 30px;
    }
  }

  &__date,
  &__location,
  &__time {
    color: white;
    font-size: 20px;
    margin-left: 10px;
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  &__date,
  &__time {
    display: inline-block;
    margin-right: 20px;
  }

  &__location {
    display: inline-block;
  }

  &__wrap {
    padding: 5px 10px;
    border: 1px solid rgb(156, 156, 156);
    border-radius: 0 0 20px 20px;
    position: relative;
  }

  &__text {
    padding: 20px 0;
    margin: 0 auto;
    color: #333;
    line-height: 1.5;
    overflow: hidden;
    height: 100px;
    transition: height 0.3s ease;

    &.expanded {
      height: auto;
    }
  }

  &__btm-exp {
    border: none;
    background-color: inherit;
    position: absolute;
    right: 20px;
    cursor: pointer;
    padding: 5px 10px;
    transition: all 0.3s ease-out;

    &:hover {
      color: rgb(98, 83, 238);
    }
  }

  &__btms {
    & button:hover {
      transform: scale(1.05);
    }
  }

  &__btm-back,
  &__btm-edit,
  &__btm-del {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    display: inline-block;
  }

  &__btm-back {
    background-color: #f0f0f0;
    color: #333;
    margin: 10px;
    &:hover {
      transform: scale(1.05);
    }
  }

  &__btm-edit {
    background-color: #007bff;
    color: white;
    margin: 10px;
  }

  &__btm-del {
    background-color: #dc3545;
    color: white;
  }
}
</style>
