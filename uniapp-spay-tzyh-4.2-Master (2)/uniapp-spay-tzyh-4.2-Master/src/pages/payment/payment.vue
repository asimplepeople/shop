<template>
    <view class="payment">
        <view class="top">
            <view v-if="data.nativeQrId" class="top-blank" />
            <view v-if="data.nativeQrId" class="time-limit text-center desc-color">
                请在
                <text class="red-color"> {{ data.countDownTime }} </text>
                内完成支付，超时订单将自动关闭
            </view>
            <view class="top-blank" />
            <view class="fixed-money-block" :class="data.nativeQrId ? 'big-white-background' : ''">
                <view class="top-bg">
                    <image :src="currentBank.topBg" />
                </view>
                <view class="text-center title-color">{{ data?.mchInfo?.mchName }}</view>
                <!--   #ifdef CDRCB  -->
                <view class="fixed-money-dec">付款金额</view>
                <!-- #endif -->
                <view class="white-background">
                    <view v-if="!data.fixedMoney" class="top-uni-row">
                        <uni-row>
                            <uni-col :span="2"><view class="title-color payment-money-symbol">¥</view></uni-col>
                            <uni-col :span="22">
                                <view class="flex">
                                    <view class="payment-money title-color">{{ data?.money }}</view>
                                    <view class="input-line" />
                                    <view
                                        v-if="!data.money && BANK_CODE !== 'cdrcb'"
                                        class="desc-color payment-money-placeholder"
                                    >
                                        请输入消费金额
                                    </view>
                                </view>
                            </uni-col>
                        </uni-row>
                    </view>
                    <view v-else>
                        <view class="top-uni-row">
                            <view class="text-center">
                                <text class="title-color payment-money-symbol">¥</text>
                                <text class="payment-money title-color">{{
                                    Money.fenChangeYuan(data.fixedMoney)
                                }}</text>
                            </view>
                        </view>
                        <view v-if="data.nativeQrId" class="text-center placeholder-color out-trade-no font-size-24"
                            >商户订单号：{{ data.outTradeNo }}</view
                        >
                    </view>

                    <view class="remark-block">
                        <view class="driver" />
                        <view
                            :class="
                                (data.remark ? 'desc-color' : 'primary-color standard-remark-color') +
                                ' remark-block-text font-size-24'
                            "
                            @click="remarkDialogToggle('open')"
                            >{{ data.remark || (BANK_CODE === 'cdrcb' ? '添加付款备注' : (data.mchInfo.appSwitchRemark || '添加备注20字以内')) }}</view
                        >
                    </view>
                </view>
            </view>
        </view>
        <view class="desc-color font-size-24 text-center">付款前请您核对付款信息</view>
        <view
            v-if="(currentBrowser === 'micromessenger' || currentBrowser === 'miniprogram') && data.mchInfo.adShowFlag && adImg"
            class="ad-box"
            @click="goAdHost"
        >
            <image :src="adImg" />
        </view>
        <view>
            <keyboard
                v-if="!data.fixedMoney"
                :src="data.mchInfo.payAcceptOrgLogo"
                :current-env="currentBrowser"
                :can-input="data.canInput"
                @confirm="confirmPay"
                @change="keyboardInput"
            />
            <view v-else class="footer-btn safe-btn">
                <view class="confirm-btn" @click="confirmPay">确认支付</view>
                <view class="safe-padding-bottom" />
            </view>
        </view>
    </view>
    <uni-popup :ref="remarkInputDialog" type="dialog">
        <view class="dialog">
            <view class="dialog-content">
                <view>
                    <textarea
                        v-model="data.inputRemark"
                        maxlength="20"
                        :placeholder="data.mchInfo.appSwitchRemark || '添加备注（20字以内）'"
                        class="dialog-content-textarea"
                    ></textarea>
                </view>
            </view>
            <view class="dialog-footer">
                <view class="footer-btn text-center title-color" @click="remarkDialogToggle('close')">取消</view>
                <view class="footer-btn confirm-btn text-center" @click="remarkInputConfirm">确认</view>
            </view>
        </view>
    </uni-popup>

    <uni-popup :ref="payTypeDialog" type="bottom">
        <view class="pay-type-dialog">
            <view class="dialog-header text-center">
                选择支付方式
                <view class="close" @click="payTypeDialogToggle('close')"><image :src="closeImg" /></view>
            </view>
            <view class="dialog-content">
                <uni-list>
                    <uni-list-item
                        v-if="data.mchInfo?.payMethod?.quickPay"
                        :thumb="currentBank.logo"
                        thumb-size="sm"
                        :show-arrow="data.cardList?.length ? false : true"
                        clickable
                        class="pay-type-item"
                        :class="data.cardList?.length ? 'quick-type-item' : ''"
                        @click="selectPayType(payTypeList[0].payType)"
                    >
                        <template #body>
                            <view>
                                <view class="slot-box">
                                    <view class="title-color">{{
                                        data.currentSelectBank?.productName || currentBank.productName
                                    }}</view>
                                </view>
                                <view
                                    v-if="data.cardList?.length"
                                    class="discount-block gray-block"
                                    @click="selectCouponClick('open', 'bank')"
                                >
                                    <view class="flex">
                                        <view>
                                            {{
                                                data.currentSelectBank?.bankName +
                                                ' ' +
                                                (data.currentSelectBank?.bankCardType == '1' ? '借记卡' : '贷记卡') +
                                                ' ( ' +
                                                data.currentSelectBank?.cardLastFour +
                                                ' )'
                                            }}
                                        </view>
                                        <view>
                                            <uni-icons type="bottom" />
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <template #footer>
                            <text
                                v-if="!data.cardList?.length"
                                class="yellow-color font-size-24 right-text"
                                @click="skipBindCardPage"
                            >
                                <!-- 绑{{ currentBank.name }}享优惠 -->
                                添加银行卡
                            </text>
                            <radio
                                v-else
                                class="right-radio right-position-radio"
                                :value="payTypeList[0].payType"
                                :checked="payTypeList[0].payType === data.currentPayType"
                            />
                        </template>
                    </uni-list-item>
                    <uni-list-item
                        v-if="
                            (data.mchInfo?.payMethod?.aliPayJsPay || data.mchInfo?.payMethod?.aliPayNative) &&
                            currentBrowser === 'aliapp' &&
                            !data.mchInfo?.hbPayParamMap?.isTop
                        "
                        clickable
                        :title="payTypeList[1].payName"
                        :thumb="payTypeList[1].icon"
                        thumb-size="sm"
                        class="pay-type-item"
                        @click="selectPayType(payTypeList[1].payType)"
                    >
                        <template #footer>
                            <radio
                                class="right-radio"
                                :value="payTypeList[1].payType"
                                :checked="payTypeList[1].payType === data.currentPayType"
                            />
                        </template>
                    </uni-list-item>
                    <uni-list-item
                        v-if="
                            data.mchInfo?.payMethod?.huaBei &&
                            currentBrowser === 'aliapp' &&
                            Numeral.sub(Money.yuanChangeFen(data.money), data.couponMoney, 0) >=
                                (data.mchInfo?.hbPayParamMap?.moneyLimit || 10000)
                        "
                        :title="payTypeList[4].payName"
                        :thumb="payTypeList[4].icon"
                        thumb-size="sm"
                        class="pay-type-item"
                    >
                        <template #body>
                            <view class="title-color">{{ payTypeList[4].payName }}</view>
                            <view class="pay-type-item-rec">推荐</view>
                        </template>
                    </uni-list-item>
                    <uni-list
                        v-if="
                            data.mchInfo?.payMethod?.huaBei &&
                            currentBrowser === 'aliapp' &&
                            Numeral.sub(Money.yuanChangeFen(data.money), data.couponMoney, 0) >=
                                (data.mchInfo?.hbPayParamMap?.moneyLimit || 10000)
                        "
                        :border="false"
                    >
                        <uni-list-item
                            v-for="item in data.hbSelected"
                            :key="item.stageNum + ''"
                            clickable
                            class="huabei-list"
                            :border="false"
                            @click="selectPayType(payTypeList[4].payType + item.stageNum)"
                        >
                            <template #body>
                                <view class="border-top">
                                    <view class="title-color">
                                        ¥{{ Money.fenChangeYuan(item.eachAmount) }}x{{ item.stageNum }}期
                                    </view>
                                    <view v-if="data.mchInfo.interestFree == '1'">
                                        预计为您节省手续费
                                        <text>¥{{ Money.fenChangeYuan(item.totalFee) }}</text>
                                    </view>
                                    <view v-else class="font-size-24 desc-color">
                                        手续费¥{{ Money.fenChangeYuan(item.eachFeeAmount) }}/期
                                    </view>
                                </view>
                            </template>
                            <template #footer>
                                <radio
                                    class="right-radio right-position-radio"
                                    :value="payTypeList[4].payType + item.stageNum"
                                    :checked="payTypeList[4].payType + item.stageNum === data.currentPayType"
                                />
                            </template>
                        </uni-list-item>
                    </uni-list>

                    <uni-list-item
                        v-if="
                            (data.mchInfo?.payMethod?.aliPayJsPay || data.mchInfo?.payMethod?.aliPayNative) &&
                            currentBrowser === 'aliapp' &&
                            data.mchInfo?.hbPayParamMap?.isTop
                        "
                        clickable
                        :title="payTypeList[1].payName"
                        :thumb="payTypeList[1].icon"
                        thumb-size="sm"
                        class="pay-type-item"
                        @click="selectPayType(payTypeList[1].payType)"
                    >
                        <template #footer>
                            <radio
                                class="right-radio"
                                :value="payTypeList[1].payType"
                                :checked="payTypeList[1].payType === data.currentPayType"
                            />
                        </template>
                    </uni-list-item>
                    <uni-list-item
                        v-if="
                            data.mchInfo?.payMethod?.wechatPay &&
                            (currentBrowser.indexOf('micromessenger') > -1 || currentBrowser === 'miniprogram')
                        "
                        clickable
                        :title="payTypeList[2].payName"
                        :thumb="payTypeList[2].icon"
                        thumb-size="sm"
                        class="pay-type-item"
                        @click="selectPayType(payTypeList[2].payType)"
                    >
                        <template #footer>
                            <radio
                                class="right-radio"
                                :value="payTypeList[2].payType"
                                :checked="payTypeList[2].payType === data.currentPayType"
                            />
                        </template>
                    </uni-list-item>
                    <uni-list-item
                        v-if="
                            (data.mchInfo?.payMethod?.unionPay || data.mchInfo?.payMethod?.unionPayProxy) &&
                            currentBrowser === 'ysf'
                        "
                        clickable
                        :title="payTypeList[3].payName"
                        :thumb="payTypeList[3].icon"
                        thumb-size="sm"
                        class="pay-type-item"
                        @click="selectPayType(payTypeList[3].payType)"
                    >
                        <template #footer>
                            <radio
                                class="right-radio"
                                :value="payTypeList[3].payType"
                                :checked="payTypeList[3].payType === data.currentPayType"
                            />
                        </template>
                    </uni-list-item>
                </uni-list>
                <view
                    v-if="(data.isHaveIntegral && data.currentPayType === 'quickPay') || data.isHaveKnockActivity"
                    class="back-gray"
                />
                <uni-list>
                    <uni-list-item
                        v-if="data.isHaveIntegral && data.currentPayType === 'quickPay'"
                        :thumb="iconIntegral"
                        title="积分"
                        thumb-size="sm"
                    >
                        <template #body>
                            <view class="slot-box" @click="showToast('积分与优惠不可叠加')">
                                <view class="title-color font-size-30" style="margin-top: 4rpx">积分</view>
                                <view class="slot-box-img"><image :src="helpLogo" /> </view>
                            </view>
                        </template>
                        <template #footer>
                            <view @click="selectCouponType('1')">
                                <text
                                    v-if="
                                        Money.yuanChangeFen(data.money || 0) >=
                                        Number(data.couponData.integralThreshold || 0)
                                    "
                                    class="yellow-color font-size-24"
                                >
                                    {{
                                        integralMoney(data.couponData) * (data.couponData?.integralPrice || 0)
                                    }}积分抵扣¥{{ Money.fenChangeYuan(integralMoney(data.couponData)) }}
                                </text>
                                <text
                                    v-else-if="
                                        Money.yuanChangeFen(data.money || 0) <
                                        Number(data.couponData.integralThreshold || 0)
                                    "
                                    class="yellow-color font-size-24"
                                    >单笔订单需满足{{
                                        Money.fenChangeYuan(data.couponData.integralThreshold || 0)
                                    }}元才可使用积分抵扣
                                </text>
                                <radio
                                    class="right-radio"
                                    :disabled="
                                        Money.yuanChangeFen(data.money || 0) <
                                        Number(data.couponData.integralThreshold || 0)
                                    "
                                    value="1"
                                    :checked="'1' === data.currentCouponType"
                                />
                            </view>
                        </template>
                    </uni-list-item>
                    <uni-list-item
                        v-if="
                            BANK_CODE === 'cdrcb'
                                ? data.mchInfo.thirdPayUseInterests && data.isHaveKnockActivity
                                : data.isHaveKnockActivity
                        "
                        :thumb="iconDiscount"
                        thumb-size="sm"
                        show-switch
                    >
                        <template #body>
                            <view class="slot-box">
                                <view class="title-color" style="margin-top: 4rpx">优惠</view>
                                <view
                                    v-if="data.knockActivityObj?.couponName"
                                    class="discount-block gray-block coupon-block"
                                    @click="selectCouponClick('open', 'coupon')"
                                >
                                    <view class="flex">
                                        <view> {{ data.knockActivityObj?.couponName }} </view>
                                        <view>
                                            <uni-icons type="bottom" />
                                        </view>
                                    </view>
                                </view>
                                <view
                                    v-if="
                                        !data.knockActivityObj?.couponName &&
                                        data.couponData?.knockActivityLists?.length
                                    "
                                    class="discount-block gray-block coupon-block"
                                    @click="selectCouponClick('open', 'coupon')"
                                >
                                    <view class="flex">
                                        <view> 查看优惠 </view>
                                        <view>
                                            <uni-icons type="bottom" />
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <template #footer>
                            <view v-if="data.knockActivityObj?.couponName" @click="selectCouponType('2')">
                                <text class="yellow-color font-size-24">
                                    <!-- 减¥{{ Money.fenChangeYuan(data.knockActivityObj.preferentialAmount) }} -->
                                    {{
                                        data.knockActivityObj.preferentialType == '1'
                                            ? '减¥' + Money.fenChangeYuan(data.knockActivityObj.preferentialAmount)
                                            : data.knockActivityObj.preferentialType == '3'
                                            ? (data.knockActivityObj.preferentialAmount || 0) * 10 + '折'
                                            : ''
                                    }}
                                </text>
                                <radio class="right-radio" value="2" :checked="'2' === data.currentCouponType" />
                            </view>
                            <text v-else class="desc-color font-size-24">暂无优惠</text>
                        </template>
                    </uni-list-item>
                </uni-list>
            </view>
            <view class="dialog-footer dialog-footer-flex">
                <view class="dialog-footer-item title-color red-color">
                    <view>
                        <view class="text-right now-rap">
                            <text class="title-color money-desc font-size-24">实际支付</text>¥<text
                                class="money-text"
                                >{{
                                    Money.thousandFormat(
                                        Money.fenChangeYuan(
                                            Numeral.sub(Money.yuanChangeFen(data.money), data.couponMoney, 0)
                                        )
                                    )
                                }}</text
                            >
                        </view>
                        <view v-if="data.couponMoney" class="red-color text-right font-size-24">
                            共优惠¥{{ Money.thousandFormat(Money.fenChangeYuan(data.couponMoney)) }}
                        </view>
                    </view>
                </view>
                <view class="dialog-footer-item" @click="remarkInputConfirm">
                    <button class="footer-item-btn" @click="handleSubmit">确认支付</button>
                </view>
            </view>
        </view>
    </uni-popup>
    <uni-popup :ref="couponSelectDialog" type="bottom">
        <view class="pay-type-dialog">
            <view class="dialog-header text-center">
                {{ data.bankOrCoupon === 'coupon' ? '选择优惠券' : '选择银行卡' }}
                <view class="dialog-header-back" @click="closeCouponOrBank">
                    <uni-icons color="#CCCCCC" type="back" size="20" />
                </view>
            </view>
            <view class="dialog-content" style="min-height: 400rpx">
                <uni-list v-if="data.bankOrCoupon === 'coupon'">
                    <uni-list-item
                        v-for="item in data.couponData.knockActivityLists"
                        :key="item.couponId"
                        :clickable="Money.yuanChangeFen(data.money) >= (item.discountLimit || item.couponMinAmount)"
                        :thumb="iconIntegral"
                        thumb-size="sm"
                        :title="item.couponName"
                        @click="selectCouponItemClick(item)"
                    >
                        <template #footer
                            ><radio
                                class="right-radio"
                                :disabled="
                                    Money.yuanChangeFen(data.money) < (item.discountLimit || item.couponMinAmount)
                                "
                                :value="item.couponId"
                                :checked="item.couponId == data.currentCouponObj.couponId"
                            />
                        </template>
                    </uni-list-item>
                    <uni-list-item clickable title="不使用" @click="selectCouponItemClick({})">
                        <template #footer
                            ><radio class="right-radio" value="0" :checked="'0' === data.currentCouponType" />
                        </template>
                    </uni-list-item>
                </uni-list>
                <uni-list v-else>
                    <uni-list-item
                        v-for="item in data.cardList"
                        :key="item.cardLastFour"
                        clickable
                        :thumb="currentBank.logo"
                        thumb-size="sm"
                        :title="
                            item.bankName +
                            (item.bankCardType == '1' ? '借记卡' : '贷记卡') +
                            ' ( ' +
                            item.cardLastFour +
                            ' )'
                        "
                        @click="selectBankItemClick(item)"
                    >
                        <template #footer
                            ><radio
                                class="right-radio"
                                :value="item.cardLastFour"
                                :checked="item.cardLastFour == data.currentSelectBank.cardLastFour"
                            />
                        </template>
                    </uni-list-item>
                    <uni-list-item
                        :thumb="iconAdd"
                        thumb-size="sm"
                        title="添加银行卡"
                        clickable
                        @click="skipBindCardPage"
                    />
                </uni-list>
            </view>
        </view>
    </uni-popup>

    <uni-popup :ref="alertDialog" type="dialog">
        <uni-popup-dialog
            class="warning-dialog"
            type="info"
            :cancel-text="data.alertDialogObj.cancelText"
            :confirm-text="data.alertDialogObj.confirmText"
            :title="data.alertDialogObj.title"
            :content="data.alertDialogObj.content"
            @confirm="alertDialogToggle('close', data.alertDialogObj.type)"
            @close="alertDialogToggle('close', '')"
        />
    </uni-popup>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { Money } from '../../utils/MoneyUtils';
import { Numeral } from '../../utils/NumeralUtils';
import {
    queryMchInfo,
    placeOrderPay,
    queryBindCardInfo,
    queryInterestsInfo,
    orderDetail,
    isAbroadByIp,
} from '../../services/payment/payment';
// #ifdef QSBANK
import { queryBankAccountInfo } from '../../services/payment/payment';
// #endif
import { payTypeListType, dataType, cardListType, knockActivityListType } from '../../services/payment/type';
import { requestLogin, getLoginCache } from '../../services/payment/login';
import closeImg from '../../assets/images/payment/close.png';
import iconAlipay from '../../assets/images/payment/icon_alipay.png';
import iconYsf from '../../assets/images/payment/icon_ysf.png';
import iconHua from '../../assets/images/payment/icon_hua.png';
import iconWechat from '../../assets/images/payment/icon_wechat.png';
import iconIntegral from '../../assets/images/payment/icon_integral.png';
import iconDiscount from '../../assets/images/payment/icon_discount.png';
import iconAdd from '../../assets/images/payment/icon_add.png';
import Keyboard from '../../components/keyboard.vue';
// #ifdef CDRCB
import cdrcbTopBg from '../../assets/images/payment/cdrcb_bg.png';
import iconQuick from '../../assets/images/payment/icon_quick.png';
// #endif
// #ifdef STANDARD
import defaultTopBg from '../../assets/images/payment/default_mch__logo.png';
import iconQuickDefault from '../../assets/images/payment/icon_quick_default.png';
// #endif
// #ifdef QSBANK
import qsbankTopBg from '../../assets/images/payment/qsbank_mch__logo.png';
import iconQuickQsbank from '../../assets/images/payment/icon_quick_qsbank.png';
// #endif
// #ifdef TAIZHOU
import taiZhouTopBg from '../../assets/images/payment/taizhou/merchant.png';
import iconQuickTaiZhou from '../../assets/images/payment/icon_quick_default.png';
import adImg from '../../assets/images/payment/taizhou/ad-img.png';
// #endif
import helpLogo from '../../assets/images/payment/help.png';
import { getWhichBrowser, getQueryString, getUrlParam, getSignSource } from '../../utils/GlobalUtils';
// #ifdef H5
import { adjustWeixinFont } from '../../utils/MainUtils';
// #endif
// #ifdef MP-WEIXIN
import Config from '../../../config/config';
// #endif

// #ifdef H5
adjustWeixinFont();
// #endif
let signSource = 1, //默认为微信 1、微信 2、支付宝 3、云闪付
    appid;
const currentBrowser = getWhichBrowser();
// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
appid = accountInfo?.miniProgram?.appId;
// #endif
// #ifdef H5
signSource = getSignSource();
appid = getLoginCache('APPID');
// #endif
// console.log(uni.getSystemInfoSync());
const bankNameObj = {
    // #ifdef CDRCB
    cdrcb: {
        name: '成都农商行',
        logo: iconQuick,
        productName: '蓉e支付',
        topBg: cdrcbTopBg,
    },
    // #endif
    // #ifdef STANDARD
    standard: {
        name: '银行卡',
        logo: iconQuickDefault,
        productName: '快捷支付',
        topBg: defaultTopBg,
    },
    // #endif
    // #ifdef QSBANK
    qsbank: {
        name: '银行卡',
        logo: iconQuickQsbank,
        productName: '齐商聚财',
        topBg: qsbankTopBg,
    },
    // #endif
    // #ifdef TAIZHOU
    taizhou: {
        name: '银行卡',
        logo: iconQuickTaiZhou,
        productName: '快捷支付',
        topBg: taiZhouTopBg,
    },
    // #endif
};

const BANK_CODE: any = process.env.BANK_CODE;
const currentBank = bankNameObj[BANK_CODE || {}];
//登录失效重新请求次数
let redirectNum = 0;

let timer: any = null;

const payTypeList: payTypeListType[] = [
    {
        payType: 'quickPay',
        icon: currentBank.logo,
        payName: '快捷支付',
    },
    {
        payType: 'aliPay',
        icon: iconAlipay,
        payName: '支付宝',
    },
    {
        payType: 'wechatPay',
        icon: iconWechat,
        payName: '微信',
    },
    {
        payType: 'unionPay',
        icon: iconYsf,
        payName: '云闪付',
    },
    {
        payType: 'huaBei',
        icon: iconHua,
        payName: '花呗支付',
    },
];

const data: dataType = reactive({
    //带订单的支付限时倒计时
    countDownTime: '',
    //取后端倒计时时间
    remainingTime: 15 * 60,
    //固定金额
    fixedMoney: '',
    //输入金额，单位元
    money: '',
    //优惠金额
    couponMoney: 0,
    string: '',
    canInput: false,
    inputRemark: '',
    qrId: '',
    nativeQrId: '',
    remark: '',
    cardList: [],
    currentPayType: '',
    currentCouponType: '',
    knockActivityObj: {},
    currentSelectBank: {},
    bankOrCoupon: '',
    outTradeNo: '',
    currentCouponObj: {
        // couponType: '0', // 1 满减 2 积分 3随机立减 4卡券
    },
    isHaveIntegral: false,
    isHaveKnockActivity: false,
    isClickConfirm: false,
    isBankDialog: false,
    couponData: {},
    hbSelected: [],
    mchInfo: {
        adUrl: '',
        mchName: '', //商户名称
        qrRemarkSwitch: '0', // 0不需要填写备注 1备注必填
        mchId: '',
        userId: '',
        abroadTradeFlag: '',
        payMethod: {
            aliPayJsPay: false,
            aliPayNative: false,
            huaBei: false,
            quickPay: false,
            wechatPay: false,
            unionPay: false,
        },
    },
    isRiskTrade: false,
    alertDialogObj: {
        cancelText: '取消',
        confirmText: '确定',
        title: '温馨提示！',
        content: '',
        type: '',
    },
    // #ifdef TAIZHOU
    bankAppConfig: {},
    // #endif
});
let remarkInputDialogRef: any = {},
    couponSelectDialogRef: any = {},
    alertDialogRef: any = {},
    payTypeDialogRef: any = {}; //备注弹框Refs
const remarkInputDialog = (el) => {
    remarkInputDialogRef = el;
};
const payTypeDialog = (el) => {
    payTypeDialogRef = el;
};
const couponSelectDialog = (el) => {
    couponSelectDialogRef = el;
};
const alertDialog = (el) => {
    alertDialogRef = el;
};

const showToast = (title) => {
    uni.showToast({
        icon: 'none',
        title,
        duration: 2500,
    });
};

/**
 * 弹出填写备注对话框
 */
const remarkDialogToggle = (type: string) => {
    remarkInputDialogRef[type]();
};

/**
 * 弹出选择支付方式对话框
 */
const payTypeDialogToggle = (type: string) => {
    payTypeDialogRef[type]();
};
/**
 * 弹出优惠券对话框
 */
const couponSelectDialogToggle = (type: string) => {
    couponSelectDialogRef[type]();
};

/**
 * 跳转至绑卡列表
 */
const skipBindCardPage = () => {
    // #ifdef QSBANK
    queryBankAccountInfo({
        thirdUserId: getLoginCache('OPENID'),
        appid: appid || getLoginCache('APPID'),
        mchId: data.mchInfo.mchId,
        signSource,
    }).then((res) => {
        console.log('银行卡信息=====');
        console.log(res);
        if (res?.result === '200') {
            if (res?.message?.data?.length > 0) {
                uni.navigateTo({
                    url: '/pages/payment/add-card?mchId=' + data.mchInfo.mchId + '&signSource=' + signSource,
                });
            } else {
                uni.showToast({
                    title: '没有可用的银行卡',
                    icon: 'none',
                    duration: 2500,
                });
            }
        }
    });
    // #endif

    // #ifndef QSBANK
    uni.navigateTo({
        url: '/pages/payment/add-card?mchId=' + data.mchInfo.mchId + '&signSource=' + signSource,
    });
    // #endif
};

/**
 * 各类弹框
 */
const alertDialogToggle = (type: string, event: string) => {
    alertDialogRef[type]();
    if (event === 'bindCard') {
        if (type === 'close') skipBindCardPage();
        else {
            data.alertDialogObj = {
                ...data.alertDialogObj,
                content: '您还未绑卡，请先绑卡!',
                confirmText: '去绑卡',
                type: event,
            };
        }
    } else if (event === 'tradeFlag2') {
        if (type === 'close') {
            // eslint-disable-next-line no-use-before-define
            confirmPay();
        } else {
            data.alertDialogObj = {
                ...data.alertDialogObj,
                content: '本次交易存在地域风险，为保障您的资金安全，请仔细确认商户身份信息。',
                confirmText: '继续支付',
                cancelText: '取消支付',
                type: event,
            };
        }
    } else {
        data.alertDialogObj = {
            ...data.alertDialogObj,
            content: '',
            confirmText: '确认',
            cancelText: '取消',
            type: '',
        };
    }
};

/**
 * 选择优惠券
 */
const selectCouponClick = (type: string, dialogType: string) => {
    couponSelectDialogToggle(type);
    payTypeDialogToggle(type === 'open' ? 'close' : 'open');
    data.bankOrCoupon = dialogType;
};

/**
 * 选择银行卡
 */
const selectBankItemClick = (item: cardListType) => {
    data.currentSelectBank = item;
    couponSelectDialogToggle('close');
    payTypeDialogToggle('open');
};

/**
 * 选择支付方式
 */
const selectPayType = (type) => {
    if (type === 'quickPay' && !data.cardList?.length) return;
    if (type !== 'quickPay' && data.currentCouponType === '1' && BANK_CODE === 'cdrcb') {
        data.currentCouponType = '0';
        data.currentCouponObj = {
            couponType: '0',
        };
        data.couponMoney = 0;
    }
    data.currentPayType = type;
};

/**
 * 取最近的偶数
 */
const nextEvenNumbers = (num) => {
    const numInt = Math.floor(num),
        isEven = numInt % 2 > 0 ? false : true;
    return isEven ? numInt : Math.ceil(num);
};

/**
 * 花呗分期根据实际支付金额计算
 */
const computerHuabei = () => {
    //实际支付金额
    const actualAmount = Numeral.sub(Money.yuanChangeFen(data.money), data.couponMoney, 0);
    // console.log('实际支付金额====' + actualAmount);
    if (
        actualAmount < (data.mchInfo?.hbPayParamMap?.moneyLimit || 10000) ||
        currentBrowser !== 'aliapp' ||
        !data.mchInfo.payMethod?.huaBei
    ) {
        // console.log('判断没通过');
        return;
    }

    const hbSelectedList = data.hbSelected;
    const result: any = [];
    hbSelectedList.forEach((item) => {
        const feeMoney = Numeral.mul(actualAmount, item.feeRate, 0),
            eachFee = nextEvenNumbers(feeMoney / item.stageNum),
            totalMoney = Numeral.add(actualAmount, feeMoney, 0);
        result.push({
            ...item,
            //每期多少钱
            eachAmount: Math.floor(totalMoney / item.stageNum),
            //每期手续费多少钱
            eachFeeAmount: eachFee,
            //总支付金额
            totalFee: feeMoney,
        });
    });
    data.hbSelected = result;
};
/**
 * 计算立减、折扣活动列表
 */
const knockActivityMoney = (queryNum) => {
    const inputMoney = Money.yuanChangeFen(data.money),
        knockActivityLists = data.couponData.knockActivityLists || [];
    let maxMoney = 0,
        maxCouponObj;

    knockActivityLists.forEach((item: knockActivityListType) => {
        if (
            (item.preferentialType == '1' || item.preferentialType == '3') &&
            inputMoney >= (item?.discountLimit || item?.couponMinAmount)
        ) {
            //满减且输入金额大于等于优惠门槛
            if (item.preferentialType == '1' && maxMoney < item?.preferentialAmount) {
                maxMoney = item.preferentialAmount;
                maxCouponObj = { ...item };
            }
            //折扣且输入金额大于等于优惠门槛
            if (item.preferentialType == '3') {
                //计算折扣优惠金额
                let discountCouponMoney = nextEvenNumbers(
                    Numeral.mul(inputMoney, Numeral.sub(1, item?.preferentialAmount, 3), 2)
                );
                //当最大优惠金额存在时
                discountCouponMoney =
                    item.onceAmountLimit && discountCouponMoney > item.onceAmountLimit
                        ? item.onceAmountLimit
                        : discountCouponMoney;
                if (maxMoney < discountCouponMoney) {
                    maxMoney = discountCouponMoney;
                    maxCouponObj = { ...item };
                }
            }
        }

        //随机立减
        if (
            queryNum === 2 &&
            item.preferentialType == '2' &&
            maxMoney === 0 &&
            inputMoney >= (item?.discountLimit || item?.couponMinAmount)
        ) {
            maxCouponObj = { ...item };
        }
    });
    if (!maxCouponObj && queryNum === 1) return knockActivityMoney(2);
    data.knockActivityObj = {
        ...maxCouponObj,
    };
    return maxCouponObj;
};
/**
 * 计算最大优惠
 */
const computerMaxCoupon = (couponData, integralMoneyNum) => {
    let maxMoney = integralMoneyNum,
        maxCouponObj;
    const knockActivityMoneyObj = knockActivityMoney(1);
    if (
        knockActivityMoneyObj &&
        knockActivityMoneyObj?.preferentialAmount > maxMoney &&
        (BANK_CODE === 'cdrcb' ? data.mchInfo.thirdPayUseInterests : true)
    ) {
        maxCouponObj = knockActivityMoneyObj;
    }
    const inputMoney = Money.yuanChangeFen(data.money);
    if (maxCouponObj) {
        data.currentCouponType = '2';
        data.currentCouponObj = {
            // 成都农商行上送的"优惠种类", -- 1 满减 2 积分 3随机立减 4卡券  4.0上送的优惠种类  1、满减 2、随机立减 3、折扣 与查询一致
            couponType: BANK_CODE === 'cdrcb' ? '1' : maxCouponObj.preferentialType,
            couponId: maxCouponObj.couponId,
            customerNo: couponData.customerNo,
            discountTitle: maxCouponObj.discountTitle,
            couponName: maxCouponObj.couponName,
        };
        if (maxCouponObj.preferentialType === '1') data.couponMoney = maxCouponObj.preferentialAmount;
        else if (maxCouponObj.preferentialType === '3') {
            //计算折扣优惠金额
            let discountCouponMoney = nextEvenNumbers(
                Numeral.mul(inputMoney, Numeral.sub(1, maxCouponObj?.preferentialAmount, 3), 2)
            );
            //当最大优惠金额存在时
            discountCouponMoney =
                maxCouponObj.onceAmountLimit && discountCouponMoney > maxCouponObj.onceAmountLimit
                    ? maxCouponObj.onceAmountLimit
                    : discountCouponMoney;
            data.couponMoney = discountCouponMoney;
        }
    } else {
        //没有满减活动且有积分活动时,只有成都农商行有
        if (integralMoneyNum > 0) {
            data.currentCouponType = '1';
            data.currentCouponObj = {
                couponType: '2',
                costBonus: integralMoneyNum * couponData.integralPrice, //核销积分数
                customerNo: couponData.customerNo,
            };
            data.couponMoney = integralMoneyNum;
        } else {
            data.currentCouponType = '0';
            data.currentCouponObj = {
                couponType: '0',
            };
            data.couponMoney = 0;
        }
    }
};

/**
 * 计算积分优惠金额
 */
const integralMoney = (couponData) => {
    const integralPrice = couponData.integralPrice,
        verificationNum = couponData.verificationNum,
        inputMoney = Money.yuanChangeFen(data.money) || 0;
    return inputMoney > Math.floor(verificationNum / integralPrice)
        ? Math.floor(verificationNum / integralPrice)
        : inputMoney;
};

/**
 * 判断是否有优惠权益
 */
const judgeCoupon = () => {
    const couponData = data.couponData || {},
        inputMoney = Money.yuanChangeFen(data.money) || 0;
    let integralMoneyNum = 0;
    if (data.currentPayType === 'quickPay' && couponData.integralThreshold && Number(couponData.verificationNum || 0)) {
        data.isHaveIntegral = true; //是否有积分优惠
        //输入金额大于等积分门槛
        if (inputMoney >= Number(couponData.integralThreshold || 0)) {
            //积分优惠金额最高不超过输入金额
            integralMoneyNum = integralMoney(couponData);
        }
    }
    if (couponData?.knockActivityLists?.length && (BANK_CODE === 'cdrcb' ? data.mchInfo.thirdPayUseInterests : true)) {
        data.isHaveKnockActivity = true; //是否有优惠
    }
    computerMaxCoupon(couponData, integralMoneyNum);
};

/**
 * 选择优惠选项
 */
const selectCouponItemClick = (item) => {
    const inputMoney = Money.yuanChangeFen(data.money);
    // console.log('-=====');
    // console.log(item);
    if (item.couponId) {
        data.currentCouponType = '2';
        data.knockActivityObj = {
            ...item,
        };
        data.currentCouponObj = {
            // 成都农商行上送的"优惠种类", -- 1 满减 2 积分 3随机立减 4卡券  4.0上送的优惠种类  1、满减 2、随机立减 3、折扣 与查询一致
            couponType: BANK_CODE === 'cdrcb' ? (item.preferentialType == '1' ? '1' : '3') : item.preferentialType,
            couponId: item.couponId,
            customerNo: data.couponData.customerNo,
            discountTitle: item.discountTitle,
            couponName: item.couponName,
        };
        //选择优惠
        if (item.preferentialType === '1') data.couponMoney = item.preferentialAmount;
        //选择折扣
        else if (item.preferentialType === '3') {
            //计算折扣优惠金额
            let discountCouponMoney = nextEvenNumbers(
                Numeral.mul(inputMoney, Numeral.sub(1, item?.preferentialAmount, 3), 2)
            );
            //当最大优惠金额存在时
            discountCouponMoney =
                item.onceAmountLimit && discountCouponMoney > item.onceAmountLimit
                    ? item.onceAmountLimit
                    : discountCouponMoney;
            data.couponMoney = discountCouponMoney;
        } else data.couponMoney = 0;
    } else {
        if (data.currentCouponType === '2') {
            data.currentCouponType = '0';
            data.currentCouponObj = {
                couponType: '0',
            };
        }
        data.couponMoney = 0;
    }
    if (BANK_CODE === 'cdrcb') judgeCoupon();
    couponSelectDialogToggle('close');
    payTypeDialogToggle('open');
};

/**
 * 关闭优惠或者银行卡选择
 */
const closeCouponOrBank = () => {
    couponSelectDialogToggle('close');
    payTypeDialogToggle('open');
};

/**
 * 选择优惠类型
 */
const selectCouponType = (type) => {
    // console.log('类型====');
    // console.log(type);
    if (type === '1' && Money.yuanChangeFen(data.money || 0) < Number(data.couponData.integralThreshold || 0)) {
        showToast('当前交易金额不满足积分抵扣');
        return;
    }
    if (data.currentCouponType === type) {
        data.currentCouponType = '';
        data.currentCouponObj = {
            couponType: '0',
        };
        data.couponMoney = 0;
        return;
    } else data.currentCouponType = type;
    const couponData = data.couponData,
        integralMoneyNum = integralMoney(data.couponData),
        inputMoney = Money.yuanChangeFen(data.money);
    if (type === '1') {
        //积分优惠只有成都农商行有
        data.currentCouponObj = {
            couponType: '2', //"优惠种类", -- 1 满减 2 积分 3随机立减 4卡券
            costBonus: integralMoneyNum * (couponData.integralPrice || 0), //核销积分数
            customerNo: couponData.customerNo, //客户号
        };
        data.couponMoney = integralMoneyNum;
    } else {
        const knockActivityObj = data.knockActivityObj;
        data.currentCouponObj = {
            // 成都农商行上送的"优惠种类", -- 1 满减 2 积分 3随机立减 4卡券  4.0上送的优惠种类  1、满减 2、随机立减 3、折扣 与查询一致
            couponType:
                BANK_CODE === 'cdrcb'
                    ? knockActivityObj?.preferentialType === '1'
                        ? '1'
                        : '3'
                    : knockActivityObj.preferentialType,
            //活动编号
            couponId: knockActivityObj?.couponId,
            //客户号
            customerNo: couponData.customerNo,
            discountTitle: knockActivityObj?.discountTitle,
            couponName: knockActivityObj.couponName,
        };
        //选择优惠
        if (knockActivityObj.preferentialType === '1') data.couponMoney = knockActivityObj.preferentialAmount || 0;
        //选择折扣
        else if (knockActivityObj.preferentialType === '3') {
            //计算折扣优惠金额
            let discountCouponMoney = nextEvenNumbers(
                Numeral.mul(inputMoney, Numeral.sub(1, knockActivityObj?.preferentialAmount, 3), 2)
            );
            //当最大优惠金额存在时
            discountCouponMoney =
                knockActivityObj.onceAmountLimit && discountCouponMoney > knockActivityObj.onceAmountLimit
                    ? knockActivityObj.onceAmountLimit
                    : discountCouponMoney;
            data.couponMoney = discountCouponMoney;
        } else data.couponMoney = 0;
    }
};

/**
 * 查询优惠信息
 */
const queryInterestsInfoRequest = async (payType) => {
    const res = await queryInterestsInfo({
        thirdUserId: getLoginCache('OPENID'),
        appid: appid || getLoginCache('APPID'),
        // #ifdef  STANDARD
        externalDevType: payType === 'quick' ? '22' : signSource,
        // #endif
        // #ifdef  CDRCB
        payType: payType,
        // #endif
        mchId: data.mchInfo.mchId,
    });
    if (res?.result === '200') {
        console.log(res.message);
        data.couponData = res.message;
        return res;
    } else {
        throw new Error(res.message);
    }
};

/**
 * 查询绑卡列表
 */
const queryBindCardInfoRequest = async (type) => {
    if (!data.mchInfo.mchId) return;
    const res = await queryBindCardInfo({
        thirdUserId: getLoginCache('OPENID'),
        appid: appid || getLoginCache('APPID'),
        mchId: data.mchInfo.mchId,
        signSource,
    });
    if (res?.result === '200') {
        const cardList = res.message?.data || [];
        data.cardList = cardList;
        if (data.nativeQrId) {
            // eslint-disable-next-line no-use-before-define
            confirmPay();
        }

        if (cardList?.length) {
            data.currentSelectBank = cardList[0];
            if (type === 'bindCardFinish') {
                queryInterestsInfoRequest('quickPay');
            }
        }
    }
};

const showOvertimeDialog = () => {
    uni.showModal({
        title: '支付超时',
        content: '订单已取消，请重新下单',
        showCancel: false,
        confirmText: '知道了',
        success: function () {
            // #ifdef MP-WEIXIN
            wx.exitMiniProgram &&
                wx.exitMiniProgram({
                    success: function () {
                        console.log('退出小程序成功');
                    },
                });
            // #endif
            // #ifdef H5
            // #ifdef QSBANK
            data.mchInfo?.callbackUrl && window.location.replace(data.mchInfo?.callbackUrl);
            // #endif
            // #endif
        },
    });
};

/**
 * 支付倒计时
 */
const payCountDown = (timeNum) => {
    let countDownTime = Number(timeNum || 15 * 60);
    timer = setInterval(() => {
        if (countDownTime >= 60) {
            const minute = Math.floor(countDownTime / 60),
                second = countDownTime % 60;
            data.countDownTime = (minute >= 10 ? minute : '0' + minute) + ':' + (second >= 10 ? second : '0' + second);
            countDownTime = countDownTime - 1;
        } else if (countDownTime > 0) {
            data.countDownTime = '00:' + (countDownTime >= 10 ? countDownTime : '0' + countDownTime);
            countDownTime = countDownTime - 1;
        } else {
            data.countDownTime = '00:00';
            timer && clearInterval(timer);
            showOvertimeDialog();
        }
    }, 1000);
};

/**
 * 风险交易弹框
 */
const riskShowModal = () => {
    if (data.isRiskTrade) {
        if (data.mchInfo.abroadTradeFlag == '2') {
            alertDialogToggle('open', 'tradeFlag' + data.mchInfo.abroadTradeFlag);
            return true;
        } else if (data.mchInfo.abroadTradeFlag == '3') {
            uni.showModal({
                title: '温馨提示！',
                content: '本次交易存在地域风险，暂不能支付。为保障您的资金安全，请仔细确认商户信息。',
                showCancel: false,
                confirmText: '确认退出',
                success: function () {
                    // #ifdef MP-WEIXIN
                    wx.exitMiniProgram &&
                        wx.exitMiniProgram({
                            success: function () {
                                console.log('退出小程序成功');
                            },
                        });
                    // #endif
                },
            });
            return true;
        }
    }
    return false;
};

/**
 * 地址围栏，查询前端是否需要拦截
 */
const isAbroadByIpRequest = async () => {
    if (data.mchInfo.abroadTradeFlag != '2' && data.mchInfo.abroadTradeFlag != '3') return;
    const res = await isAbroadByIp({
        mchId: data.mchInfo?.mchId,
    });
    if (res?.result === '200' || res?.status === '200') {
        data.isRiskTrade = res.message.isAbroad;
    }
};

/**
 * 对象转为数组，并按对象属性从小到大排序
 */
const objectChangeArrayOrder = (obj) => {
    const result: any = [];
    obj &&
        Object.keys(obj).forEach((item) => {
            result.push({
                stageNum: Number(item),
                feeRate: obj[item],
            });
        });
    return result.sort((a, b) => a.stageNum - b.stageNum);
};

/**
 * 查询商户信息
 */
const queryMchInfoApi = async (params: { qrId?: string; mchId?: string; nativeQrId?: string }) => {
    try {
        await requestLogin();
        const qrId = params?.qrId || params?.nativeQrId;
        let res = await queryMchInfo({
            ...params,
            qrId,
            mchId: qrId ? undefined : params?.mchId,
            browserType: currentBrowser,
        });
        // console.log(res);
        console.log('查询商户详情：' + res);
        if (res?.result === '200') {
            data.canInput = true;
            //扫空码
            if (res.message?.useStatus == 1) {
                const webUrl = encodeURIComponent(res.message?.mchRegistUrl || '');
                // #ifdef MP-WEIXIN
                uni.redirectTo({
                    url: '/pages/common/web?url=' + webUrl,
                });
                // #endif
                // #ifdef H5
                window.location.href = webUrl;
                // #endif
                return;
            }
            data.mchInfo = res.message;
            
            console.log(data.mchInfo, 'data.mchInfo');
            // data.mchInfo.payMethod.quickPay = false;
            // console.log(res.message);
            if (params?.nativeQrId && res.message?.money) {
                //兼容正扫场景
                data.fixedMoney = res.message.money;
                data.money = Money.fenChangeYuan(res.message.money) + '';
                data.outTradeNo = res.message?.outTradeNo;
                payCountDown(res.message?.timeRemaining);
            }
            // 地址围栏，查询前端是否需要拦截
            isAbroadByIpRequest();
            //如果商家支持快捷支付，请求卡列表
            if (res.message?.payMethod?.quickPay) {
                await queryBindCardInfoRequest('');
            } else {
                if (params?.nativeQrId && res.message?.money) {
                    // eslint-disable-next-line no-use-before-define
                    confirmPay();
                }
            }
            if (res.message?.payMethod?.huaBei) {
                const rateStr = res.message?.hbPayParamMap?.rate || '{}';
                let rate = {};
                if (/\{/.test(rateStr)) {
                    rate = JSON.parse(rateStr);
                }
                data.hbSelected = objectChangeArrayOrder(rate);
            }
            // #ifdef CDRCB
            if (!data.nativeQrId) await queryInterestsInfoRequest('quickPay');
            // #endif

            // #ifdef MP-WEIXIN
            // 广告 插件预加载
            // swfad插件开了才预加载，否则会报错
            if (Config?.adParams?.swfad) {
                const plugin: any = requirePlugin('swfAdvPlugin');
                const preParams = {
                    bakDistributionId: res.message.payAcceptOrg, // 必填，授理机构号
                    distributionId: res.message.distributionId, // 非必填，渠道号
                    mchId: res.message.mchId, // 非必填，商户号
                };
                plugin?.preloadAd(preParams);
            }
            // #endif
        } else {
            if (res.retcode === '306' || res.retcode === '206') {
                // eslint-disable-next-line no-use-before-define
                againloginRequest(params);
            }
        }
    } catch (error: any) {
        if (error?.message?.includes('login:fail')) {
            // eslint-disable-next-line no-use-before-define
            againloginRequest(params);
        }
    }
};

const againloginRequest = (params: { qrId?: string; mchId?: string; nativeQrId?: string }) => {
    // #ifdef MP-WEIXIN
    if (redirectNum >= 2) {
        return uni.showModal({
            title: '温馨提示！',
            content: '请退出小程序重新扫码或重试',
            cancelText: '退出',
            confirmText: '重试',
            success(res) {
                if (res.confirm) {
                    redirectNum = redirectNum + 1;
                    queryMchInfoApi(params);
                } else if (res.cancel) {
                    wx.exitMiniProgram &&
                        wx.exitMiniProgram({
                            success: function () {
                                console.log('退出小程序成功');
                            },
                        });
                }
            },
        });
    } else if (redirectNum < 2) {
        //如果重调过一次queryMchInfoApi，就无需再调，以免陷入无限循环中
        setTimeout(() => {
            redirectNum = redirectNum + 1;
            //移除登录态后重定向一次
            queryMchInfoApi(params);
        }, 300);
    }
    // #endif
    // #ifdef H5
    // uni.showModal({
    //     title: '温馨提示！',
    //     content: '请退出重新扫码或重试',
    //     confirmText: '重试',
    //     showCancel: false,
    //     success(res) {
    //         if (res.confirm) {
    //             window.location.reload();
    //         }
    //     },
    // });
    // #endif
};

/**
 * 键盘输入事件
 */
const keyboardInput = (val) => {
    const { fixedMoney } = data;
    if (fixedMoney) return;
    if (!data.mchInfo?.mchId) {
        return;
    }
    data.money = val;
    //重新输入时把所选优惠置空
    if (data.currentCouponType === '2') {
        data.currentCouponType = '0';
        data.currentCouponObj = {
            couponType: '0',
        };
    }
    data.couponMoney = 0;
};

/**
 * 判断支持多少种支付方式
 */
const judgeManyPayType = () => {
    const payMethod = data.mchInfo?.payMethod || {};
    let manyPayType = 0,
        payTypeString = '';
    Object.keys(payMethod).forEach((key) => {
        if (payMethod[key]) {
            if (
                currentBrowser === 'aliapp' &&
                key === 'huaBei' &&
                Money.yuanChangeFen(data.money) < (data.mchInfo?.hbPayParamMap?.moneyLimit || 10000)
            ) {
                return;
            }
            manyPayType = manyPayType + 1;
            payTypeString = payTypeString + key;
        }
    });
    payTypeList.forEach((item) => {
        if (payTypeString.indexOf(item.payType) > -1 && !data.currentPayType) {
            //如果快捷支付为true，且卡列表长度大于0，则默认快捷；如果卡列表长度为0时，会默认下一种支付方式
            if ((item.payType === 'quickPay' && data.cardList.length > 0) || item.payType !== 'quickPay') {
                data.currentPayType = item.payType;
            }
        }
    });
    return manyPayType;
};

const handleSubmit = async () => {
    if (data?.mchInfo?.qrRemarkSwitch === '1' && data.remark.length == 0) {
        return; //弹出备注框
    }
    // #ifdef TAIZHOU
    let bankOrderParams = {};
    if (currentBrowser === 'tzbank') {
        bankOrderParams = {
            fixedMoney: Numeral.sub(Money.yuanChangeFen(data.money), data.couponMoney, 0), // 页面上输入的付款金额；
            attach: data.remark, // 页面上输入的备注信息；
            payAccessType: '08', // 默认”08”;
            mobileCode: data.bankAppConfig.phoneCode,
            mobileToken: data.bankAppConfig.token,
            txnChannel: '6004',
        };
    }
    // #endif
    await placeOrderPay({
        nativeQrId: data.nativeQrId, //用该字段标识统一正扫
        money: Money.yuanChangeFen(data.money), //订单金额
        daMoney: data.couponMoney, //优惠金额
        mchId: data?.mchInfo?.mchId,
        userId: data?.mchInfo?.userId,
        outTradeNo: data?.mchInfo?.outTradeNo,
        // 银联JScode需要上传userAuthCode、qrCode
        unionUserId: currentBrowser === 'ysf' ? getLoginCache('OPENID') : undefined,
        userAuthCode: currentBrowser === 'ysf' ? getLoginCache('userAuthCode') : undefined,//20240807  云闪付新增参数userAuthCode上送
        client: 'SPAY_MINI',
        attach: data.remark,
        // #ifdef MP-WEIXIN
        [Config.mpWeixinPaymentMode.appid]: appid || uni.getStorageSync('APPID'),
        [Config.mpWeixinPaymentMode.openid]: uni.getStorageSync('OPENID'),
        // #endif
        // #ifdef H5
        appid: appid || uni.getStorageSync('APPID'),
        hbFqNum: data.currentPayType.indexOf('huaBei') > -1 ? data.currentPayType.replace('huaBei', '') : undefined,
        openID:
            currentBrowser === 'micromessenger' && getUrlParam(window.location.href)?.openID
                ? getLoginCache('OPENID')
                : undefined,
        subOpenID:
            currentBrowser === 'micromessenger' && getUrlParam(window.location.href)?.subOpenID
                ? getLoginCache('OPENID')
                : undefined,
        pierce: data?.pierce,
        // #endif
        // #ifdef TAIZHOU
        ...bankOrderParams,
        // #endif
        payMethod: data.currentPayType.indexOf('aliPay') > -1 ? 'aliPayJsPay' : data.currentPayType,
        payType: '1',
        buyerId: currentBrowser === 'aliapp' ? getLoginCache('OPENID') : undefined,
        interestsList:
            data.currentCouponObj.couponType === '0' || !data.currentCouponObj.couponType
                ? '[]'
                : JSON.stringify([data.currentCouponObj]),
        quickPayParams: {
            mchName: data.mchInfo.mchName,
            signSource,
            thirdUserId: getLoginCache('OPENID'),
            ...data.currentSelectBank,
        },
        // #ifdef MP-WEIXIN
        qrId: data?.qrId,
        // #endif
    });
};

/**
 * 确认支付
 */
const confirmPay = async () => {
    if (!Number(data.money || 0)) {
        return showToast('请输入金额');
    }
    //订单超时，弹框提示
    if (data.countDownTime === '00:00') {
        return showOvertimeDialog();
    }
    if (!data.canInput) return;
    const payTypeNum = judgeManyPayType();
    try {
        //风险提示弹框
        if (data.alertDialogObj.type !== 'tradeFlag2' && riskShowModal()) {
            return;
        }
        //积分查询，取得支付方式后才去查询积分权益信息
        // #ifdef STANDARD
        data.currentPayType && (await queryInterestsInfoRequest(data.currentPayType));
        // #endif
        // #ifdef CDRCB
        if (data.nativeQrId) await queryInterestsInfoRequest('quickPay');
        // #endif
        //计算优惠
        judgeCoupon();
        //计算花呗
        computerHuabei();
        data.isClickConfirm = false;
        //备注必填且备注为空时，弹出备注填写框
        if (data?.mchInfo?.qrRemarkSwitch === '1' && data.remark.length == 0) {
            data.isClickConfirm = true;
            return remarkDialogToggle('open');
        }
        const isExistCoupon = data.isHaveIntegral || data.isHaveKnockActivity;
        //如果商户支持的支付方式数量等于1，且卡列表为0，且当前支付类型为快捷支付
        if (payTypeNum === 1 && data?.mchInfo?.payMethod?.quickPay && !data.cardList.length) {
            return alertDialogToggle('open', 'bindCard');
        }

        //花呗分期:如果最终优惠的金额少于100元时，不能使用花呗，要重新默认为支付宝支付
        if (
            data.currentPayType === 'huaBei' &&
            Numeral.sub(Money.yuanChangeFen(data.money), data.couponMoney, 0) <
                (data.mchInfo?.hbPayParamMap?.moneyLimit || 10000)
        ) {
            data.currentPayType = 'aliPay';
        }

        if (
            payTypeNum > 1 ||
            (payTypeNum === 1 && isExistCoupon) ||
            (data.currentPayType === 'quickPay' && data.cardList.length)
        ) {
            payTypeDialogToggle('open');
        } else if (payTypeNum === 1 && !isExistCoupon) {
            //如果商户支持的支付方式为1，又不存在优惠，直接支付
            handleSubmit();
        } else {
            uni.showModal({
                title: '温馨提示！',
                content: '请退出小程序重新扫码或重试',
                cancelText: '退出',
                confirmText: '重试',
                success(res) {
                    if (res.confirm) {
                        if (data.mchInfo.mchId) {
                            confirmPay();
                        } else {
                            wx.exitMiniProgram &&
                                wx.exitMiniProgram({
                                    success: function () {
                                        console.log('退出小程序成功');
                                    },
                                });
                        }
                    } else if (res.cancel) {
                        wx.exitMiniProgram &&
                            wx.exitMiniProgram({
                                success: function () {
                                    console.log('退出小程序成功');
                                },
                            });
                    }
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
};

/**
 * 备注弹框点击确认按钮
 */
const remarkInputConfirm = () => {
    data.remark = data.inputRemark;
    if (data.mchInfo?.qrRemarkSwitch === '1' && !data.inputRemark.length) {
        showToast('请填写备注');
    } else if (data.mchInfo?.qrRemarkSwitch === '1' && data.inputRemark.length && data.money) {
        remarkDialogToggle('close');
        data.isClickConfirm && confirmPay();
    } else {
        data.isClickConfirm = false;
        remarkDialogToggle('close');
    }
};

/**
 * 获得订单信息
 */
const getOrderInfo = async (preOrderId) => {
    const res = await orderDetail({
        preOrderId,
    });
    if (res?.result == '200') {
        data.mchInfo = res.message;
        data.fixedMoney = res.message?.money;
        data.money = Money.fenChangeYuan(res.message?.money) + '';
        data.outTradeNo = res.message?.orderNo;
        payCountDown(15 * 60); //支付倒计时
        //TODO 1、这里需要查询商户信息，必须要查询才能查询绑卡列表和权益积分;2、后端接口需要调整，要支持通过mchId查询
        queryMchInfoApi({ mchId: res.message?.mchId });
    }
};

/**
 * 请求小程序版本更新信息
 */
const getMiniProgramUpdate = () => {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
                uni.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (result) {
                        if (result.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        }
                    },
                });
            });
        }
    });
};

// 台州-跳转广告页
// eslint-disable-next-line no-return-assign
const goAdHost = () => {
    // #ifdef MP-WEIXIN
    // #endif
    // #ifdef H5
    location.href = data.mchInfo.adUrl;
    // #endif
    };

onLoad((options) => {
    // console.log('参数对象===');
    // console.log(options);
    //解析参数
    let qrId, preOrderId, fixedMoney, outTradeNo, nativeQrId;
    // #ifdef MP-WEIXIN
    if (options?.q) {
        let qrcodeUrl = decodeURIComponent(options?.q);
        if (qrcodeUrl.indexOf('?') != -1) {
            qrcodeUrl = qrcodeUrl.split('?')[0];
        }
        uni.setStorageSync('QRCODEURL', qrcodeUrl);
        const newQ: any = getUrlParam(options?.q);
        const unionPayReg = /qr.95516.com/;
        qrId = unionPayReg.test(options?.q) ? decodeURIComponent(options?.q).replace('https://qr.95516.com/04593451/','') : newQ.qrId;
        (preOrderId = newQ.preOrderId), (fixedMoney = newQ.fixedMoney || newQ.fixMoney);
        nativeQrId = newQ.nativeQrId;
        outTradeNo = getQueryString(qrcodeUrl, 'outTradeNo');
    } else if (options?.qrId || options?.preOrderId || options?.nativeQrId) {
        (qrId = options?.qrId), (fixedMoney = options?.fixedMoney || options?.fixMoney);
        nativeQrId = options?.nativeQrId;
    }
    getMiniProgramUpdate();
    // #endif
    // #ifdef H5
    // console.log(window.location.href);
    if (options && options.pierce) {
        if (/\{/.test(options.pierce)) {
            qrId = JSON.parse(options.pierce)?.qrId;
            outTradeNo = JSON.parse(options.pierce)?.outTradeNo;
        }
        fixedMoney = options?.fixedMoney || options?.fixMoney;
        outTradeNo = options?.outTradeNo;
        data.pierce = options?.pierce;
        data.userAuthCode = options?.userAuthCode;
        data.qrCode = options?.qrCode || '';
    }
    nativeQrId = options?.nativeQrId;
    // #endif
    // #ifdef TAIZHOU
    // 台州手机银行自动获取token
    if (currentBrowser === 'tzbank') {
        // data.bankAppConfig.phoneCode = 'mobileCode';
        // data.bankAppConfig.token = 'mobileToken';
        window.AlipayJSBridge.call('getACQPToken', {}, (result) => {
            data.bankAppConfig.phoneCode = result.code;
            data.bankAppConfig.token = result.token;
        });
    }
    // #endif
    data.outTradeNo = outTradeNo || '';
    if (fixedMoney) {
        data.fixedMoney = fixedMoney;
        data.money = Money.fenChangeYuan(fixedMoney) + '';
    }
    // 跳转逻辑
    if (qrId || nativeQrId || (options?.client === 'SPAY_PC' && options?.mchId)) {
        if (nativeQrId) data.nativeQrId = nativeQrId;
        if (qrId) data.qrId = qrId;
        //固定二维码
        queryMchInfoApi({
            qrId,
            nativeQrId,
            mchId: options?.mchId,
        });
        uni.setStorageSync('OPTIONS', options);
    } else if (preOrderId) {
        //TODO 场景尚未测试
        getOrderInfo(preOrderId);
    } else if (
        !qrId &&
        !preOrderId &&
        ((!options?.mchId && options?.client === 'SPAY_PC') || options?.client !== 'SPAY_PC')
    ) {
        showToast('请重新扫码');
    }
    uni.$on('bindCardFinish', () => {
        queryBindCardInfoRequest('bindCardFinish');
    });
});
</script>

<style lang="scss" scoped>
body{
	-webkit-text-size-adjust: 100% !important;
	text-size-adjust: 100% !important;
	-moz-text-size-adjust: 100% !important;
}

.text-center {
    text-align: center;
}
.text-right {
    text-align: right;
}
.title-color {
    color: $uni-text-color;
}
.desc-color {
    color: $uni-text-color-grey;
}
.placeholder-color {
    color: $uni-text-color-placeholder;
}
.red-color {
    color: #e82e29;
}
.yellow-color {
    color: #fc8b25;
}
.font-size-30 {
    font-size: 30rpx;
}
.font-size-24 {
    font-size: 24rpx;
}
.font-size-20 {
    font-size: 20rpx;
}

.flex {
    display: flex;
    .input-line {
        display: inline-block;
        margin-top: 10rpx;
        width: 4rpx;
        height: 70rpx;
        background-color: $uni-color-primary;
        animation: twinkle 1s linear infinite;
        margin-top: 26rpx;
    }
}

.payment {
    display: block;
    // font-family: 'PingFang SC';
    font-size: 28rpx;
    padding: 0 30rpx;
    background-color: $uni-bg-color;
    height: 100vh;
    overflow: hidden;

    .top {
        .top-blank {
            height: 20rpx;
        }
        .payment-money {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            font-size: 64rpx;
            margin-right: 4rpx;
        }
        .time-limit {
            line-height: 48rpx;
            height: 48rpx;
        }
        .payment-money-symbol {
            font-weight: 700;
            font-size: 40rpx;
            padding-top: 4rpx;
        }
        .payment-money-placeholder {
            color: $uni-text-color-placeholder;
            font-size: 48rpx;
        }
        .payment-desc {
            margin-bottom: 30rpx;
        }
        .payment-title {
            margin-bottom: 20rpx;
        }

        .fixed-money-block {
            width: 690rpx;
            margin: 0 auto 20rpx;
            /*  #ifdef CDRCB */
            background-color: $uni-bg-color-inverse;
            border-radius: 36rpx;
            /*  #endif  */
            overflow: hidden;
            /*  #ifndef CDRCB */
            border-radius: 16rpx;
            .white-background {
                background-color: $uni-bg-color-inverse;
                border-radius: 36rpx;
                margin-top: 30rpx;
            }
            /*  #endif  */
            .out-trade-no {
                margin-bottom: 50rpx;
            }
            /*  #ifdef CDRCB */
            .top-bg {
                width: 690rpx;
                height: 182rpx;
                margin-bottom: 20rpx;
                image {
                    width: 690rpx;
                    height: 182rpx;
                }
            }
            /*  #endif  */
            /*  #ifndef CDRCB  */
            .top-bg {
                width: 690rpx;
                height: 130rpx;
                text-align: center;
                line-height: 200rpx;
                image {
                    width: 90rpx;
                    height: 90rpx;
                }
            }
            /*  #endif  */
            .fixed-money-dec {
                padding: 14rpx 30rpx 0rpx;
                font-size: 28rpx;
                color: #979797;
            }
            @keyframes twinkle {
                0% {
                    opacity: 1;
                }
                40% {
                    opacity: 0.1;
                }
                70% {
                    opacity: 1;
                }
                100% {
                    opacity: 1;
                }
            }
            .top-uni-row {
                height: 120rpx;
                line-height: 120rpx;
                padding: 0 30rpx;
            }
            .remark-block {
                padding: 0 30rpx;
                .driver {
                    border-bottom: 2rpx solid $uni-border-color;
                }
                .remark-block-text {
                    padding: 30rpx 0;
                }
            }
        }
        .big-white-background {
            background-color: $uni-bg-color-inverse;
            .white-background {
                margin-top: 0;
            }
        }
    }
    .primary-color {
        color: $uni-text-color-active;
    }
    /*  #ifdef STANDARD || QSBANK  */
    .standard-remark-color {
        color: #cccccc;
    }
    /*  #endif  */
    .footer-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 30rpx 40rpx;
        width: 750rpx;
        background-color: $uni-bg-color-inverse;
        .confirm-btn {
            width: 670rpx;
            height: 88rpx;
            line-height: 88rpx;
            border-radius: 44rpx;
            background-color: $uni-color-base;
            text-align: center;
            font-size: 32rpx;
            color: $uni-text-color-inverse;
        }
    }
    .safe-btn {
        padding-bottom: 0;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        .safe-padding-bottom {
            height: 30rpx;
        }
    }
}
.dialog {
    width: 480rpx;
    background-color: $uni-bg-color-inverse;
    border-radius: 16rpx;
    .dialog-content {
        padding: 40rpx;
        .dialog-content-textarea {
            width: 100%;
            height: 90rpx;
        }
    }
}
.dialog-footer {
    height: 98rpx;
    display: flex;
    flex-flow: row nowrap;
    border-top: 2rpx solid $uni-border-color;
    .footer-btn {
        flex: 1 1;
        line-height: 98rpx;
    }
    .confirm-btn {
        color: $uni-text-color-active;
        border-left: 2rpx solid $uni-border-color;
    }
}
.pay-type-dialog {
    width: 750rpx;
    background-color: $uni-bg-color-inverse;
    border-radius: 16rpx 16rpx 0 0;
    .slot-box {
        display: flex;
        flex-flow: row wrap;
        flex: 1 1;
        .slot-box-img {
            padding-left: 6rpx;
            padding-top: 4rpx;
            image {
                width: 30rpx;
                height: 30rpx;
            }
        }
    }
    .discount-block {
        margin-left: 8rpx;
        font-size: 20rpx;
        border: 1rpx solid #fc8b25;
        border-radius: 6rpx;
        padding: 4rpx 6rpx;
        line-height: 28rpx;
        height: 28rpx;
        color: #fc8b25;
    }
    .coupon-block {
        margin-top: 10rpx;
    }
    .gray-block {
        background-color: $uni-border-color;
        border: 0;
        border-radius: 20rpx;
        padding: 6rpx 24rpx;
        color: $uni-text-color;
    }
    .dialog-header {
        position: relative;
        padding: 30rpx 20rpx;
        border-bottom: 2rpx solid $uni-border-color;
        .close {
            position: absolute;
            top: 32rpx;
            right: 20rpx;
            image {
                width: 30rpx;
                height: 30rpx;
            }
        }
        .dialog-header-back {
            text-align: left;
            position: absolute;
            width: 100rpx;
            top: 32rpx;
            left: 20rpx;
        }
    }
    .dialog-footer {
        padding: 30rpx;
        box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
        border-top: 0;
        .dialog-footer-item {
            .now-rap {
                white-space: nowrap;
            }
            padding-right: 10rpx;
            flex: 1 1;
            align-items: center;
            justify-content: flex-end;
            display: flex;
            .money-text {
                font-weight: 700;
                font-size: 48rpx;
            }
            .money-desc {
                margin: 0 2rpx 0 0;
            }
        }
        .dialog-footer-item:nth-child(2) {
            padding-right: 0;
            flex-flow: row wrap;
            .footer-item-btn {
                width: 320rpx;
                height: 88rpx;
                line-height: 88rpx;
                background-color: $uni-color-base;
                color: $uni-text-color-inverse;
                border-radius: 44rpx;
                font-size: 32rpx;
                margin: 0;
            }
        }
    }

    .right-text {
        line-height: 36rpx;
        height: 36rpx;
        position: absolute;
        right: 0;
        /*  #ifdef MP-WEIXIN  */
        top: 32rpx;
        /*  #endif  */
        /*  #ifdef H5  */
        top: 36rpx;
        /*  #endif  */
    }
    .right-position-radio {
        position: absolute;
        right: 30rpx;
        top: 37rpx;
    }
    .pay-type-item {
        ::v-deep .uni-list-item__container {
            padding-top: 28rpx;
            padding-bottom: 28rpx;
        }
        .pay-type-item-rec {
            height: 36rpx;
            width: 58rpx;
            text-align: center;
            line-height: 36rpx;
            background: #fc8b25;
            border-radius: 16rpx 16rpx 16rpx 0;
            color: $uni-text-color-inverse;
            font-size: 20rpx;
            position: absolute;
            top: 30rpx;
            left: 256rpx;
        }
    }
    .quick-type-item {
        ::v-deep .uni-list-item__header {
            align-items: flex-start;
        }
        .right-position-radio {
            top: 30rpx;
        }
        .discount-block {
            margin-left: 0;
            margin-top: 16rpx;
        }
    }

    .right-radio {
        transform: scale(0.7);
        color: $uni-color-base;
        margin-right: -18rpx;
    }
    .huabei-list:first-child {
        ::v-deep .uni-list-item__container {
            border-top: 1rpx solid $uni-border-color;
        }
    }
    .huabei-list {
        padding-left: 78rpx;
        ::v-deep .uni-list-item__container {
            padding-top: 8rpx;
            padding-bottom: 16rpx;
            border-bottom: 1rpx solid $uni-border-color;
        }
        .right-position-radio {
            top: 22rpx;
        }
    }
    .back-gray {
        height: 16rpx;
        background-color: $uni-border-color;
    }
}

.ad-box {
    margin-top: 20rpx;
    overflow: hidden;

    image {
        display: block;
        width: 100%;
        height: 196rpx;
    }
}
</style>
