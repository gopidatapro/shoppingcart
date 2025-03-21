import vuex from 'vuex';

import Vue from 'vue';

Vue.use(vuex);

new vuex.Store({
    state: {  
        products :[],
      },
      getters: {
        availableProducts (state, getters) {
          return state.products.filter(product => product.inventory > 0)
        }
        },
    
        mutations: {
            setProducts(state, products) {
                state.products = products;
            }
        },
        actions: {
            
        },
});

