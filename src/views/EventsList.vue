<template>
  <section class="event-list">
    <div class="event-list__body container">
      <div class="event-list__content">
        <!-- Поле для поиска -->
        <input
          v-model="searchQuery"
          class="event-list__search"
          placeholder="Поиск мероприятий"
          type="text"
        />

        <!-- Переключатель сортировки -->
        <div class="event-list__wrap">
          <label class="event-list__sort-title">Сортировка:</label>
          <select v-model="sortOrder" class="event-list__sort">
            <option value="asc">По возрастанию (ближайшие)</option>
            <option value="desc">По убыванию (поздние)</option>
          </select>
        </div>

        <div class="event-list__filter" v-if="filteredEvents.length">
          <!-- Список мероприятий -->
          <div
            v-for="event in filteredEvents"
            :key="event._id"
            @click="goToEvent(event._id)"
            class="event-list__item"
          >
            <img
              class="event-list__image"
              :src="urlChanger() + event.image"
              alt="Event Image"
            />
            <div class="event-list__text">
              <div class="event-list__title">{{ event.title }}</div>
              <p class="event-list__desc">
                {{ event.description }}
              </p>
            </div>
            <div class="event-list__text">
              <div class="event-list__wrap">
                <MapPinIcon class="icon" />
                <p class="event-list__text-info">{{ event.location }}</p>
              </div>
              <div class="event-list__wrap">
                <CalendarIcon class="icon" />
                <p class="event-list__text-info">
                  <!-- Отображение даты и времени -->
                  <span v-if="event.dateType === 'single'">
                    {{ formatDate(event.date)
                    }}{{ event.time ? ', ' + event.time : '' }}
                  </span>
                  <span v-else>
                    {{ formatDate(event.date) }} -
                    {{ formatDate(event.endDate) }}
                    {{ event.time ? ', ' + event.time : '' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <p class="event-list__span">Мероприятий пока нет.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import urlChanger from '../services/constElement';
import { MapPinIcon, CalendarIcon } from '@heroicons/vue/24/solid';

export default {
  components: {
    MapPinIcon,
    CalendarIcon,
  },
  data() {
    return {
      events: [],
      searchQuery: '',
      sortOrder: 'asc', // 'asc' для ближайших событий или 'desc' для обратного порядка
      loading: false,
    };
  },
  computed: {
    filteredEvents() {
      return this.events
        .filter((event) =>
          event.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    },
  },
  methods: {
    async fetchEvents() {
      this.loading = true;
      try {
        const response = await axios.get(`${urlChanger()}events`);
        this.events = response.data;
      } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
    goToEvent(id) {
      this.$router.push({ name: 'EventPage', params: { id } });
    },
    urlChanger,
  },
  created() {
    this.fetchEvents();
  },
};
</script>

<style scoped lang="scss">
.event-list {
  padding: 30px 0;
  background-color: #f8f9fa;

  &__body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  // Стили для поля поиска
  &__search {
    padding: 12px 15px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 16px;
    width: 100%;
    max-width: 300px;
    margin-bottom: 20px;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }

  // Стили для обертки сортировки
  &__wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  // Стили для сортировки
  &__sort-title {
    font-weight: bold;
    color: #495057;
  }

  &__sort {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    background-color: #ffffff;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }

  &__filter {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  // Стили для элемента мероприятия
  &__item {
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 20px 40px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    @media (max-width: 768px) {
      padding: 5px 20px;
    }
  }

  &__image {
    max-width: 300px;
    object-fit: cover;
    border-radius: 5px;
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #495057;

    & > .event-list__title {
      font-size: 22px;
      font-weight: 600;
      color: #343a40;
      margin-bottom: 10px;
      margin-top: 5px;
    }

    & > .event-list__desc {
      display: none;
      font-size: 14px;
      color: #6c757d;
      line-height: 1.4;
      max-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__text-info {
      color: #6c757d;
      font-size: 14px;
    }
  }

  // Стили для текста с иконками
  &__wrap .icon {
    color: #007bff;
  }

  // Стили для сообщения "Мероприятий пока нет"
  &__span {
    font-size: 18px;
    color: #6c757d;
    text-align: center;
    padding: 20px 0;
  }
}
</style>
