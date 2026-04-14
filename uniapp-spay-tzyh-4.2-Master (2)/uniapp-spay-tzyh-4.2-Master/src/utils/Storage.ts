/**
 * 设置商户信息到本地缓存
 * @param {object} info 商户信息
 */
export function setMerchantInfoStorage(data) {
    uni.setStorageSync('MERCHANT_INFO', typeof data === 'string' ? data : JSON.stringify(data));
}

/**
 * 获取商户信息到本地缓存
 */
export function getMerchantInfoStorage() {
    const merchantInfo = uni.getStorageSync('MERCHANT_INFO');
    let newInfo = merchantInfo;
    try {
        if (newInfo && typeof newInfo === 'string') {
            newInfo = JSON.parse(newInfo);
        }
    } catch (error) {
        console.log('getMerchantInfoStorage', error);
        throw error;
    }
    return newInfo;
}

/**
 * 移除本地缓存的商户信息，注册成功后删除信息
 */
export function removeMerchantInfoStorage() {
    uni.removeStorageSync('MERCHANT_INFO');
}

/**
 * 设置商户token
 */
export function setTokenStorage(token) {
    uni.setStorageSync('TOKEN', token);
}

/**
 * 获取商户token
 */
export function getTokenStorage() {
    return uni.getStorageSync('TOKEN');
}

/**
 * 移除商户token
 */
export function removeTokenStorage() {
    uni.removeStorageSync('TOKEN');
}

/**
 * 设置商户行内ecif信息
 */
export function setEcifStorage(data) {
    uni.setStorageSync('ECIF', typeof data === 'string' ? data : JSON.stringify(data));
}

/**
 * 获取商户行内ecif信息
 */
export function getEcifStorage() {
    const ecifData = uni.getStorageSync('ECIF');
    let newEcifData = ecifData;
    try {
        if (newEcifData && typeof newEcifData === 'string') {
            newEcifData = JSON.parse(newEcifData);
        }
    } catch (error) {
        console.log('getEcifStorage', error);
        throw error;
    }
    return newEcifData;
}

/**
 * 移除商户行内ecif信息
 */
export function removeEcifStorage() {
    uni.removeStorageSync('ECIF');
}

/**
 * 设置base64图片到缓存
 */
export function setBase64ImgStorage(field, base64) {
    uni.setStorageSync(`${field}_BASE64_IMG`, base64);
}

/**
 * 获取base64图片
 */
export function getBase64ImgStorage(field) {
    return uni.getStorageSync(`${field}_BASE64_IMG`);
}

/**
 * 移除base64图片
 */
export function removeBase64ImgStorage(field) {
    uni.removeStorageSync(`${field}_BASE64_IMG`);
}
