import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';
import { API } from './api';

/**
 * 商户手续费减免列表
 */
export const queryFreeData = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.subsidyList,
        data,
        isFormdata: true,
    });
};

/**
 * 商户手续费减免明细规则1_2
 */
export const query_rule1_2 = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.detail_rule1_2,
        data,
        isFormdata: true,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
    });
};

/**
 * 商户手续费减免明细规则3
 */
export const query_rule_3 = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.detail_rule3,
        data,
        isFormdata: true,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
    });
};

// 台州-查看商户参与的活动与减免基础信息接口
export const getFeeDeductionDetail = async (authInfo, data?: any): Promise<any> => {
    console.log("getFeeDeductionDetail data:",data);
    return await Ajax<resultType>({
        method: 'post',
        url: '/spay/merchant/fee/getFeeDeductionDetail',
        data,
        header: {
            ...authInfo
        },
    });
};

// 台州-查看手续费减免活动接口
export const getFeeDeductionInfo = async (query, authInfo): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: '/spay/merchant/fee/getFeeDeductionInfo?mchId=' + query,
        header: {
            ...authInfo
        },
    });
};
