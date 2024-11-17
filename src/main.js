import { createApp } from 'vue';
import App from './App.vue';
//import './reset.scss';
import './index.scss';
import '../ql.css';
import router from './router';

createApp(App).use(router).mount('#app');
