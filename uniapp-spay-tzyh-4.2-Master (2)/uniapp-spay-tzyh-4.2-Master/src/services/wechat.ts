import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';
import JSONData from '../mock-data/province-city-area.json';
import { API } from './api';

/**
 * 获取商户授权信息
 */
export const getIdentificationInfo = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getIdentificationInfo,
        data,
    });
};
