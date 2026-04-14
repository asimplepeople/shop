export type queryMchInfoType = {
    qrId?: string;
    browserType: string;
    mchId?: string;
    nativeQrId?: string;
};

export type queryBindCardInfoType = {
    thirdUserId: string;
    signSource?: number;
    appid: string;
    mchId: string;
};

export type payTypeListType = {
    payType: string;
    payName: string;
    icon?: string;
};

export type feeType = {
    //分期数
    stageNum: number;
    //分期费率
    feeRate: number;
    //每期支付金额
    eachAmount?: number;
    //每期手续费
    eachFeeAmount?: number;
    //总手续费
    totalFee?: number;
};
export type cardListType = {
    cardLastFour?: string;
    signNo?: string;
    bankName?: string;
    productName?: string;
    mobile?: string;
    bankCardType?: string;
};

export type knockActivityListType = {
    couponId: string; //活动编号
    couponName?: string;
    preferentialType?: string; //1：满减  2、随机立减
    preferentialAmount: number; //优惠金额
    couponMaxAmount: number; //区间适用最大金额
    couponMinAmount: number; //区间适用最小金额
    discountLimit: number; //满减门槛
    onceAmountLimit: number; //折扣活动最大优惠金额
};
export type BankAppConfig = {
    // 台州
    phoneCode: string;
    token: string;
};

export type dataType = {
    //带订单的支付限时倒计时
    countDownTime?: string;
    //取后端倒计时时间
    remainingTime: number;
    //带了金额的固码
    fixedMoney: string;
    //以元为单位，用户输入的金额
    money: string;
    //以分为单位，优惠金额
    couponMoney: number;
    canInput: boolean;
    //备注输入
    inputRemark: string;
    //备注
    remark: string;
    //当前选择的支付方式  快捷支付、第三方支付
    currentPayType: string;
    //当前选择的优惠方式  积分、满减、立减
    currentCouponType: string;
    //是否是银行卡列表弹框
    isBankDialog: boolean;
    //当前选择的银行对象
    currentSelectBank: cardListType;
    // 银行或者优惠弹框
    bankOrCoupon: string;
    // 订单号:带了订单号付款场景使用
    outTradeNo: string;
    //当前选择的优惠券
    knockActivityObj: {
        //活动编号：满减和随机立减用这个活动编号
        couponId?: string;
        //活动名称
        couponName?: string;
        //优惠金额
        preferentialAmount?: number;
        //优惠类型
        preferentialType?: string;
        //活动备注
        discountTitle?: string;
        onceAmountLimit?: number;
    };
    //当前选择的优惠方式 积分 | 优惠券
    currentCouponObj: {
        couponType?: string; // 1 满减 2 积分 3随机立减 4卡券
        interestsSeqNo?: string; //权益编号：获取权益接口拿到的数据
        couponId?: string; //活动编号：满减和随机立减用这个活动编号
        costBonus?: number; //核销积分数
        couponName?: string; //活动名称
        preferentialAmount?: number; //优惠金额
        customerNo?: string; //客户号
        discountTitle?: string; //活动描述
    };
    hbSelected: feeType[];
    isClickConfirm: boolean;
    //是否有积分优惠
    isHaveIntegral: boolean;
    //是否有满减优惠
    isHaveKnockActivity: boolean;
    couponData: {
        integralBalance?: number; //积分余额
        availableIntegral?: number; //可用积分
        integralPrice?: number; //积分定价
        integralThreshold?: number; //积分门槛
        knockActivityLists?: knockActivityListType[]; //立减活动列表
        customerNo?: string;
        verificationNum?: number;
    };
    //商户信息
    mchInfo: {
        // 台州-广告链接
        adUrl: '';
        //商户名
        mchName: string;
        //备注是否必填  1、必填 0：非必填
        qrRemarkSwitch: string;
        mchId: string;
        userId?: string;
        payAcceptOrgLogo?: string;
        //商家贴息 0 不贴息  1 贴息
        interestFree?: string;
        //地理围栏功能 1、不做拦截 2、拦截弹框能继续支付 3、拦截弹框不能继续支付
        abroadTradeFlag?: string;
        //满足多少金额支持花呗分期
        moneyLimit?: number;
        //成都农商行第三方支付使用权益是否开启 true:开启，false：不开启
        thirdPayUseInterests?: boolean;
        hbPayParamMap?: {
            moneyLimit?: number;
            isTop?: boolean;
            rate?: {
                '3'?: string;
                '6'?: string;
                '12'?: string;
            };
        };
        isTop?: boolean;
        payMethod?: {
            quickPay?: boolean;
            aliPayJsPay?: boolean;
            aliPayNative?: boolean;
            huaBei?: boolean;
            wechatPay?: boolean;
            unionPay?: boolean;
            unionPayProxy?: boolean;
        };
        outTradeNo?: string;
        callbackUrl?: string;
    };
    //卡列表
    cardList: cardListType[];
    //地理围栏是否需要弹框
    isRiskTrade: boolean;
    //弹框对象
    alertDialogObj: {
        cancelText: string;
        confirmText: string;
        title: string;
        content: string;
        type: string;
    };
    nativeQrId?: string;
    qrId?: string;
    pierce?: string;
    // 根据银联要求，银联二维码下单需要上传字段 userAuthCode、qrCode
    userAuthCode?: string;
    qrCode?: string;
    // 手机银行app配置
    bankAppConfig: BankAppConfig;
};
