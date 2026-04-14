import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';
import { API } from './api';

/**
 * 查询理财产品
 */
export const queryProduct = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.queryProduct,
        data,
        isFormdata: true,
    });
};
