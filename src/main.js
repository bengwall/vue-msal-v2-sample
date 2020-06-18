import Vue from 'vue';
import App from './App.vue';
import router from './router';
import AuthService from './services/auth-service';

Vue.config.productionTip = false;

Vue.prototype.$auth = new AuthService();
console.log('created AuthService');

Vue.prototype.$auth.init().then(() => {
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
});
