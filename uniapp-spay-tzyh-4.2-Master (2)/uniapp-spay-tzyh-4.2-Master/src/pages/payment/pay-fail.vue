<template>
    <div class="page">
        <div class="content">
            <icon type="clear" size="50" />
            <view class="fail-text">支付失败</view>
            <view class="pay-price">
                <text class="sign">¥</text>
                <text>{{ Money.fenChangeYuan(Numeral.sub(data.money, data.daMoney || 0, 0)) }}</text>
            </view>
            <view v-if="Number(data.daMoney || 0)" class="line-price"> ¥{{ Money.fenChangeYuan(data.money) }} </view>
        </div>
        <view class="button-view">
            <button type="default" :class="cdrcbFinish[currentBrowser]?.class" @click="close">关闭</button>
        </view>
    </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import { Money } from '../../utils/MoneyUtils';
import { Numeral } from '../../utils/NumeralUtils';
import { getWhichBrowser } from '../../utils/GlobalUtils';
const currentBrowser = getWhichBrowser();
const cdrcbFinish = {
    micromessenger: {
        class: 'wechat-btn',
    },
    miniprogram: {
        class: 'wechat-btn',
    },
    aliapp: {
        class: 'aliapp-btn',
    },
    ysf: {
        class: 'ysf-btn',
    },
    tzbank: {
        class: '',
    },
};
type dataType = {
    // 订单号
    orderNo: string;
    // 优惠
    daMoney: string | number;
    // 积分
    integral: number | string;
    // 金额
    money: string | number;
    // 商户号
    mchId: string;
    //商户名
    mchName: string;
};
const data: dataType = reactive({
    orderNo: '',
    daMoney: '0',
    money: '0',
    integral: 0,
    mchId: '',
    mchName: '',
});
onLoad((options) => {
    const { orderNo, daMoney, integral, money, mchId, mchName } = options;
    data.money = money || '0';
    data.orderNo = orderNo || '';
    data.mchId = mchId || '';
    data.daMoney = daMoney || '';
    data.integral = integral || '';
    data.mchName = mchName || '';
});

function close() {
    if (currentBrowser === 'aliapp') {
        window.AlipayJSBridge.call('closeWebview');
    } else if (currentBrowser === 'micromessenger') {
        window.WeixinJSBridge.call('closeWindow');
    } else if (currentBrowser === 'tzbank') {
        window.AlipayJSBridge.call('prePage');
    }
}
</script>

<style scoped lang="scss">
.page {
    position: relative;
    min-height: 100vh;
}
.content {
    height: 428rpx;
    background: #fff;
    text-align: center;
}
icon {
    margin: 70rpx 0 20rpx;
}
.fail-text {
    color: #696969;
    font-size: 28rpx;
    line-height: 1;
}
.pay-price {
    margin-top: 20rpx;
    color: #333;
    font-size: 64rpx;

    .sign {
        color: #999;
        font-size: 40rpx;
    }
}
.line-price {
    margin-top: 10rpx;
    color: #cecece;
    font-size: 28rpx;
    text-decoration: line-through;
}
.button-view {
    position: absolute;
    bottom: 188rpx;
    width: 100%;
}
button {
    margin: 0 96rpx;
    height: 112rpx;
    line-height: 112rpx;
    border-radius: 200rpx;
    color: #fff;
    font-size: 32rpx;
    background: $uni-color-base;
}
.wechat-btn {
    background-color: #07c160;
}
.aliapp-btn {
    background-color: #3379f6;
}
.ysf-btn {
    background-color: #e50012;
}
button:after {
    border: none;
}
</style>
