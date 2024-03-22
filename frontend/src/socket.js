import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

export const SocketPlugin = {
    install(Vue, options) {
        Vue.use(new VueSocketIO({
            connection: SocketIO(options.url, options.opts),
            vuex: options.vuex
        }));
    }
};