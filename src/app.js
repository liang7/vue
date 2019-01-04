import Vue from 'vue'
import App from './app.vue'
import VueRouter from "vue-router"
import routes from "./routers/index"
import store from './store/index'
import http from './utils/http'
import MetaInfo from 'vue-meta-info'

Vue.prototype.$store = store
Vue.prototype.$http = http

Vue.config.productionTip = false

Vue.use(MetaInfo)
/**
 * 全局路由注册
 */
Vue.use(VueRouter)

/**
 * 路由设置
 */
const router = new VueRouter(routes);

new Vue({
    el: "#app",
    store,
    router,
    // mounted() {
    //     document.dispatchEvent(new Event('render-event'))
    // },
    render: h => h(App)
});
