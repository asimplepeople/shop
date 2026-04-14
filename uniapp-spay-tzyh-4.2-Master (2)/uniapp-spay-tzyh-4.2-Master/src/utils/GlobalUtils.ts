import { MD5, enc } from 'crypto-js';
import toLowerCase from '@/assets/js/BDFaceSdk.esm.min';
/**
 * 代码量较少的常用工具函数
 *
 * 代码量比较多的公用方法放单独文件
 */

/**
 * 将 目标 转成字符串类型
 * @param {any} target
 * @return {string}
 */
export function toString(target) {
    return Object.prototype.toString.call(target);
}

/**
 * 判断是否为对象
 *
 * @param {any} target
 * @return {boolean}
 */
export function isObject(target) {
    return toString(target) === '[object Object]';
}

/**
 * 判断是否为数组
 *
 * @param {any} target
 * @return {boolean}
 */
export function isArray(target) {
    return toString(target) === '[object Array]';
}

/**
 * 获取对象的key集合
 * @param {object} target
 * @return {Array<string> | []}
 */
export function getkeys(target) {
    // if (isObject(target)) {
    //     return Object.keys(target);
    // }
    return typeof target === 'object' ? Object.keys(target) : [];
}

/**
 * 判断对象中是否有指定的key
 *
 * @param {Object} [target={}]
 * @param {string} [target.key]
 * @param {string} key
 *
 * @return {boolean}
 */
export function hasProperty(target, key) {
    return isObject(target) && Object.prototype.hasOwnProperty.call(target, key);
}

/**
 * 创建一个从 object 中选中的属性的对象集合。
 *
 * @param {object} target   原对象
 * @param {string|string[]} keys 选取的属性，支持数组或字符串（只选取一个属性的情况下）
 * @return {void}
 *
 * @example
 * const exampleJson = {a: 1,b: 2,c: 3};
 * const result = pickValue(exampleJson, ["a", "c"]) // -> {a: 1,c:3}
 */
export function pickValue(target, keys) {
    if (!isObject(target)) {
        throw new TypeError('参数 target 必须为一个json对象');
    }
    for (const item in target) {
        if (
            target.hasOwnProperty(item) &&
            (typeof target[item] === 'undefined' || typeof target[item] === 'function')
        ) {
            console.warn('传入的json参数里面的部分值的类型为undefined或者function，此方法将会忽略这部分键值对');
        }
    }
    const handleKeys = typeof keys === 'string' ? [keys] : keys;
    return JSON.parse(JSON.stringify(target, handleKeys));
}

/**
 * 从url地址中获取指定的参数的值
 *
 * @param {string} url
 * @param {string} name
 *
 * @return {string}
 */
export function getQueryString(url, name) {
    if (url !== 'undefined' && typeof url.split('?')[1] !== 'undefined') {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        const result = url.split('?')[1].substr(0).match(reg);
        return unescape(result[2]);
    } else {
        return null;
    }
}
/**
 * 转义中文字符
 * @param {string} str 需要转义的字符串
 */
export function encodedString(str = '') {
    return encodeURIComponent(str);
}

/**
 * 转换参数序列
 * @param {string} key 键名
 * @param {string} value 键值
 * @return {string} key=value
 */
export function encodeParams(key, value) {
    return encodedString(key) + '=' + encodedString(value);
}

/**
 *
 * 序列化敏感数据, e.g. password.
 * 函数和符号也在序列化中被丢弃
 *
 */
export function stringifyWithMask(maskedKeywords, maskedOutput, ...args) {
    const replacer = (key, value) => {
        if (typeof value === 'function' || typeof value === 'symbol') {
            return undefined;
        }
        if (maskedKeywords.some((_) => _.test(key))) {
            return maskedOutput;
        }
        return value;
    };

    const serializableArgs = args.filter((_) => typeof _ !== 'function' && typeof _ !== 'symbol');
    switch (serializableArgs.length) {
        case 0:
            return undefined;
        case 1:
            return JSON.stringify(serializableArgs[0], replacer);
        default:
            return JSON.stringify(serializableArgs, replacer);
    }
}
/** iso格式的日期 */
export const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-][01]\d:[0-5]\d)$/;

/**
 * 检测 iso格式的日期（2018-05-24t12:00:00.123z）
 *
 * @param {string} value 将强制转成字符串
 * @return {boolean} 返回 布尔值
 */
export function isISODate(value) {
    return ISO_DATE_FORMAT.test(value);
}

/**
 * 如果字符串中出现iso格式的日期（2018-05-24t12:00:00.123z），则它将转换为js日期类型。
 * @param {string} data 必须为字符串类型
 * @return  返回 json 对象
 */
export function parseDateByString(data) {
    return JSON.parse(data, (key, value) => {
        return isISODate(value) ? new Date(value) : value;
    });
}

/**
 * 如果json中出现iso格式的日期（2018-05-24t12:00:00.123z），则它将转换为js日期类型。
 * @param {object} data 必须为 JSON 类型
 */
export function parseDateByJson(data) {
    const keys = getkeys(data);
    keys.forEach((key) => {
        const value = data[key];
        data[key] = isISODate(value) ? new Date(value) : value;
    });
    return data;
}

/**
 * 设置cookie
 * @param {String} cname key
 * @param {any} cvalue 值
 * @param {number} exdays 过期时间
 * @param path cookie 路径
 */
export function setCookie(cname, cvalue, exdays = 1, path = '/') {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=' + path;
}

/**
 * 获取所有的cookie
 */
export function getCookie() {
    const _array = {};
    try {
        const _cookie_ = document.cookie.split(';');
        const _reg = /^\s+|\s+$/gm;
        for (let i = 0; i < _cookie_.length; i++) {
            const c = _cookie_[i].replace(_reg, '');
            const index = c.indexOf('=');
            const key = c.substring(0, index);
            const value = c.substring(index + 1);
            _array[key] = value;
        }
    } catch (e) {
        console.log('cookie => 获取失败');
    }
    return _array;
}

/**
 * 获取的cookie值
 * @param {string} cname key
 */
export function getCookieByName(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].replace(/\s/g, '');
        if (c.indexOf(name) >= 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

/**
 * 移除无用字段
 * @param object 传入对象
 */
export function removeUselessField(target) {
    let result = {};
    if (typeof target === 'object') {
        for (const key in target) {
            if (target[key] !== undefined && target[key] !== null && target[key] !== '') {
                result[key] = target[key];
            }
        }
    } else {
        result = target;
    }
    return result;
}

/**
 * md5加签
 * @param { string } str 签名和加密字符串
 */
export class md5 {
    static createSignData(data: any = {}) {
        let result = '';
        const arr = Object.keys(data).sort();
        arr.length &&
            arr.forEach((item) => {
                if (data[item] !== '') {
                    result = result + (result == '' ? '' : '&') + item + '=' + data[item];
                }
            });
        return result;
    }

    static sign(data: any = {}): any {
        const newData = Object.assign({}, data);
        let str = this.createSignData(newData);
        if (!newData.code) str = str + '&code=' + uni.getStorageSync('CODE');
        return MD5(str).toString().toUpperCase();
    }
}

/**
 * base64加密
 */
export function Base64(dataStr: string): string {
    const resultStr = enc.Utf8.parse(dataStr);
    return enc.Base64.stringify(resultStr);
}

export function getWhichBrowser() {
    let sign = '';
    // #ifdef H5
    // 获取当前浏览器
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes('micromessenger')) {
        sign = 'micromessenger'; // 微信浏览器
    } else if (ua.includes('alipayclient')) {
        sign = 'aliapp'; // 支付宝浏览器
    } else if (ua.includes('sccba801')) {
        sign = 'qsbank-app'; // 齐商银行APP
    } else if (ua.includes('tzbank')) {
        sign = 'tzbank'; // 台州银行APP
    } else {
        sign = 'ysf';
        // #ifdef TAIZHOU
        // 台州银行APP内UA无特殊标识
        const urlObj = new URLSearchParams(location.search);
        if (urlObj.get('payType')?.toLowerCase() === 'tzbank') {
            sign = 'tzbank';
        }
        // #endif
    }
    // #endif

    // #ifdef MP-WEIXIN
    sign = 'miniprogram';
    // #endif
    return sign;
}

export function getSignSource() {
    //1:微信 2:支付宝 5:云闪付 7:齐商APP
    let signSource = 1;
    const currentBrowser = getWhichBrowser();
    // #ifdef MP-WEIXIN
    switch (currentBrowser) {
        case 'miniprogram':
            signSource = 1;
            break;
    }
    // #endif
    // #ifdef H5
    switch (currentBrowser) {
        case 'micromessenger':
            signSource = 1;
            break;
        case 'aliapp':
            signSource = 2;
            break;
        case 'ysf':
            signSource = 5;
            break;
        case 'qsbank-app':
            signSource = 7;
            break;
    }
    // #endif
    return signSource;
}

/**
 * 函数防抖
 * @param fn 需要防抖函数
 * @param delay 延迟
 * @param immediate 是否立即执行
 * @returns 经过防抖的函数
 */
export function debounce(fn, delay, immediate = false) {
    let timer;
    let callNow = true;
    return function (...arg) {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const __this: any = this;
        timer && clearTimeout(timer);
        if (immediate) {
            if (callNow) {
                fn.apply(__this, arg);
                callNow = true;
            }
            setTimeout(function () {
                callNow = false;
            }, delay);
        } else {
            timer = setTimeout(function () {
                fn.apply(__this, arg);
            }, delay);
        }
    };
}

/**
 * url上面的参数转化为参数对象
 */
export function getUrlParam(url): any {
    const href = decodeURIComponent(url);
    let strObj = {};
    try {
        const searchUrl = href.split('?')[1];
        const strArr = searchUrl.split('&');
        for (let i = 0; i < strArr.length; i++) {
            const keyVals = strArr[i].split('=');
            const a = keyVals[0];
            let val = '';
            keyVals.forEach((item, index) => {
                if (index > 0) {
                    val = val + (item || '=');
                }
            });
            strObj[a] = val;
        }
    } catch (error) {
        strObj = {};
    }
    return strObj;
}

/**
 * 银行卡号格式化与反格式化
 * @param { string } str 银行卡号
 */
export class Bank {
    static fomart(str: any = ''): string {
        let result = '';
        if (str) {
            const removeFomartStr = this.removeFomart(str);
            for (let i = 0; i < removeFomartStr.length; i++) {
                if ((i + 1) % 4 === 0 && i + 1 < removeFomartStr.length) {
                    result = result + removeFomartStr.charAt(i) + ' ';
                } else {
                    result = result + removeFomartStr.charAt(i);
                }
            }
        }
        return result;
    }

    static removeFomart(str: any = ''): string {
        let result = '';
        if (str) {
            result = str.replace(/\s*/g, '');
        }
        return result;
    }
}



/**
 * 嵌套json数据解析
 * @param { string } str 需要解析的数据
 */
export function formatJsonStr(str): any {
    if (str === null || str === '{}' || str === undefined) {
        return str;
    }
    try {
        const json = JSON.parse(str);
        for (const k in json) {
            const kv = json[k];
            try {
                if (typeof JSON.parse(kv) == 'object') {
                    json[k] = formatJsonStr(kv);
                }
            } catch (e) {
                console.log(e);
            }
        }
        return json;
    } catch (e) {
        console.log(e);
    }
    return str;
}

// 是否Ios
export function isIos() {
    // console.log('uni.getSystemInfoSync()', uni.getSystemInfoSync());
    return uni.getSystemInfoSync().platform === 'ios';
}

// 跳转到广告链接
export function navigateToAdvPage(url) {
    //拦截非h5链接
    if (!url && (/http:\/\//.test(url) || /https:\/\//.test(url))) return;
    // #ifdef MP-WEIXIN
    // 微信小程序广告跳转
    uni.navigateTo({
        url: '/pages/common/web?url=' + encodeURIComponent(url),
    });
    // #endif
    // #ifdef H5
    // h5广告跳转
    window.location.href = url;
    // #endif
}

// 小程序广告图片跳转
export function advImageJump(channelUrl) {
    // #ifdef MP-WEIXIN
    // 因为微信的url经过解析后可能存在http://或者https://，所以需要放在里面转
    if (/http:\/\//.test(channelUrl) || /https:\/\//.test(channelUrl)) {
        const url = decodeURIComponent(channelUrl || '');
        // 跳转H5页面
        navigateToAdvPage(url);
        return;
    }

    // 跳转小程序规则例子：weixin://wx41890c67ed9b401e/pages/pay/index/saas?q=http%3A%2F%2Fzhifu4-spay.k8s.swiftpass.top%2Fspay%2Fmerchant%2FscanQr%3FqrId%3D1b1dad4ea94f4ac19dd5982e03bd6a8c
    if (/weixin:\/\//.test(channelUrl)) {
        const url = decodeURIComponent(channelUrl || '');
        // 从路径中获取appid和小程序路径
        const urlArr = url.split('/');
        const app_id = urlArr[2];
        const { appId } = uni.getAccountInfoSync().miniProgram;
        const regex = new RegExp(`weixin://${app_id}`, 'ig');

        // 小程序跳转路径
        const jumpLink = url.replace(regex, '');

        if (app_id) {
            if (app_id !== appId) {
                // appid与当前小程序不一致，跳转外部小程序页面类型
                uni.openEmbeddedMiniProgram({
                    appId: app_id,
                    path: jumpLink,
                });
            } else {
                // 跳转当前小程序页面
                jumpLink && navigateToAdvPage(jumpLink);
            }
        }
    }
    // #endif
    // #ifdef H5
    const url = decodeURIComponent(channelUrl || '');
    navigateToAdvPage(url);
    // #endif
}

// 随机生成字符串 
export function generateRandomString(length, isNumber) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var numbers = '0123456789';
    var charactersLength = characters.length;
    var numbersLength = numbers.length;
    for (let i = 0; i < length; i++) {
        if (isNumber) {
            result += numbers.charAt(Math.floor(Math.random() * numbersLength));
        } else {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } return result;
}