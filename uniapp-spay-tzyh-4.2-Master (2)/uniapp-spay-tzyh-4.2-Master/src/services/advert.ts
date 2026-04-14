import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';
import { API } from './api';
import Config from '../../config/config';

/**
 * 获取广告插件
 */
export const getAdvertInfo = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getAdvertInfo,
        data,
        furl: true,
        isEncrypt: false,
        isFormdata: true,
        silence: true,
        hasHandleCustom: true,
    });
};

/**
 * 获取广告
 */
export const getAd = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getAd,
        data,
        furl: true,
        isEncrypt: false,
        isFormdata: true,
        silence: true,
        hasHandleCustom: true,
        timeout: 10000,
        header: {
            'channel-token': Config?.adParams?.channelT,
        },
    });
};

/**
 * 关闭广告接口
 */
export const closeAdvert = async (data?: any, silence = true): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.closeAdvert,
        data,
        furl: true,
        isEncrypt: false,
        isFormdata: true,
        silence,
        hasHandleCustom: true,
        timeout: 10000,
        header: {
            'channel-token': Config?.adParams?.channelT,
        },
    });
};
