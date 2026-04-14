import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';
import JSONData from '../mock-data/province-city-area.json';
import { API } from './api';

/**
 * 获取个人信息收集声明
 */
export const getStatementApi = async (data?: any): Promise<any> => {
    const { bankCode, orgId } = data;
    let url = API.getContentByCodeH5;
    if (bankCode) {
        url += '?bankCode=' + bankCode;
    }
    if (orgId) {
        const connector = /\?/.test(url) ? '&' : '?';
        url += connector + 'orgId=' + orgId;
    }
    return await Ajax<resultType>({
        method: 'post',
        url,
        furl: true,
        data,
    });
};

/**
 * 获取验证码
 */
export const sendMsgCodeApi = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.sendMsgCode,
        data,
    });
};

/**
 * 校验短信
 */
export const checkMsgCodeApi = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.checkMsgCode,
        data,
    });
};

/**
 * 校验邀请码
 */
export const getBaseInfoByInvitationCodeApi = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getBaseInfoByInvitationCode,
        data,
    });
};

/**
 * 单个上传图片
 */
export const singleImgUploadApi = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.singleImgUpload,
        silent: true,
        data,
        loadingTitle: '上传中...',
        timeout: 120000,
    });
};

/**
 * 图像识别获取商户信息
 */
export const getMerchantInfoFromOcrApi = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getMerchantInfoFromOcr,
        data,
        silent: true,
        loadingTitle: '识别中...',
    });
};

// 获取主体列表
export const getAllSubjectType = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getAllSubjectType,
        data,
    });
};

/**
 * 判断商户主体 证件号/注册号是否能开通
 */
export const hasApplyMchAccountApi = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.hasApplyMchAccount,
        data,
    });
};

// 行业类型
export const getIndustryList = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getIndustry,
        data,
    });
};

//终端类型
export const getTerminaList = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getAllTerminalType,
        data,
    });
};

// 省市区
export const getProvinceCityArea = async (data?: any): Promise<any> => {
    const session = uni.getStorageSync('cacheProvinceCityArea');
    if (session) {
        return new Promise((resolve) => resolve(session));
    }

    const res = await Ajax<resultType>({
        method: 'post',
        url: API.getProvinceCityArea,
        data,
    });
    if (res?.result === '200') {
        // 序列化
        if (res?.message === 'SUCCESS') {
            res.message = JSON.parse(JSONData.message);
        }
        // 生成树结构
        const { provinceList, cityList, countyList } = res.message;
        res.message = provinceList.map((p) => {
            return {
                text: p.areaName,
                value: p.areaCode,
                children: cityList
                    .filter((c) => c.parentArea === p.areaCode)
                    .map((city) => {
                        return {
                            text: city.areaName,
                            value: city.areaCode,
                            children: countyList
                                .filter((c) => c.parentArea === city.areaCode)
                                .map((c) => {
                                    return {
                                        text: c.areaName,
                                        value: c.areaCode,
                                    };
                                }),
                        };
                    }),
            };
        });
        uni.setStorageSync('cacheProvinceCityArea', res);
    }

    return new Promise((resolve) => resolve(res));
};

// 获取支付类型 （支付产品）
export const getPayTypeInfo = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getPayTypeInfo,
        data,
    });
};

// 获取账户类型
export const getAccountType = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getAccountType,
        data,
    });
};

// 校验支付类型费率
export const validateMchRate = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.validateMchRate,
        data,
    });
};

// 获取开户银行列表
export const getAllBank = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getAllBank,
        data,
    });
};

// 获取银行支行
export const getAllBranchBank = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getAllBranchBank,
        data,
    });
};

// 结算账户校验
export const accountAuthentication = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.accountAuthentication,
        data,
    });
};

// 获取行内商户协议
export const getEleProtocol = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.getEleProtocol,
        data,
    });
};

// 上送手写签名
export const synEleSignProtocol = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.synEleSignProtocol,
        data,
    });
};

// 商户进件
export const merchantRegist = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: API.merchantRegist,
        loadingTitle: '提交资料中...',
        timeout: 120000,
        data,
    });
};
