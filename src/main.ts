import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import { LoadingBar, Modal} from 'view-design';
import echarts from 'echarts'
Vue.prototype.$echarts = echarts


import axios from '@manage/axios';
Vue.prototype.axios = axios;



import plugin from "./utils/suc-plugin";
Vue.use(plugin);

//element组件
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import './styles/element-variables.scss'
Vue.use(ElementUI);

// import 'view-design/dist/styles/iview.css';
import './styles/my-theme.less';
import './styles/main.scss';



//滚动条优化插件
// @ts-ignore
import VuePerfectScrollbar from './plugins/perfect-scrollbar'
Vue.use(VuePerfectScrollbar);

Vue.config.productionTip = false;

Vue.prototype.$Modal=Modal;
router.beforeEach((to:any, from:any, next:any) => {
    LoadingBar.start();
    next();
});

router.afterEach(() => {
    LoadingBar.finish();
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
