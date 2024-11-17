<template>
  <div class="edit-page">
    <div class="edit-page__body">
      <div class="edit-page__content container">
        <h1 class="edit-page__title">Редактировать мероприятие</h1>

        <form @submit.prevent="updateEvent" class="edit-page__form">
          <select v-model="dateType" class="edit-page__input">
            <option value="single">Одна дата</option>
            <option value="range">Период</option>
          </select>

          <input
            v-model="title"
            type="text"
            placeholder="Название"
            class="edit-page__input"
            required
          />
          <input v-model="date" type="date" class="edit-page__input" required />
          <input
            v-if="dateType === 'range'"
            v-model="endDate"
            type="date"
            class="edit-page__input"
            required
          />
          <QuillEditor
            contentType="html"
            v-model:content="description"
            toolbar="minimal"
            theme="snow"
          />
          <input
            v-model="location"
            type="text"
            placeholder="Место"
            class="edit-page__input"
            required
          />
          <input
            type="file"
            @change="onFileChange"
            class="edit-page__input-file"
            accept="image/*"
          />
          <img class="edit-page__image" :src="urlChanger() + image" alt="" />
          <button type="submit" class="edit-page__submit">
            Обновить мероприятие
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import urlChanger from '../services/constElement';
import { QuillEditor } from '@vueup/vue-quill';

export default {
  name: 'EditEventPage',
  components: {
    QuillEditor,
  },
  data() {
    return {
      title: '',
      description: '',
      date: '',
      endDate: '',
      dateType: '',
      time: '',
      location: '',
      image: null,
    };
  },
  // Получаем данные маршрута и роутера
  setup() {
    return {
      route: useRoute(),
      router: useRouter(),
    };
  },
  methods: {
    urlChanger,
    // Метод для изменения файла изображения
    onFileChange(event) {
      this.image = event.target.files[0];
    },
    // Получение данных мероприятия
    async getEvent() {
      const eventId = this.route.params.id;
      try {
        const response = await axios.get(`${urlChanger()}events/${eventId}`);
        const event = response.data;

        // Заполняем данные для редактирования
        this.title = event.title;
        this.description = event.description;
        this.date = event.date?.split('T')[0] || ''; // Начальная дата
        this.endDate = event.endDate?.split('T')[0] || ''; // Конечная дата
        this.dateType = event.endDate ? 'range' : 'single'; // Определяем тип даты
        this.location = event.location;
        this.image = event.image;
      } catch (error) {
        alert('Ошибка при получении мероприятия. Попробуйте еще раз.');
        console.error('Ошибка при получении мероприятия:', error);
      }
    },

    // Обновление мероприятия
    async updateEvent() {
      const eventId = this.route.params.id;
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Токен отсутствует');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('date', this.date);
        if (this.dateType === 'range') {
          formData.append('endDate', this.endDate); // Добавляем дату конца
        }
        formData.append('location', this.location);
        if (this.image && typeof this.image !== 'string') {
          formData.append('image', this.image); // Новое изображение
        } else {
          formData.append('currentImage', this.image); // Указание текущего изображения
        }

        // Отправка данных
        await axios.put(`${urlChanger()}events/${eventId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Мероприятие обновлено!');
        this.router.push(`/event/${eventId}`);
      } catch (error) {
        alert('Ошибка при обновлении мероприятия. Попробуйте еще раз.');
        console.error('Ошибка при обновлении мероприятия:', error);
      }
    },
  },
  // Монтирование и вызов метода getEvent
  created() {
    this.getEvent();
  },
};
</script>

<style lang="scss" scoped>
.edit-page {
  &__body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }

  &__content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 600px;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: #007bff;
    }
  }

  &__input-file {
    font-size: 0.9rem;
  }

  &__image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 1rem;
    object-fit: cover;
    max-height: 300px;
  }

  &__submit {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
