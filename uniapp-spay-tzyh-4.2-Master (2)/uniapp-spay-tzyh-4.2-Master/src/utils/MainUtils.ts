import { getMerchantInfoStorage, getTokenStorage, getEcifStorage } from './Storage';
import { useStore } from 'vuex';

/**
 * 初始化缓存状态
 */
export const initStore = (options) => {
    // 快速进件页面处理
    if (/pages\/register/.test(options.path)) {
        const token: string = getTokenStorage();
        const merchantInfo: any = getMerchantInfoStorage();
        const ecif: any = getEcifStorage();
        const { dispatch, state } = useStore();
        if (token) {
            dispatch('setToken', token);
            console.log('token', state.merchantStore.token);
        }
        if (merchantInfo) {
            dispatch('setMerchantInfo', merchantInfo);
            console.log('merchantInfo', state.merchantStore.merchantInfo);
        }
        if (ecif) {
            dispatch('setEcifData', ecif);
            console.log('ecifData', state.merchantStore.ecifData);
        }
    }
    // #ifdef  H5
    sessionStorage.setItem('ROUTERPATHNAME', location.pathname);
    // #endif
};

/**
 * 退出app
 */
export const exitApp = () => {
    const ua = navigator.userAgent.toLowerCase();
    console.log(ua);
    if (/micromessenger/.test(ua)) {
        console.log('1');
        window.WeixinJSBridge.call('closeWindow');
        return;
    }
    const param = {};
    try {
        if (ua.match('android')) {
            console.log('2');
            window.androidShare && window.androidShare.quitApp();
            return;
        }
        if (ua.match('iphone') || ua.match('ipad')) {
            console.log('3');
            window.webkit && window.webkit.messageHandlers.quitApp.postMessage(param);
            return;
        }
    } catch (error) {
        return error;
    }
    history.back();
};

/**
 * 注入app方法，提供app调用
 */
export const injectApp = () => {
    const ua = navigator.userAgent.toLowerCase();

    // 获取当前页面标题
    window.getTitle = function () {
        var title = document.getElementsByTagName('title')[0].innerHTML;
        if (ua.match('android')) {
            window.androidShare.jsMethod(title);
        } else {
            return title;
        }
    };

    // 设置第一个页面路径，回退到最后一级时退出
    sessionStorage.setItem('ROUTERPATHNAME', location.pathname);

    // 兼容app后退
    window.goBack = function () {
        // console.info(location.hash);
        // console.info(sessionStorage.getItem('ROUTERPATHNAME'));
        // 返回第一步退出app
        console.log('ROUTERPATHNAME', location.hash, sessionStorage.getItem('ROUTERPATHNAME'), ua);
        if (sessionStorage.getItem('ROUTERPATHNAME') == location.pathname) {
            exitApp();
            return;
        }
        history.back();
        if (ua.match('iphone') || ua.match('ipad')) {
            return '1';
        }
    };
};

export const adjustWeixinFont = () => {
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }
    
    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {
            'fontSize': 0
        });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function () {
            WeixinJSBridge.invoke('setFontSizeCallback', {
            'fontSize': 0
            });
        });
    }
};
