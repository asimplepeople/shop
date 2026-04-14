import { Ajax } from '../utils/network/AjaxUtils';
import { resultType } from '../types';

/**
 * 上传图片
 */
export const uploadImage = async (data?: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: '/spay/merchant/interface/singleImgUpload',
        data,
        isFormdata: true,
    });
};

/**
 * 提交
 */
export const submitImage = async (data: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: '/spay/merchant/interface/updateCertificates',
        data,
    });
};

/**
 * 查询证件信息
 */
export const getCertInfo = async (data: any): Promise<any> => {
    return await Ajax<resultType>({
        method: 'post',
        url: '/spay/merchant/interface/qryCertificatesInfo',
        data,
    });
};
