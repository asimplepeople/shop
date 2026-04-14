import { resultType } from '../../types';
// import JSONData from '../mock-data/province-city-area.json';
import { API } from '../api';
import { RootAjax } from './payment';

/**
 * 快捷相关接口
 */

/**
 * 识别卡类型
 */
export const queryCardType = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.queryCardType,
        data,
    });
};

/**
 * 快捷签约鉴权接口
 */
export const quickAuth = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.quickAuth,
        data,
    });
};

/**
 * 快捷签约协议（绑卡）接口
 */
export const quickBind = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.quickBind,
        data,
    });
};

/**
 * 获取快捷支付验证码接口
 */
export const getSmsVerificationCode = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.getSmsVerificationCode,
        data,
    });
};

/**
 * 快捷支付接口
 */
export const quickPay = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.quickPay,
        data,
    });
};

/**
 * 快捷签约绑卡-获取图形验证码接口
 */
export const getVerificationImgCode = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.getVerificationImgCode,
        data,
        silence: true,
    });
};

/**
 * 快捷签约绑卡-图形验证码校验接口
 */
export const verificationImgCode = async (data?: any): Promise<any> => {
    return await RootAjax<resultType>({
        method: 'post',
        url: API.verificationImgCode,
        data,
    });
};
