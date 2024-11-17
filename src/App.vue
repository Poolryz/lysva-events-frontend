<template>
  <div>
    <HeaderComponent class="py-3" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
export default {
  name: 'App',
  components: {
    HeaderComponent,
  },
};
</script>

<style>
.fade-enter-active {
  transition: opacity 1s ease, transform 1s ease;
  /* Плавный переход для opacity и transform */
}

.fade-leave-active {
  transition: opacity 0.5s ease;
  /* Плавный переход для исчезновения */
}

.fade-enter {
  opacity: 0;
  transform: scale(0.95);
  /* Легкое уменьшение для эффекта */
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
  /* Возвращение к нормальному размеру */
}

.fade-leave-to {
  opacity: 0;
}
</style>
