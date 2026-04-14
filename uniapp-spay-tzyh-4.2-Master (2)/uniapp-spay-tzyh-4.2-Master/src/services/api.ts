/**
 * 接口路径
 */
export const API = {
    getIdentificationInfo: '/spay/wechat/identification/info', // 获取商户授权信息
    getContentByCodeH5: '/spay/preProtocol/getContentByCodeH5', // 获取个人信息收集声明
    sendMsgCode: '/spay/hnnx/merchant/sendMsgCode', // 获取验证码
    checkMsgCode: '/spay/hnnx/merchant/checkMsgCode', // 校验短信
    getBaseInfoByInvitationCode: '/spay/hnnx/merchant/getBaseInfoByInvitationCode', // 校验邀请码
    singleImgUpload: '/spay/hnnx/merchant/singleImgUpload', // 单个上传图片
    getMerchantInfoFromOcr: '/spay/hnnx/merchant/getMerchantInfoFromOcr', // 图像识别获取商户信息
    getAllSubjectType: '/spay/hnnx/merchant/getAllSubjectType', // 获取主体列表
    hasApplyMchAccount: '/spay/hnnx/merchant/hasApplyMchAccount', // 判断商户主体 证件号/注册号是否能开通
    getIndustry: '/spay/hnnx/merchant/getIndustry', // 行业类型
    getAllTerminalType: '/spay/hnnx/merchant/getAllTerminalType', // 终端类型
    getAccountType: '/spay/hnnx/merchant/getAllAccountType', // 终端类型
    getProvinceCityArea: '/spay/hnnx/merchant/getProvinceCityArea', // 省市区
    getPayTypeInfo: '/spay/hnnx/merchant/getPayTypeInfo', // 获取支付类型 （支付产品）
    validateMchRate: '/spay/hnnx/merchant/validateMchRate', // 校验支付类型费率
    getAllBank: '/spay/hnnx/merchant/getAllBank', // 获取开户银行列表
    getAllBranchBank: '/spay/hnnx/merchant/getAllBranchBank', // 获取银行支行
    accountAuthentication: '/spay/hnnx/merchant/accountAuthentication', // 结算账户校验
    getEleProtocol: '/spay/hnnx/merchant/getEleProtocol', // 获取行内商户协议
    synEleSignProtocol: '/spay/hnnx/merchant/synEleSignProtocol', // 上送手写签名
    merchantRegist: '/spay/hnnx/merchant/merchantRegist', // 商户进件
    queryBindCardInfo: '/spay/cashier/card/queryBindCardInfo', //获取用户已绑定快捷卡接口
    queryInterestsInfo: '/spay/cashier/interests/queryInterestsInfo', //查询用户所拥有的权益信息
    // closingOrder: '/spay/cashier/interests/closingOrder', //用户下单核销权益后并未支付，进行关闭该笔订单并作撤销权益
    queryMchInfo: '/spay/min/pay/queryMchInfo',
    queryMchInfoNative: '/spay/min/pay/queryMchInfoNative',
    orderNoOrderDetail: '/spay/min/pay/orderNoOrderDetail', //根据订单号查询订单信息
    cancelPay: '/spay/min/pay/cancelPay', //取消支付上报
    isAbroadByIp: '/spay/isAbroadByIp', //地理围栏,查询当前IP对应的地理位置是否在符合的地区内
    // #ifdef MP-WEIXIN
    getJsCode2Session: '/spay/wxspay/getJsCode2Session',
    preorder: '/spay/min/pay/fixedCodePay', //小程序预下单接口
    orderDetail: '/spay/min/pay/orderDetail', //小程序主扫,订单信息
    queryOrderStatus: '/spay/min/pay/queryOrderStatus', //快捷支付查询订单状态
    // #endif
    // #ifdef H5
    preorderV2: '/spay/fixedCodePayV2',
    preorder: '/spay/fixedCodePay',
    // #endif
    queryCardType: '/spay/cashier/card/queryCardType', // 识别卡类型
    quickAuth: '/spay/cashier/card/quickAuth', // 快捷签约鉴权接口
    quickBind: '/spay/cashier/card/quickBind', // 快捷签约协议（绑卡）接口
    getSmsVerificationCode: '/spay/cashier/payment/getSmsVerificationCode', // 获取快捷支付验证码接口
    quickPay: '/spay/cashier/payment/quickPay', // 快捷支付接口
    getVerificationImgCode: '/spay/cashier/card/getVerificationImgCode', // 快捷签约绑卡-获取图形验证码接口
    verificationImgCode: '/spay/cashier/card/verificationImgCode', // 快捷签约绑卡-图形验证码校验接口
    // #ifdef QSBANK
    queryBankAccountInfo: '/spay/cashier/card/queryBankAccountInfo', // 获取手机银行用户银行卡列表
    // #endif
    queryProduct: '/spay/financing/product/list', //查询理财产品
    getValidCode: '/spay/xiaowei/sppay-xiaowei-app-web/verifyImage', //获取商户绑定验证码
    wxAuth: '/spay/xiaowei/sppay-xiaowei-app-web/wxAuth', //微信网页授权获取code
    bingdMerchant: '/spay/xiaowei/sppay-xiaowei-app-web/xiaowei/merchantAssociate/check', //绑定商户推送消息
    subsidyList: '/spay/merchant/fee/subsidy/list', //手续费减免列表
    detail_rule1_2: '/spay/merchant/fee/subsidy/detail_rule1_2', //商户手续费减免明细规则1_2
    detail_rule3: '/spay/merchant/fee/subsidy/detail_rule3', //商户手续费减免明细规则3

    // 广告接口 start
    // 测试环境
    // getAdvertInfo: 'https://adverttest.swiftpass.top/api/v1/getPlugin', //获取广告插件
    // getAd: 'https://adverttest.swiftpass.top/api/v1/getDataList', //获取广告
    // closeAdvert: 'https://adverttest.swiftpass.top/api/v1/shield', //关闭广告
    // 生产环境
    getAdvertInfo: 'https://stable-api.swiftpass.cn/api/v1/getPlugin', //获取广告插件
    getAd: 'https://stable-api.swiftpass.cn/api/v1/getDataList', //获取广告
    closeAdvert: 'https://stable-api.swiftpass.cn/api/v1/shield', //关闭广告
    // 广告接口 end
};
