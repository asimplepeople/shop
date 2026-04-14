import { Ajax } from '../../utils/network/AjaxUtils';
import { md5, getWhichBrowser, generateRandomString} from '../../utils/GlobalUtils';
import { resultType } from '../../types';
// import JSONData from '../mock-data/province-city-area.json';
import { API } from '../api';
import { Money } from '../../utils/MoneyUtils';
import { queryMchInfoType, queryBindCardInfoType } from './type';

/**
 * 移除对象里 Null,Undefined 值的key
 */
const removeNullUndefined = (obj) => {
    const result = {};
    Object.keys(obj).map((val) => {
        if (obj[val] !== undefined && obj[val] !== null) {
            result[val] = obj[val];
        }
    });
    return result;
};

// const redirectNum = 0;

export const RootAjax = <T>({
    url,
    method = 'post',
    furl = false,
    data = {},
    header = {},
    silence = false,
    getAllResult = false,
    loadingIdentifier,
    context,
    hasHandleCustom = false /* success回调自定义处理 */,
    loadingTitle,
}: any): Promise<T | any> => {
    const newData = removeNullUndefined({
        token: uni.getStorageSync('OPENID'),
        timestamp: new Date().getTime(),
        ...(data || {}),
    });
    const signStr = md5.sign(newData);
    let newUrl = url;
    // #ifdef CDRCB
    const appBaseUrl: any = process.env.APP_BASE_URL;
    if (appBaseUrl.indexOf('dev') > -1) newUrl = '/dev' + newUrl;
    if (appBaseUrl.indexOf('sit') > -1) newUrl = '/sit' + newUrl;
    // #endif
    return Ajax({
        url: newUrl,
        method,
        furl,
        data: {
            ...newData,
            sign: signStr,
        },
        header,
        silence,
        getAllResult,
        loadingIdentifier,
        context,
        hasHandleCustom,
        loadingTitle,
    }).catch((err) => {
        if (err?.retcode === '306' || err?.retcode === '206') {
            uni.removeStorageSync('OPENID');
            uni.removeStorageSync('CODE');
            uni.removeStorageSync('LOGIN_TIME');
            // #ifdef MP-WEIXIN
            // if (url.indexOf(API.queryMchInfo) > -1) {
            //     const options = uni.getStorageSync('OPTIONS');
            //     const optionsStr = md5.createSignData(options);
            //     if (redirectNum > 0) return; //如果重定向过一次，就无需再刷新，以免陷入无限重定向中
            //     setTimeout(() => {
            //         redirectNum = redirectNum + 1;
            //         //移除登录态后重定向一次
            //         uni.redirectTo({
            //             url: '/pages/payment/payment?' + optionsStr,
            //         });
            //     }, 100);
            // }
            // #endif
        }
        return err;
    });
};

/**
 * 获得商户信息
 */
export const queryMchInfo = async (data?: queryMchInfoType): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: data?.nativeQrId ? API.queryMchInfoNative : API.queryMchInfo,
        data: {
            ...data,
            nativeQrId: undefined,
        },
    });
};

/**
 * 根据订单号查询订单信息
 */
export const orderNoOrderDetail = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.orderNoOrderDetail,
        data,
    });
};

/**
 * 主扫查询订单信息
 */
export const orderDetail = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.orderDetail,
        data,
    });
};

/**
 * 查询用户所拥有的权益信息
 */
export const queryInterestsInfo = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.queryInterestsInfo,
        data,
    });
};

// /**
//  * 取消支付通知后端撤销权益
//  */
// export const closingOrder = async (outTradeNo, data?: any): Promise<any> => {
//     return await RootAjax<resultType>({
//         method: 'post',
//         url: API.closingOrder,
//         data: {
//             orderNo: outTradeNo,
//             orderSerialNo: data.orderSerialNo,
//             orderDate: new Date().getTime(),
//         },
//     });
// };

/**
 * 取消支付通知后端语音播报
 */
export const payFail = async (data?: any): Promise<any> => {
    const currentBrowser = getWhichBrowser();
    return await RootAjax<resultType>({
        method: 'post',
        url: API.cancelPay,
        silence: true,
        data: {
            outTradeNo: data.outTradeNo,
            mchId: data?.mchId,
            userId: data?.userId,
            fromUserId: uni.getStorageSync('OPENID'),
            payType: currentBrowser,
            cancelTime: new Date().getTime(),
            mktOrderNo: data.mktOrderNo,
        },
    });
};

/**
 * 跳转结果页
 */
/**
 * 跳转结果页
 */
export const toPageResult = async (params) => {
    const url =
        '/pages/payment/pay-result?orderNo=' +
        params.outTradeNo +
        '&mchId=' +
        (params?.mchId || '') +
        '&userId=' +
        (params?.userId || '') +
        '&result=ok' +
        '&money=' +
        (params?.money || 0) +
        '&mktOrderNo=' +
        (params?.mktOrderNo || '') +
        '&daMoney=' +
        (params?.daMoney || '') +
        '&interest=' +
        (params?.interest || '') +
        '&transactionId=' +
        (params?.transactionId || '') +
        '&isFastPay=' +
        (params?.isFastPay || '');
 
    uni.redirectTo({url});
};
/**
 * 支付宝浏览器支付
 */
function payReady(params: any) {
    var pages = getCurrentPages();
    // console.log('上传给支付宝那边的  tradeNO====:' + params?.tradeNO);
    window.AlipayJSBridge.call(
        'tradePay',
        {
            tradeNO: params?.tradeNO,
        },
        function (result) {
            console.log('支付宝支付返回参数=====');
            console.log(result);
            switch (result.resultCode) {
                case '9000':
                    console.log('file : payment.ts payReady params:', params);
                    toPageResult(params);
                    break;
                case '6001':
                    //用户主动取消支付
                    payFail(params);
                    console.log('pages :>> ', pages);
                    console.log('pages.length :>> ', pages.length);
                    try {
                        window.history.back();
                    } catch (error) {
                        console.log('error :>> ', error);
                    }
                    //判断是否是威缴费跳转的情况
                    // if (pages.length > 2) {
                    //     uni.navigateBack({ delta: 1 });
                    // }
                    break;
                default:
                    payFail(params);
            }
        }
    );
}

/**
 * 微信浏览器支付
 */
function payWechatReady(payInfo: object, params: any) {
    var pages = getCurrentPages();
    window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
            ...payInfo,
        },
        function (res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                toPageResult(params);
            } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                console.log('pages :>> ', pages);
                console.log('pages.length :>> ', pages.length);
                payFail(params);
                try {
                    window.history.back();
                } catch (error) {
                    console.log('error :>> ', error);
                }
                //判断是否是威缴费跳转的情况
                // if (pages.length > 2) {
                //     uni.navigateBack({ delta: 1 });
                // }
            }
        }
    );
}

/**
 * 支付
 */
function requestPayment(preOrderInfo, params, message) {
    const payInfo = JSON.parse(preOrderInfo);
    return new Promise((resolve, reject) => {
        // #ifdef H5
        const currentBrowser = getWhichBrowser();
        if (currentBrowser === 'aliapp') {
            //在支付宝浏览器中
            if (window.AlipayJSBridge) {
                console.log(' payment.ts 324 ~ returnnewPromise ~ windows.AlipayJSBridge: ', window.AlipayJSBridge)
                payReady(params);
            } else {
                document.addEventListener(
                    'AlipayJSBridgeReady',
                    function () {
                        payReady(params);
                    },
                    false
                );
            }
        } else if (currentBrowser === 'micromessenger') {
            //在微信浏览器中
            if (typeof window.WeixinJSBridge == 'undefined') {
                document.addEventListener(
                    'WeixinJSBridgeReady',
                    () => {
                        payWechatReady(payInfo, params);
                    },
                    false
                );
            } else {
                payWechatReady(payInfo, params);
            }
        }
        // #endif

        // #ifdef MP-WEIXIN
        uni.requestPayment({
            ...payInfo,
            success: (result) => {
                //支付成功跳结果页
                toPageResult({...params});
                resolve(result);
            },
            fail: () => {
                payFail(params);
                reject({
                    msg: '支付已取消',
                });
            },
        });
        // #endif

        // #ifdef TAIZHOU
        // #ifdef H5
        if (currentBrowser === 'tzbank') {
            // 台州手机银行app
            if (message.respCode !== '' && message.respCode !== '0000') {
                uni.showToast({
                    icon: 'none',
                    title: '交易失败！',
                    duration: 2500,
                });
                window.AlipayJSBridge.call('closeWebview');
            } else {
                //支付控件
                uni.hideLoading();
                window.AlipayJSBridge.call(
                    'startACQPPay',
                    {
                        token: params.mobileToken,
                        successUrl: message.phoneSuccessUrl,
                        failUrl: message.phoneErrorUrl,
                    },
                    function (result) {
                        console.log(result);
                    }
                );
            }
        }
        // TODO 自测跳过支付
        // toPageResult({
        //     ...params,
        // });
        // #endif
        // #endif
    });
}

/**
 * 统一下单接口
 */
export async function placeOrderPay(params?: any): Promise<any> {
    const quickPayParams = params.quickPayParams,
        payMethod = params.payMethod;

    const newParams = {
        ...params,
        quickPayParams: undefined,
        payMethod: undefined,
        // #ifdef MP-WEIXIN
        // 259号文商户小程序终端报备字段terminal_id优化，需要前端小程序上送qrId
        qrId: params?.qrId ? params.qrId : undefined,
        // #endif
        nativeQrId: params?.nativeQrId ? params.nativeQrId : undefined,
    };
    if (payMethod === 'quickPay') {
        uni.navigateTo({
            url:
                '/pages/payment/sms-code?data=' +
                JSON.stringify({
                    ...quickPayParams,
                    money: newParams.money,
                    mchId: newParams.mchId,
                    userId: newParams.userId,
                    remark: newParams.remark,
                    daMoney: newParams.daMoney,
                    interestsList: newParams.interestsList,
                }),
        });
        return;
    }

    let newUrl = API.preorder;
    // #ifdef H5
    newUrl = newParams?.payType === '2' || params.nativeQrId ? API.preorder : API.preorderV2;
    // #endif
    // #ifdef TAIZHOU
    const currentBrowser = getWhichBrowser();
    if (currentBrowser === 'tzbank') {
        newUrl += '?payType=tzbank';
    }
    // #endif
    const res = await RootAjax<resultType>({
        method: 'post',
        url: newUrl,
        // #ifdef H5
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        // #endif
        data: newParams,
    });
    if (res && res.result === '200') {
        //小程序上报监控 下单成功
        // reportMonitor('1');
        try {
            //金额大于等于500时,跳转大额界面
            if (res?.message?.payType == 2 && params?.payType == 1) {
                const qrcodeUrl = encodeURIComponent(
                    uni.getStorageSync('QRCODEURL') + '?preOrderId=' + res?.message?.preOrderId
                );
                const preOrderId = encodeURIComponent(res?.message?.preOrderId);
                //云闪付通道unionUserId中可能含有特殊字符+等，先编码成%2B的形式传递给大额页面，再重新解码
                if (newParams.unionUserId && newParams.unionUserId.length > 0){
                    newParams.unionUserId = encodeURIComponent(newParams.unionUserId);
                }
                uni.navigateTo({
                    url:
                        '/pages/payment/excess?params=' +
                        encodeURIComponent(JSON.stringify(newParams)) +
                        '&qrcodeUrl=' +
                        qrcodeUrl +
                        '&preOrderId=' +
                        preOrderId +
                        '&mchName=' +
                        quickPayParams.mchName,
                });
            } else {
                // #ifdef MP-WEIXIN
                if (payMethod !== 'quickPay') {
                    await requestPayment(
                        res?.message?.payInfo || '{}',
                        {
                            ...params,
                            outTradeNo: res?.message?.outTradeNo,
                            mktOrderNo: res?.message?.mktOrderNo,
                        },
                        res?.message
                    );
                }
                // #endif
                // #ifdef H5
                if (res.status == 200) {
                    if (res?.message.forward && res?.message.forward === 1) {
                        location.href = res?.message.forwardUrl;
                    } else if (res?.message.code_url) {
                        //云闪付
                        location.href = res?.message.code_url;
                    } else {
                        const payInfo = {
                            appId: res?.message?.appId,
                            timeStamp: res?.message?.timeStamp,
                            nonceStr: res?.message?.nonceStr,
                            package: res?.message?.package,
                            signType: res?.message?.signType,
                            paySign: res?.message?.paySign,
                        };
                        await requestPayment(
                            JSON.stringify(payInfo),
                            {
                                ...params,
                                outTradeNo: res.reqForm.outTradeNo,
                                tradeNO: res.message.tradeNO || '',
                                mktOrderNo: res?.message?.mktOrderNo,
                            },
                            res?.message
                        );
                    }
                } else {
                    uni.showToast({
                        title: res?.message || '系统错误',
                        icon: 'none',
                        duration: 2500,
                    });
                }
                // #endif
            }
            return res;
        } catch (error: any) {
            console.log('payment.ts 549 ~ placeOrderPay ~ error', error)
            uni.showToast({
                title: error?.msg || error?.errMsg || '数据解析错误',
                icon: 'none',
                duration: 2500,
            });
        }
    } else if (res && res?.retcode === '308') {
        uni.showModal({
            title: '提示',
            content: res?.retmsg || '网络异常！',
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#01A763',
        });
    }
    return {};
}

/**
 *  获取用户已绑定快捷卡接口
 */
export const queryBindCardInfo = async (data?: queryBindCardInfoType): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.queryBindCardInfo,
        data: {
            ...data,
        },
    });
};

/**
 *  地理围栏
 */
export const isAbroadByIp = async (data: { mchId: string }): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.isAbroadByIp,
        data: {
            ...data,
        },
    });
};

/**
 *  地理围栏
 */
export const queryOrderStatus = async (data: { mchId: string; outTradeNo: string }): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.queryOrderStatus,
        data: {
            ...data,
        },
    });
};

// #ifdef QSBANK
/**
 * 获取手机银行用户银行卡列表
 */
export const queryBankAccountInfo = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.queryBankAccountInfo,
        data,
    });
};
// #endif
