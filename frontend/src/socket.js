import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

const socketMixin = {
    beforeRouteEnter(to, from, next) {
        const { id } = to.query;
        Vue.use(new VueSocketIO({
            debug: process.env.NODE_ENV === 'development',
            connection: SocketIO('http://localhost:8080', {query: {id}}),
        }));
        next();
    },

    beforeRouteLeave(to, from, next) {
        Vue.prototype.$socket.disconnect();
        next();
    },

    methods: {
        fetchFileContent(filePath) {
            Vue.prototype.$socket.emit('fetchFileContent', filePath, (fileContent) => {
                // Update the code data property with the fetched file content
                this.code = fileContent;
            });
        }
    }
};

export default socketMixin;