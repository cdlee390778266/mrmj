import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import VePie from 'v-charts/lib/pie.common'
import Filter from './js/filter'
import Utils from './js/utils'
import Dict from './js/dict'
import Validator from './js/validator'
import VuePreview from 'vue-preview'

import pageWrapper from './components/page/common/page-wrapper'

Vue.component(VePie.name, VePie)
Vue.component('pageWrapper', pageWrapper)

Vue.config.productionTip = false
Vue.prototype.$utils = Utils;
Vue.prototype.$dict = Dict;
Vue.prototype.$validator = Validator;
Vue.prototype.$filters = Vue.options.filters

Vue.use(ElementUI, {
    size: 'small'
});
Vue.use(VuePreview)

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = Utils.getStorage('token');
//     console.log(155)
//     if (!role) {
//         next('/login');
//     } else {
//         Utils.CONFIG.activeMenuType = Utils.getStorage('department');
//         next(`/${Utils.CONFIG.activeMenuType}/home`)
//     }
// })


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')