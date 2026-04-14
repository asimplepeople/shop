<template>
    <view class="sms-code">
        <view class="content">
            <view class="title">{{ data.name }}</view>
            <view class="price"><text class="yuan">¥</text>{{ data.money }}</view>
            <!-- 验证码 -->
            <view class="code-input-wrapper">
                <view :class="['code-input', data.isError && 'code-error']">
                    <view
                        v-for="(item, index) in data.inputItems"
                        :key="index"
                        :class="['input-item', data.inputIndex === index && 'cursor']"
                        >{{ item }}</view
                    >
                </view>
                <input
                    focus
                    class="input-inner"
                    type="number"
                    maxlength="6"
                    @input="onCodeInput"
                    @blur="onCodeBlur"
                    @focus="onCodeFocus"
                />
            </view>
            <!-- 错误提示 -->
            <view v-if="data.isError && data.errorMsg" class="code-error-tips">{{ data.errorMsg }}</view>
            <!-- 获取验证码 -->
            <view :class="['code-get', data.timeStatus === 'wait' && 'code-wait']" @click="onGetCode">{{
                data.getMsg
            }}</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { getSmsVerificationCode, quickPay } from '../../services/payment/quick';
import { payFail, queryOrderStatus, toPageResult } from '../../services/payment/payment';
import { Money } from '../../utils/MoneyUtils';
import { Numeral } from '../../utils/NumeralUtils';
import { Base64 } from '../../utils/GlobalUtils';

type dataType = {
    // 是否显示错误信息
    isError: boolean;
    // 错误信息
    errorMsg: string;
    // 获取验证码 文案
    getMsg: string;
    // 商户账户名
    name: string;
    // 支付价格
    money: number | string;
    // 输入框上次光标失去焦点所处的位置
    prevIndex: number;
    // 当前输入框光标所处位置
    inputIndex: number;
    // 输入的验证码（以数组保存）
    inputItems: string[];
    // 倒计时(60s)
    timeCount: number;
    // 倒计时状态(init, wait, retry)
    timeStatus: string;
    // 订单号（获取验证码接口返回）
    outTradeNo: string;
    // 页面参数
    params: any;
    //查询订单状态次数
    queryNum: number;
};

const data: dataType = reactive({
    isError: false,
    errorMsg: '验证码错误',
    getMsg: '获取验证码',
    name: '',
    money: 0.0,
    prevIndex: 0,
    inputIndex: 0,
    inputItems: ['', '', '', '', '', ''],
    timeCount: 60,
    timeStatus: 'init',
    outTradeNo: '',
    params: {},
    queryNum: 0,
});

const skipFinishPage = (outTradeNo, mktOrderNo, orderNo, integral) => {
    // console.log(val, 'pay');
    const { money, mchId, userId, daMoney } = data.params;
    // 支付完成跳转到支付结果页
    // uni.navigateTo({
    //     url: `/pages/payment/pay-result?orderNo=${outTradeNo}&money=${money}&userId=${userId}&mchId=${mchId}&interest=${integral}&mktOrderNo=${
    //         mktOrderNo || ''
    //     }&daMoney=${daMoney}&transactionId=${orderNo}&isFastPay=${1}`,
    // });
    toPageResult({
        outTradeNo,
        mchId,
        userId,
        money,
        mktOrderNo,
        daMoney,
        interest: integral,
        transactionId: orderNo,
        isFastPay: 1,
    });
};

/**
 * 查询订单状态
 */
const queryOrderStatusRequest = async (outTradeNo: string, mktOrderNo: string, orderNo: string, integral) => {
    const { mchId } = data.params;
    const res = await queryOrderStatus({
        mchId,
        outTradeNo,
    });
    if (res.result === '200') {
        if (res.message.tradeState == '2') {
            skipFinishPage(outTradeNo, mktOrderNo, orderNo, integral);
        } else {
            setTimeout(() => {
                if (data.queryNum < 5) {
                    data.queryNum = data.queryNum + 1;
                    queryOrderStatusRequest(outTradeNo, mktOrderNo, orderNo, integral);
                } else {
                    //TODO 跳转错误待确认页面，产品暂时没给图
                }
            }, 1000);
        }
    }
};

// 提交支付
const onPay = async (val) => {
    // console.log(val, 'pay');
    const {
        thirdUserId,
        signSource,
        signNo,
        mobile,
        money,
        mchId,
        remark,
        mchName,
        userId,
        interestsList,
        daMoney,
        pierce,
    } = data.params;
    const { outTradeNo } = data;
    data.name = mchName;
    // console.log(mobile);
    const res = await quickPay({
        thirdUserId,
        signSource,
        signNo,
        mobile: Base64(mobile),
        money,
        smsVerifyCode: val,
        remark,
        outTradeNo,
        // #ifdef CDRCB
        userId,
        // #ifdef H5
        pierce,
        // #endif
        // #endif
        mchId,
        interestsList,
        daMoney,
    });
    if (res?.result === '200') {
        const interest = JSON.parse(interestsList);
        const integral = interest.length > 0 ? interest[0]?.verificationNum : '';
        if (res.message.status == '1') {
            if (res.message.needQuery === 'Y') {
                //需要查询订单状态
                queryOrderStatusRequest(outTradeNo, res.message.mktOrderNo || '', res.message.orderNo || '', integral);
            } else {
                skipFinishPage(outTradeNo, res.message.mktOrderNo || '', res.message.orderNo || '', integral);
            }
        } else {
            uni.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2500,
            });
            //支付失败去调取消接口
            payFail({
                outTradeNo,
                mchId,
                userId,
                mktOrderNo: res?.message?.mktOrderNo,
            });
        }
    } else {
        if (res?.retcode === '308') {
            uni.showModal({
                title: '提示',
                content: res?.retmsg || '网络异常！',
                showCancel: false,
                confirmText: '知道了',
                confirmColor: '#01A763',
                success: function (res) {
                    if (res.confirm) {
                        //回退到首页
                        uni.navigateBack({
                            delta: 1,
                            // success: () => {
                            //     // 调用回调事件
                            //     uni.$emit('bindCardFinish');
                            // },
                        });
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                },
            });
        }
    }
};

// 设置显示的验证码
const setCodeNumber = (val) => {
    let codeArr: string[] = [];
    console.log(val);
    if (val !== '') {
        codeArr = val.split('');
        const codeLen = codeArr.length;
        codeArr.length = 6;
        codeArr.fill('', codeLen);
        data.inputIndex = codeLen;
        // 验证码输入完成
        if (val.length === 6) {
            onPay(val);
        }
    } else {
        codeArr = ['', '', '', '', '', ''];
        data.inputIndex = 0;
    }
    data.inputItems = codeArr;
};
// 验证码输入
const onCodeInput = (e) => {
    const value = e.detail.value;
    setCodeNumber(value);
};
// 失去焦点
const onCodeBlur = () => {
    data.prevIndex = data.inputIndex;
    // 去除光标
    data.inputIndex = -1;
};
// 重新获得焦点
const onCodeFocus = () => {
    data.inputIndex = data.prevIndex;
};
// 倒计时
const codeTimeOut = (count) => {
    let c = count || 60;
    data.getMsg = c + '秒后重新获取';
    if (count === 0 && data.timeStatus === 'wait') {
        data.timeStatus = 'retry';
        data.timeCount = 60;
        data.getMsg = '重新获取';
        return;
    }
    let timer = setTimeout(() => {
        c--;
        data.timeCount = c;
        data.getMsg = c + '秒后重新获取';
        codeTimeOut(c);
        clearTimeout(timer);
    }, 1000);
};

// 获取验证码
const getReqCode = async () => {
    const { thirdUserId, signSource, mobile, signNo, money, mchId } = data.params;
    try {
        const res = await getSmsVerificationCode({
            thirdUserId,
            signSource,
            mobile: Base64(mobile),
            mchId,
            // outTradeNo,
            signNo,
            money,
        });
        if (res?.result == '200') {
            data.outTradeNo = res?.message || '';
        } else {
            throw new Error(res?.message);
        }
    } catch (error: any) {
        uni.showToast({
            icon: 'none',
            title: error.message || '获取验证码失败',
            duration: 2500,
        });
        setTimeout(() => {
            uni.navigateBack({ delta: 1 });
        }, 1500);
    }
};

// 获取验证码
const onGetCode = () => {
    if (data.timeStatus === 'init' || data.timeStatus === 'retry') {
        data.timeStatus = 'wait';
        getReqCode();
        codeTimeOut(data.timeCount);
    }
};
onLoad(async (options) => {
    // console.log(options);
    data.params = options?.data ? JSON.parse(options.data) : {};
    const { money, mchName, daMoney } = data.params;
    data.money = Money.fenChangeYuan(Numeral.sub(money, daMoney, 0));
    data.name = mchName;
    // 获取验证码
    getReqCode();
    data.timeStatus = 'wait';
    codeTimeOut(data.timeCount);
});

onReady(() => {
    uni.setNavigationBarTitle({
        title: '请输入短信验证码',
    });
});
</script>

<style lang="scss" scoped>
/* 光标动画 */
@keyframes focus {
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
.sms-code {
    min-height: 100vh;
    background-color: #f9f9f9;
    .content {
        background-color: $uni-text-color-inverse;
    }
    .title {
        padding-top: 60rpx;
        color: $uni-text-color;
        font-size: $uni-font-size-sm;
        text-align: center;
    }
    .price {
        margin-top: 20rpx;
        color: $uni-text-color;
        font-size: 92rpx;
        text-align: center;
        font-weight: 700;
        .yuan {
            display: inline-block;
            vertical-align: top;
            padding-top: 32rpx;
            font-size: 60rpx;
            margin-right: 15rpx;
        }
    }
    .code-input-wrapper {
        width: 580rpx;
        margin: 60rpx auto 0;
        overflow: hidden;
        position: relative;
        .code-input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .input-item {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40rpx;
                box-sizing: border-box;
                border: 1rpx solid transparent;
                height: 80rpx;
                width: 80rpx;
                color: $uni-text-color;
                background-color: $uni-bg-color-grey;
            }
            .input-item.cursor::after {
                content: ' ';
                width: 1px;
                height: 56rpx;
                background-color: $uni-text-color-active;
                animation: focus 1s infinite;
            }
        }
        .input-inner {
            position: absolute;
            border: transparent;
            top: 0;
            left: -10000rpx;
            width: 10580rpx;
            height: 100%;
            display: block;
            font-size: 40rpx;
        }
        .code-error {
            .input-item {
                border-color: $uni-color-error;
            }
        }
    }
    .code-error-tips {
        color: $uni-color-error;
        margin-top: 20rpx;
        text-align: center;
        font-size: $uni-font-size-min;
    }
    .code-get {
        color: $uni-text-color-active;
        font-size: $uni-font-size-base;
        text-align: center;
        padding: 60rpx 0;
    }
    .code-wait {
        color: $uni-text-color-placeholder;
    }
}
</style>
