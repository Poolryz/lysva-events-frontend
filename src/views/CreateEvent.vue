<template>
  <div class="create-event">
    <h1 class="create-event__title">Создать мероприятие</h1>

    <!-- Уведомление об успешном создании мероприятия -->
    <div
      v-if="showSuccessMessage"
      class="create-event__message create-event__message--success"
    >
      Мероприятие успешно создано!
    </div>

    <form @submit.prevent="createEvent" class="create-event__form">
      <!-- Выбор типа даты -->
      <select v-model="dateType" class="create-event__input">
        <option value="single">Одна дата</option>
        <option value="range">Период</option>
      </select>

      <!-- Поля для ввода даты -->
      <input v-model="date" type="date" class="create-event__input" required />

      <!-- Показывать только при выборе "Период" -->
      <input
        v-if="dateType === 'range'"
        v-model="endDate"
        type="date"
        class="create-event__input"
        required
      />

      <!-- Поле для времени (независимо от типа даты) -->
      <input
        v-model="time"
        type="time"
        class="create-event__input"
        placeholder="Время"
      />

      <!-- Остальные поля формы -->
      <input
        v-model="title"
        type="text"
        placeholder="Название"
        class="create-event__input"
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
        class="create-event__input"
        required
      />
      <input
        type="file"
        @change="onFileChange"
        class="create-event__file-input"
        accept="image/*"
      />
      <button type="submit" class="create-event__button"
        >Создать мероприятие</button
      >
    </form>
  </div>
</template>

<script>
import urlChanger from '../services/constElement';
import axios from 'axios';
import { QuillEditor } from '@vueup/vue-quill';

export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      title: '',
      description: '',
      date: '',
      endDate: '',
      time: '',
      location: '',
      dateType: 'single',
      userId: '',
      file: '',
      showSuccessMessage: false,
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async createEvent() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Токен не найден. Авторизуйтесь заново.');
        }

        let formData = new FormData();
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('location', this.location);
        formData.append('userId', JSON.parse(atob(token.split('.')[1])).userId);
        formData.append('image', this.file);

        // Добавляем дату и время
        formData.append('dateType', this.dateType);
        formData.append('date', this.date);
        if (this.dateType === 'range') {
          formData.append('endDate', this.endDate);
        }
        formData.append('time', this.time); // Время добавляем всегда

        await axios.post(`${urlChanger()}events`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        // Сброс формы
        this.title = '';
        this.description = '';
        this.date = '';
        this.endDate = '';
        this.time = '';
        this.location = '';
        this.file = null;

        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      } catch (error) {
        console.error('Ошибка при создании мероприятия:', error);
        alert('Ошибка! Возможно, вы не авторизованы.');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.create-event {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &__title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #343a40;
  }

  &__message {
    padding: 12px;
    margin-bottom: 16px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;

    &--success {
      background-color: #28a745;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__input {
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 16px;
    color: #495057;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    &--textarea {
      min-height: 80px;
      resize: vertical;
    }
  }

  &__file-input {
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background-color: #ffffff;
    font-size: 16px;
    color: #495057;
    cursor: pointer;
  }

  &__button {
    padding: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
