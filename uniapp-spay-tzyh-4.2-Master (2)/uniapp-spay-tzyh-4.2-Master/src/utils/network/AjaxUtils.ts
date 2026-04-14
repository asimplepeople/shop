import { isObject } from '../GlobalUtils';
import Log from '../Log';
import HandleError from './HandleError';
import config from '../../../config/config';

/** 存放请求地址 */
const requestCache = {};
/** 将json对象转换成url参数形式 {a: 1, b: 2} -> a=1&b=2 */
export const parseParams = (target = {}) => {
    if (!isObject(target)) {
        throw new TypeError('parseParams 方法的参数必须为json对象类型');
    }

    return Object.keys(target)
        .map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(target[key]);
        })
        .join('&');
};

/**
 * 处理请求传参时，通过url获取的参数的值为字符串类型的null或undefined，
 * 或其本身就是null、undefined，则从参数对象中直接删除这些字段
 *
 * */
const handleParams = (params = {}) => {
    if (!isObject(params)) {
        throw new TypeError('params 方法的参数必须为json对象类型');
    }

    for (const item in params) {
        const isUndefined = typeof params[item] === 'undefined' || params[item] === 'undefined';

        const isNull = Object.prototype.toString.call(params[item]) === '[object Null]' || params[item] === 'null';

        if (params.hasOwnProperty(item) && (isUndefined || isNull)) {
            delete params[item];
        }
    }

    return params;
};

/**
 * ajax方法，在uni.request方法基础之上进行了封装
 *
 * @param {Object} props
 * @param {string} props.url -  请求地址
 * @param {string} props.furl -  是否完整路径
 * @param {string} [props.method] -  请求方法
 * @param {Object} [props.header = {}] -  请求头信息
 * @param {string} [props.loadingIdentifier] - 若要自定义loading状态，可以传一个字符串标示，此时全局loading不会触发，context参数必传，并指向当前的Vue实例
 * @param {string} [props.getAllResult] - 是否获取全部的返回信息，比如包含header信息
 * @param {Object} [props.context] - 执行当前方法的上下文，可以用来给当前上下文设置loading状态，一般指向当前Vue实例，通常填this
 * @param {Boolean} [props.silence = false] - 是否发送不显示loading的静默请求
 * @param {Boolean} [props.silent = false] - 错误码400时不显示默认的toast
 * @param {Boolean} [props.loadingTitle = false] - 自定义loading提示
 * @param {Number} [props.timeout = 60000] - 超时时间，默认60秒
 * @return {Promise}
 */

export const Ajax = <T>({
    url,
    method = 'post',
    furl = false,
    data = {},
    header = {},
    silence = false,
    silent = false,
    getAllResult = false,
    loadingIdentifier,
    context,
    hasHandleCustom = false /* success回调自定义处理 */,
    loadingTitle,
    isFormdata = false,
    timeout,
    responseType,
}: any): Promise<T | undefined> => {
    if (loadingIdentifier && !context) {
        throw new Error('如果传了自定义loadingIdentifier参数，请定义其上下文context参数');
    }

    let fullUrl = url;

    // #ifdef MP-WEIXIN
    fullUrl = furl ? url : `${config.apiDomain}${fullUrl}`;
    // #endif

     // #ifdef H5
     fullUrl = furl ? url : fullUrl;
     // #endif

    return new Promise((resolve, reject) => {
        if (requestCache[fullUrl]) {
            reject();
            return;
        }

        requestCache[fullUrl] = true;

        context && (context[loadingIdentifier] = true);
        !loadingIdentifier &&
            !silence &&
            uni.showLoading({
                mask: true,
                title: loadingTitle || '正在加载...',
            });
        let defaultHeader = {
            'content-type': 'application/json',
        };
        if (isFormdata) {
            defaultHeader = {
                'content-type': 'application/x-www-form-urlencoded',
            };
        }
        // 发起请求
        uni.request({
            timeout: timeout || 60000,
            url: fullUrl,
            data: isFormdata ? data : handleParams(data),
            method,
            header: {
                ...defaultHeader,
                ...header,
            },
            responseType: responseType || '',
            success: (res) => {
                const remoteData: any = res.data || {};
                const { result, message, status, success, msg } = remoteData;
                const statusCode = String(res.statusCode);
                const retcode = result || status;
                const retmsg = message || msg || '网络错误';
                const isXWSuccess = fullUrl.startsWith('/spay/xiaowei') && success === true;
                const succeed =
                    (statusCode.startsWith('2') || statusCode === '304') &&
                    (retcode === '200' || retcode === '400' || responseType === 'arraybuffer');
                if (succeed || hasHandleCustom || isXWSuccess) {
                    const resultObj: any = remoteData;
                    // message成功的时候有可能也会返回提示消息
                    try {
                        if (message && typeof message === 'string' && /[\{\[]/.test(message)) {
                            resultObj.message = JSON.parse(message);
                        } else {
                            resultObj.message = message;
                        }
                    } catch (error) {
                        console.log(`${fullUrl}.api:`, error);
                    }
                    if (retcode === '400') {
                        // #ifdef MP-WEIXIN
                        Log.addFilterMsg(url);
                        Log.addFilterMsg(uni.getStorageSync('OPENID') || '');
                        Log.info(data);
                        Log.error(remoteData);
                        // #endif
                        !silent &&
                            uni.showToast({
                                icon: 'none',
                                title: message,
                                duration: 2500,
                            });
                    }
                    resolve(getAllResult ? res : resultObj);
                    uni.hideLoading();
                    if (retcode === '400') {
                        !silent &&
                            uni.showToast({
                                icon: 'none',
                                title: retmsg,
                                duration: 2500,
                            });
                    }
                } else {
                    // #ifdef MP-WEIXIN
                    Log.addFilterMsg(url);
                    Log.addFilterMsg(uni.getStorageSync('OPENID') || '');
                    Log.info(data);
                    Log.error(remoteData);
                    // #endif
                    reject({
                        statusCode,
                        retcode,
                        retmsg,
                    });
                    //登录失效不弹
                    if (retcode !== '306' && retcode !== '206' && retcode !== '308') {
                        !loadingIdentifier &&
                            !silence &&
                            setTimeout(() => {
                                uni.hideLoading();
                            }, 500);
                        !silence &&
                            uni.showToast({
                                icon: 'none',
                                title: retmsg,
                                duration: 2500,
                            });
                        // 异常上报内容过长
                        throw new Error(`[${retcode}]${retmsg};${JSON.stringify(handleParams(data))};${fullUrl}`);
                    } else {
                        uni.hideLoading();
                    }
                }
            },
            fail: (error) => {
                const isTimeout = error.errMsg.indexOf('timeout') > 0;
                !silence && HandleError('', error.errMsg, isTimeout);
                // reject(error.errMsg);
                reject({
                    retcode: -1,
                    retmsg: error.errMsg,
                });
            },
            complete: () => {
                delete requestCache[fullUrl];
                context && (context[loadingIdentifier] = false);
                uni.hideNavigationBarLoading();
            },
        });
    });
};
