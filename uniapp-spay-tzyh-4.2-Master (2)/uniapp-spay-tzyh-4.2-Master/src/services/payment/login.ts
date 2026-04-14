import { Ajax } from '../../utils/network/AjaxUtils';
import { getUrlParam } from '../../utils/GlobalUtils';
import { resultType } from '../../types';
import { API } from '../api';

type checkSessionLoginType = {
    resultCode?: string;
};

type miniLoginType = {
    code?: string;
    errMsg: string;
};

/**
 * 小程序登录，获得code
 */
function miniLogin() {
    return new Promise<miniLoginType>((resolve, reject) => {
        uni.login({
            timeout: 5000, // 微信登录超时 5s
            success(res) {
                if (res.code) {
                    resolve(res);
                } else {
                    reject({
                        message: 'login:fail! ' + res?.errMsg || '小程序登录失败',
                    });
                }
            },
            fail(err) {
                reject({
                    message: 'login:fail! ' + err?.errMsg || '小程序登录失败',
                });
            },
        });
    });
}

/**
 * 检查 code，如果过期执行重新登录
 */
function checkSessionLogin() {
    return new Promise<checkSessionLoginType>((resolve) => {
        try {
            uni.checkSession({
                success() {
                    resolve({});
                },
                fail() {
                    resolve({
                        resultCode: '200',
                    });
                },
            });
        } catch (error) {
            resolve({
                resultCode: '200',
            });
        }
    });
}

/**
 * 获得商户信息
 */
export const miniProLogin = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'get',
        url: API.getJsCode2Session,
        silent: true,
        silence: true,
        data,
    });
};

export const setLoginCache = (params: any = {}) => {
    // #ifdef H5
    // 尝试解决onload时setStorageSync不成功问题
    uni.removeStorageSync('CODE');
    uni.removeStorageSync('UNIONID');
    uni.removeStorageSync('OPENID');
    uni.removeStorageSync('APPID');
    uni.removeStorageSync('userAuthCode');

    uni.setStorageSync('CODE', params?.subOpenID || params?.openID || params?.buyerId || params?.userId);
    //成都需要unionId上送，目前只在微信中需要
    uni.setStorageSync('UNIONID', params?.unionId || '');
    uni.setStorageSync('OPENID', params?.subOpenID || params?.openID || params?.buyerId || params?.userId);
    uni.setStorageSync('APPID', params?.appId);
    uni.setStorageSync('userAuthCode', params?.userAuthCode);//20240807  云闪付新增参数userAuthCode上送
    // #endif
};

export const getLoginCache = (key) => {
    let value = '';
    value = uni.getStorageSync(key);
    if (!value || value.length === 0){
        // #ifdef H5
        const params: any = getUrlParam(window.location.href);
        switch (key) {
            case 'CODE':
                value = params?.subOpenID || params?.openID || params?.buyerId || params?.userId;
                break;
            //成都需要unionId上送，目前只在微信中需要
            case 'UNIONID':
                value = params?.unionId || '';
                break;
            case 'OPENID':
                value = params?.subOpenID || params?.openID || params?.buyerId || params?.userId;
                break;
            case 'APPID':
                value = params?.appId;
                break;     
            case 'userAuthCode':
                value = params?.userAuthCode;
                break;
            default:
                value = uni.getStorageSync(key);
                break;
        }
        // #endif
    }

    // #ifdef MP-WEIXIN
    // value = uni.getStorageSync(key);
    // #endif

    return value;
};

/**
 * 小程序或者支付宝登录
 */
export async function requestLogin() {
    // #ifdef MP-WEIXIN
    const checkSession = await checkSessionLogin();
    // console.info(uni.getStorageSync('OPENID'));

    //如果过期，再去执行登录
    if ((checkSession || {})?.resultCode == '200' || !uni.getStorageSync('OPENID')) {
        const res = await miniLogin(),
            accountInfo = uni.getAccountInfoSync();
        // console.log(accountInfo);
        const response = await miniProLogin({
            jsCode: res?.code,
            appId: accountInfo?.miniProgram?.appId,
        });
        if (response.result === '200') {
            uni.setStorageSync('OPENID', response?.message?.openId);
            uni.setStorageSync('CODE', res?.code);
            uni.setStorageSync('LOGIN_TIME', new Date().getTime());
            uni.setStorageSync('APPID', accountInfo?.miniProgram?.appId);
            return response;
        } else {
            throw new Error('login:fail');
        }
    }
    // #endif
    // #ifdef H5
    const currentUrl = window.location.href;
    const params: any = getUrlParam(currentUrl);
    // console.log(params);
    setLoginCache(params);
    return {
        message: {
            ...params,
        },
        result: '200',
    };
    // #endif
}
