import Vue from 'vue'
import Router from 'vue-router'
import manage from './manage';
Vue.use(Router);
export default new Router({
    routes: [
        {
            name: '登录页',
            path: '/login',
            component:resolve => require (['@manage/views/login.vue'], resolve),
        },
        {
            name: 'manage',
            path: '/manage',
            component:resolve => require (['@manage/views/propertyManage.vue'], resolve),
            redirect:'manage/houseManage',
            children:[
                ...manage,
            ]
        },

        {
            path: '/*',
            redirect: '/login',
        },
    ]
})
