import Vue from "vue";
import Vuex from "vuex";
//bind vuex with vue
Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        orderList: null,
    },
    getters: {
        getOrderList: (state) => state.orderList,
    },
    mutations: {
        SET_ORDER_LIST(state, payload) {
            state.orderList = payload;
        },
    },
    actions: {
        SET_ORDER_LIST({commit}, payload) {
            commit("SET_ORDER_LIST", payload);
        }
    },
});

