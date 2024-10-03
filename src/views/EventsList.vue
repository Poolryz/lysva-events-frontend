<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Все мероприятия</h1>
    <div v-if="events.length">
      <ul class="space-y-4">
        <li v-for="event in events" :key="event._id" class="p-4 border rounded shadow-md">
          <h2 class="text-xl font-semibold">{{ event.title }} — {{ event.date }}</h2>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Мероприятий пока нет.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: []
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/events');
      this.events = response.data;
    } catch (error) {
      console.error('Ошибка при получении мероприятий:', error);
    }
  }
};
</script>
