export default {
    scrollBehavior(to, from, savedPosition) { //切换路由滚动至顶部
        if (to.meta.keepAlive) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    },
    mode: 'history',
    routes: [
        /**
         * ===================================================================
         *                              配置说明
         * ===================================================================
         *
         * name 路由key，跳转方式 this.$router.push({"name" : name});
         * path 路由path,跳转方式 this.$router.push(path);
         * redirect 重定向路由
         * component 目标组件
         * import 有此关键字表示异步加载
         */

        // 首页
        {
            name: 'index',
            path: '/',
            meta: {
                keepAlive: true
            },
            component: require('@/views/index/index.vue').default
        },
        // 详情页
        {
            name: 'detail',
            path: '/detail/:id',
            component: () => import( /* webpackChunkName: "detail" */ '@/views/detail/index.vue')
        },
        // 搜索
        {
            name: 'search',
            path: '/search',
            meta: {
                useCache: false,
                keepAlive: true
            },
            component: () => import( /* webpackChunkName: "search" */ '@/views/search/index.vue')
        },
        // 通配路由
        {
            path: '*',
            redirect: {
                name: 'index'
            }
        }
    ]
}
