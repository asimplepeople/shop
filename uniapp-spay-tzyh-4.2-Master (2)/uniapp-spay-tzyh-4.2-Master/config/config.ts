// 当前银行bankcode
const processEnv: any = process.env;
// 当前环境
const metaEnv: any = import.meta.env;

/**
 * 获取当前小程序appid
 */
export function getAppId() {
    try {
        let appId = '';
        const gobalUni: any = uni;
        // #ifdef  MP-WEIXIN
        appId = gobalUni.getAccountInfoSync().miniProgram.appId;
        // #endif
        // #ifdef  MP-ALIPAY
        appId = gobalUni.getAppIdSync().appId;
        // #endif
        return appId;
    } catch (e) {
        console.error('获取小程序的APPID失败');
        return '';
    }
}

/**
 * 获取vite环境变量
 * @param {*} field 字段
 */
export const getViteEnv = (field) => {
    return metaEnv[`VITE_${processEnv.BANK_CODE.toUpperCase()}_${field.toUpperCase()}`];
}
export const get_AD_PARAMS = () => {
    const SWFAD = getViteEnv('AD_SWFAD') ? JSON.parse(getViteEnv('AD_SWFAD')) : null;
    const UNIAD = getViteEnv('AD_UNIAD') ? JSON.parse(getViteEnv('AD_UNIAD')) : null;
    const CHANNEL_T = getViteEnv('AD_CHANNEL_T');
    const PLUGIN_FLAG = getViteEnv('AD_MP_WEIXIN_PLUGIN') || '';
    const fshowsPluginLabel = metaEnv.VITE_COMMON_AD_fshowsPluginLabel;
    const wkSecret = metaEnv.VITE_COMMON_AD_wkSecret;
    const psSecret = getViteEnv('AD_PS_S');

    const adParams = {
        swfad: PLUGIN_FLAG.includes('swfad'), // 威富通广告插件开关
        uniad: PLUGIN_FLAG.includes('uniad'), // uniad广告插件开关
        fshows: PLUGIN_FLAG.includes('fshows'), // 首展页面插件广告开关
        wk: PLUGIN_FLAG.includes('wk'), // 沃氪页面插件广告开关
        ps: PLUGIN_FLAG.includes('ps'), // 派深广告插件开关
        yw: PLUGIN_FLAG.includes('yw'), // 云鼯广告插件开关
        fshowsPluginLabel, // 首展页面插件广告label
        wkSecret, // 沃氪密钥
        psSecret, // 派深密钥
        videoAdvId: SWFAD?.videoAdvId, // 威富通广告插件视频广告id
        customAdvId: SWFAD?.customAdvId, // 威富通广告插件格子广告id
        bannerAdvId: SWFAD?.bannerAdvId, // 威富通广告插件banner广告id
        interstAdvId: SWFAD?.interstAdvId, // 威富通广告插件插屏广告id
        uniadVideoAdvId: UNIAD?.uniadVideoAdvId, // uniad广告插件视频广告id
        uniadCustomAdvId: UNIAD?.uniadCustomAdvId, // uniad广告插件格子广告id
        uniadBannerAdvId: UNIAD?.uniadBannerAdvId, // uniad广告插件banner广告id
        uniadInterstAdvId: UNIAD?.uniadInterstAdvId, // uniad广告插件插屏广告id
        channelT: CHANNEL_T, // 对接token
    };
    console.log('adParams: ', adParams);
    return adParams;
};

// 获取微信小程序支付模式
export const get_MP_WEIXIN_PAYMENT_MODE = () => {
    const MP_WEIXIN_PAYMENT_MODE = getViteEnv('MP_WEIXIN_PAYMENT_MODE') || 'appid'; //未配置默认appid模式
    const isAppid = MP_WEIXIN_PAYMENT_MODE === 'appid';
    return {
        appid: isAppid ? 'appid' : 'sub_appid',
        openid: isAppid ? 'openid' : 'sub_openid',
    };
};


export default {
    bankCode: processEnv.BANK_CODE,
    env: metaEnv.VITE_ENV,
    name: getViteEnv('appName'),
    theme: getViteEnv('theme'),
    curAppid: getAppId(),
    appid: getViteEnv('appid'),
    apiDomain: getViteEnv('apiDomain'),
    adParams: get_AD_PARAMS(),
    mpWeixinPaymentMode: get_MP_WEIXIN_PAYMENT_MODE(),
};
