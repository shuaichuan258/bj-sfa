import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './lib/hotcss.js';
import VeeValidate from 'vee-validate';
import 'mint-ui/lib/style.css';
import helper from './lib/helper';
import TopHead from './components/TopHead';

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component('TopHead', TopHead);

router.beforeEach((to, from, next) => {
  if (to.path != '/') {
    // 校验用户是否登录
    if (helper.getTypes(store.getters.getLoginUser) === 'Object') {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
