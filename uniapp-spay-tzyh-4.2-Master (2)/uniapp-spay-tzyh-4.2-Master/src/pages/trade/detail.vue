<template>
    <view class="page">
        <view class="trade-price">
            <image :src="state.logoUrl" />
            <view class="merchant-name"
                >{{ state.merchantName }}-{{ state.tradeStatus === 2 ? '收款成功' : '退款成功' }}</view
            >
            <view class="price">{{ state.tradeStatus === 2 ? '+' : '-' }}{{ state.amount }}</view>
        </view>
        <view class="trade-info">
            <view class="info-item">
                <text class="info-label">商户名称</text>
                <text class="info-value">{{ state.merchantName }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">商户编号</text>
                <text class="info-value">{{ state.merchantCode }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">收银员</text>
                <text class="info-value">{{ state.cashier }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">交易时间</text>
                <text class="info-value">{{ state.time }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">交易类型</text>
                <text class="info-value">{{ state.tradeType }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">交易金额</text>
                <text class="info-value">{{ state.amount }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">交易流水</text>
                <text class="info-value">{{ state.tradeCode }}</text>
            </view>
            <view class="info-item">
                <text class="info-label">第三方流水号</text>
                <text class="info-value">{{ state.thirdCode }}</text>
            </view>
            <view v-if="state.tradeStatus !== 2" class="info-item">
                <text class="info-label">退款单号</text>
                <text class="info-value">{{ state.refundNo }}</text>
            </view>
            <view v-if="state.tradeStatus !== 2" class="info-item">
                <text class="info-label">第三方退款单号</text>
                <text class="info-value">{{ state.outRefundNo }}</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const state = ref({});

onLoad((optiosn) => {
    const o = optiosn;
    const status = Number(o.status);
    state.value = {
        logoUrl: o.mchLogo,
        merchantName: o.mchName,
        tradeStatus: status, // 收款/退款(2/4)
        amount: status === 2 ? o.totalFee : o.refundMoney,
        merchantCode: o.mchId,
        cashier: o.userName,
        time: o.tradeTimeStr,
        tradeType: o.tradeName,
        tradeCode: o.orderNo,
        thirdCode: o.outTradeNo,
        refundNo: o.refundNo,
        outRefundNo: o.outRefundNo,
    };
});
</script>

<style scoped lang="less">
.page {
    padding: 0 62rpx;
    background: #fff;
    overflow: hidden;

    .trade-price {
        height: 396rpx;
        border-bottom: 1rpx solid #eee;
        overflow: hidden;

        image {
            display: block;
            width: 90rpx;
            height: 90rpx;
            object-fit: contain;
            margin: 48rpx auto 28rpx;
        }
        .merchant-name {
            text-align: center;
            font-size: 34rpx;
            color: #000;
        }
        .price {
            margin: 24rpx auto;
            text-align: center;
            font-size: 54rpx;
        }
    }
    .trade-info {
        padding: 47rpx 0 80rpx;
        font-size: 28rpx;

        .info-item {
            display: flex;
            margin-bottom: 16rpx;
            overflow: hidden;

            &:last-of-type {
                margin-bottom: 0;
            }
        }
        .info-label {
            display: inline-block;
            margin-right: 56rpx;
            min-width: 168rpx;
            color: #979797;
        }
        .info-value {
            color: #333;
            word-break: break-all;
        }
    }
}
</style>
