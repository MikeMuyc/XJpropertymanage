import Vue from 'vue'
import Vuex, {ModuleTree} from 'vuex';
import routeTabs from './routeTabs/index';
import wisdom from './wisdom/index';
Vue.use(Vuex)


const modules: ModuleTree<any> = {
    routeTabs,
    wisdom
};

export default new Vuex.Store({
    state: {
        userInfo: null
    },
    modules,
    mutations: {
        getUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    },
    actions: {

    }
})
