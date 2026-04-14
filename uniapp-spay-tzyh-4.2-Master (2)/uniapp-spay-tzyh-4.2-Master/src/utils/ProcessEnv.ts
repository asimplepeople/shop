/**
 * 获取当前银行所有变量
 */
export function getAllEnv() {
    // console.log('process.env', process.env);
    if (process.env.UNI_CUSTOM_DEFINE) {
        return JSON.parse(process.env.UNI_CUSTOM_DEFINE || '{}');
    }
    return {};
}

/**
 * node环境获取环境变量
 * @param {string} val 环境变量名称
 */
export function getNodeProcessEnv(val) {
    return getAllEnv()[val];
}
