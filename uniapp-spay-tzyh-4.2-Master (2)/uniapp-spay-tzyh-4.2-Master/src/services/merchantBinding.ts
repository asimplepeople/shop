import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';
import { API } from './api';

/**
 * 授权回调
 */
export const getwxAuth = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'get',
        url: API.wxAuth,
        data,
    });
};

/**
 * 获取验证码
 */
export const getValidCode = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'get',
        url: API.getValidCode,
        data,
        responseType: 'arraybuffer',
    });
};

/**
 * 绑定商户
 */
export const bingdMerchant = async (url: String, data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: url,
        data,
    });
};
