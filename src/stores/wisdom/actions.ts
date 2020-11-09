import {ActionContext} from "vuex";



export function removeAllRouterTab(
    context: ActionContext<any, any>
) {
    context.commit('removeAllRouter');
}
