import {
    setMerchantInfoStorage,
    removeMerchantInfoStorage,
    setTokenStorage,
    removeTokenStorage,
    setEcifStorage,
    removeEcifStorage,
} from '../utils/Storage';

const merchantStore = {
    state: {
        token: '',
        merchantInfo: {},
        ecifData: {},
        subjectTypeList: [],
        costRateBdStr: '',
        base64Imgs: {},
    },
    mutations: {
        setTokenValue(state, value) {
            state.token = value;
        },
        setMerchantInfoValue(state, value) {
            state.merchantInfo = value;
        },
        setEcifDataValue(state, value) {
            state.ecifData = value;
        },
        setSubjectTypeListValue(state, value) {
            state.subjectTypeList = value;
        },
        setCostRateBdStr(state, value) {
            state.costRateBdStr = value;
        },
        setBase64Imgs(state, value) {
            state.base64Imgs = {
                ...state.base64Imgs,
                ...value,
            };
        },
    },
    getters: {
        getToken: (state) => state.token,
        getMerchantInfo: (state) => state.merchantInfo,
        getEcifData: (state) => state.ecifData,
        getSubjectTypeList: (state) => state.subjectTypeList,
        getCostRateBdStr: (state) => state.costRateBdStr,
        getBase64Imgs: (state) => state.base64Imgs,
    },
    actions: {
        setToken({ commit }, value) {
            commit('setTokenValue', value);
            if (value) {
                setTokenStorage(value);
                return;
            }
            removeTokenStorage();
        },
        setMerchantInfo({ commit }, value) {
            commit('setMerchantInfoValue', value);
            if (value) {
                setMerchantInfoStorage(value);
                return;
            }
            removeMerchantInfoStorage();
        },
        setEcifData({ commit }, value) {
            commit('setEcifDataValue', value);
            if (value) {
                setEcifStorage(value);
                return;
            }
            removeEcifStorage();
        },
        setSubjectTypeList({ commit }, value) {
            commit('setSubjectTypeListValue', value);
        },
        setCostRateBdStr({ commit }, value) {
            commit('setCostRateBdStr', value);
        },
        setBase64Imgs({ commit }, value) {
            commit('setBase64Imgs', value);
        },
    },
};

export default merchantStore;
