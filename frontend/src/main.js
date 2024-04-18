import Vue from "vue";
import App from "./App.vue";
import router from './router'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/arya-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import { SocketPlugin } from './socket';

Vue.use(PrimeVue);
Vue.use(SocketPlugin, {
    // url: process.env.VUE_APP_WS,
});
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')