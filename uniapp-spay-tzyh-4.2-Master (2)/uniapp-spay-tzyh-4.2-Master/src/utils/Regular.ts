/**
 * 规则
 */
export const Regular = {
    mobile: /^1[3456789]\d{9}$/, //手机号
    phone: /^[0-9\-]{10,}$/, //手机号和电话
    idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证
    idPassport: /^[a-zA-Z0-9]{5,17}$/, // 护照
    license: /^[a-zA-Z0-9]+$/, //营业执照
    email: /^([a-zA-Z0-9_\.\-]+)@([\da-zA-Z\.\-]+)\.([a-zA-Z\.]{2,6})$/, //邮箱
    card: /^\d{12,28}$/, //银行卡号
    servicePhone: /^[0-9]{5,15}$/, //客服电话
    shortName: /^(?![0-9]+$)^((?!\\|\/|:|\*|\?|<|>|\||'|%).)+$/, //商户简称不能为纯数字以及剔除掉非法字符
};
//
/**
 * 手机号是否合法
 * @param {string} val 手机号
 */
export function regExpPhone(val) {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(val);
}
/**
 * 身份证是否合法
 * @param {string} id 身份证
 */
export function regExpIdentity(id) {
    return /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(id);
}
