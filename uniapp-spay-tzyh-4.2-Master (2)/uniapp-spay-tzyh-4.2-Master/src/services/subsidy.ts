import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';

/**
 * 商户手续费减免查询
 */
export const isOpenMchSubsidy = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: '/spay/isOpenMchSubsidy',
        data,
        isFormdata: true,
    });
};

/**
 * 商户手续费减免历史列表
 */
export const queryHisSubsidyList = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: '/spay/queryHisSubsidyList',
        data,
        isFormdata: true,
    });
};
