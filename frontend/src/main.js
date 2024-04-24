import Vue from "vue";
import App from "./App.vue";
import router from './router'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/arya-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

Vue.use(PrimeVue);
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')