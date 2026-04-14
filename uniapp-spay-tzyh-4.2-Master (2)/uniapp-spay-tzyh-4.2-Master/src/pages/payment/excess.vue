<template>
    <view class="page">
        <view class="top font-size-24 desc-color text-center">
            <view class="space" />
            <view class="text-center">根据监管要求，您当日静态付款码金额已超限，</view>可点击页面按钮识别动态码完成付款
        </view>
        <view class="content">
            <view class="fixed-money-block">
                <view class="top-bg">
                    <image :src="currentBank.topBg" />
                </view>
                <view class="center">
                    <view class="text-center title-color font-size-28">{{ data.mchName }}</view>
                    <view class="text-center title-color">
                        <text class="font-size-40">¥</text>
                        <text class="font-size-64">{{
                            Money.fenChangeYuan(Numeral.sub(data.params?.money, data.params?.daMoney || 0, 0))
                        }}</text>
                    </view>
                    <view class="line" />
                    <view class="qrCode">
                        <tki-qrcode :load-make="true" :size="300" :val="data.qrcodeUrl" />
                    </view>
                </view>
            </view>
        </view>
        <view class="bottomtxt font-size-24 desc-color text-center"> 付款前请您核对付款信息 </view>
        <!-- <button class="primary-btn font-size-32 payBtn" @click="confirmPay">识别并支付</button> -->
        <footer-button text="识别支付" type="primary" theme="solid" circle class="fixed-bottom" @click="confirmPay" />
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import FooterButton from '../../components/footer-button.vue';
import { Money } from '../../utils/MoneyUtils';
import { placeOrderPay } from '../../services/payment/payment';
import tkiQrcode from 'tki-qrcode/components/tki-qrcode/tki-qrcode.vue';
import { Numeral } from '../../utils/NumeralUtils';
// #ifdef CDRCB
import cdrcbTopBg from '../../assets/images/payment/cdrcb_bg.png';
// #endif
// #ifdef STANDARD
import defaultTopBg from '../../assets/images/payment/default_mch__logo.png';
// #endif
// #ifdef QSBANK
import qsbankTopBg from '../../assets/images/payment/qsbank_mch__logo.png';
// #endif
// #ifdef TAIZHOU
import taiZhouTopBg from '../../assets/images/payment/taizhou/merchant.png';
// #endif
const bankNameObj = {
    // #ifdef CDRCB
    cdrcb: {
        topBg: cdrcbTopBg,
    },
    // #endif
    // #ifdef STANDARD
    standard: {
        topBg: defaultTopBg,
    },
    // #endif
    // #ifdef QSBANK
    qsbank: {
        topBg: qsbankTopBg,
    },
    // #endif
    // #ifdef TAIZHOU
    taizhou: {
        topBg: taiZhouTopBg,
    },
    // #endif
};
const BANK_CODE: any = process.env.BANK_CODE;
const currentBank = bankNameObj[BANK_CODE || {}];

type dataType = {
    // 用户id
    params: any;
    qrcodeUrl: string;
    preOrderId: string;
    mchName: string;
};
const data: dataType = reactive({
    params: {},
    preOrderId: '',
    qrcodeUrl: '',
    mchName: '',
});

/**
 * 确认支付
 */
const confirmPay = async () => {
    if (!data?.params?.money || data?.params?.money == 0) {
        return uni.showToast({
            title: '请输入金额',
            icon: 'none',
            duration: 2500,
        });
    }
    await placeOrderPay({
        ...data.params,
        // #ifdef MP-WEIXIN
        preOrderId: data.preOrderId,
        // #endif
        payType: '2',
    });
};

onLoad((options: any) => {
    console.log('excess options: ', options);
    const requestParams = JSON.parse(decodeURIComponent(options.params) || '{}');
    //云闪付通道unionUserId中可能含有特殊字符+等，先编码成%2B的形式传递给大额页面，再重新解码
    if (requestParams.unionUserId && requestParams.unionUserId.length > 0){
        requestParams.unionUserId = decodeURIComponent(requestParams.unionUserId);
    }
    data.params = requestParams;
    data.qrcodeUrl = decodeURIComponent(options.qrcodeUrl);
    data.mchName = options.mchName;
    data.preOrderId = options.preOrderId;
});
</script>

<style lang="scss" scoped>
.title-color {
    color: $uni-text-color;
}
.text-color {
    color: $uni-text-color-dark-grey;
}
.desc-color {
    color: $uni-text-color-grey;
}
.font-size-20 {
    font-size: 20rpx;
}
.font-size-24 {
    font-size: 24rpx;
}
.font-size-26 {
    font-size: 26rpx;
}
.font-size-28 {
    font-size: 28rpx;
}
.font-size-32 {
    font-size: 32rpx;
}
.font-size-56 {
    font-size: 56rpx;
}
.text-center {
    text-align: center;
}
.page {
    margin: 0;
    min-height: 100vh;
    background-color: $uni-bg-color;
    .top {
        .space {
            height: 30rpx;
        }
        padding: 0 30rpx 30rpx;
    }
    .bottomtxt {
        padding: 20rpx;
    }
    .content {
        margin: 0px 30rpx 0px 30rpx;
        background-color: $uni-bg-color-inverse;
        /*  #ifdef CDRCB */
        border-radius: 36rpx;
        /*  #endif  */
        /*  #ifndef CDRCB  */
        border-radius: 16rpx;
        /*  #endif  */
        .font-size-40 {
            font-size: 40rpx;
        }
        .font-size-64 {
            font-size: 64rpx;
        }
        .center {
            padding: 0 30rpx 48rpx 0;
            .line {
                height: 2rpx;
                background-color: $uni-border-color;
                margin-top: 12rpx;
                margin-bottom: 48rpx;
            }
            .title-color {
                color: $uni-text-color;
                margin-bottom: 4rpx;
            }
        }
        .fixed-money-block {
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
            /*  #ifndef CDRCB */
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
        }

        .qrCode {
            width: 300rpx;
            height: 300rpx;
            padding: 10rpx;
            overflow: hidden;
            margin: 0 auto;
            // border: 2rpx solid $uni-border-color;
        }
    }
    .primary-btn {
        background-color: $uni-color-base;
        color: $uni-text-color-inverse;
        height: 96rpx;
        border-radius: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .primary-btn[disabled] {
        background-color: $uni-color-success;
    }
    .primary-btn::after {
        border: 1rpx solid $uni-color-base;
    }
    .primary-btn[disabled] ::after {
        border: 1rpx solid $uni-color-success;
    }
    .payBtn {
        width: 560rpx;
    }
    .fixed-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
</style>
