import { createStore } from 'vuex';
import merchantStore from './merchantStore';
import advertStore from './advertStore';

export default createStore({
    modules: {
        merchantStore,
        advertStore,
    },
});
