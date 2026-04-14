<template>
    <view :class="['page', noOpen ? 'gray' : 'orange']">
        <view v-if="!noOpen">
            <view class="header"> <image :src="headerImg" alt="" /></view>
            <view class="content-box">
                <view class="content">
                    <view class="info-box">
                        <view class="info-title">活动名称</view>
                        <view class="info-item">{{ data.activityName }}</view>
                    </view>
                    <view class="info-box">
                        <view class="info-title">活动规则</view>
                        <view class="info-item">{{ data.activityRules }}</view>
                    </view>
                    <!-- <view class="info-box"> -->
                        <!--<view class="info-title">上月存款</view>
                        <view class="info-time"
                            >{{ `${prevYear}.${prevMonth}.1` }}至{{ `${prevYear}.${prevMonth}.${prevDay}` }}</view
                        >-->
                        <!-- <view class="info-title-normal bar-class">参与活动存款上月日均（万元）</view> -->
                        <!-- 转化为万元，保留两位小数，不进行四舍五入 -->
                        <!-- <view class="info-money">{{ Math.floor(data.dailyAvgDeposit / 1000000 * 100) / 100 }}</view> -->
                        <!-- <view class="info-money">{{ Math.floor(4000100 / 1000000 * 100) / 100 }}</view> -->
                    <!-- </view> -->
                    <view class="info-box" style="padding-bottom: 10px">
                        <view class="info-title">减免额度</view>
                        <!--<view class="info-time">{{ `${year}.${month}.1` }}至{{ `${year}.${month}.${day}` }}</view>-->
                        <view class="info-title-normal bar-class">本月可减免手续费（元）</view>
                        <view class="info-money">
                            <text>{{
                                data.limitCreditMouthFlag !== true ? '无限制' : data.limitCreditMouth / 100
                            }}</text>
                            <text v-if="data.limitCreditMouthFlag === true" class="small-money"
                                >约{{ data.limitEquTurnover / 1000000 }}万收款额</text
                            >
                        </view>
                        <view class="info-title-normal bar-class">本月已减免手续费（元）</view>
                        <view class="info-money">
                            <text>{{ data.usedCreditMouth / 100 }}</text>
                            <text class="small-money">约{{ data.usedEquTurnover / 100 }}元收款额</text>
                        </view>
                        <view class="info-title-normal bar-class">本月剩余手续费减免额（元）</view>
                        <view class="info-money">
                            <text>{{
                                data.limitCreditMouthFlag !== true
                                    ? '无限制'
                                    : Math.max((data.limitCreditMouth - data.usedCreditMouth) / 100, 0)
                            }}</text>
                            <text v-if="data.limitCreditMouthFlag === true && (data.limitEquTurnover - data.usedEquTurnover) > 0" class="small-money"
                                >约{{ (data.limitEquTurnover - data.usedEquTurnover) / 1000000 }}万收款额</text
                            >
                        </view>
                    </view>
                    <view class="warn-text"
                        >温馨提示 :
                        <view
                            >1.折算存款指：活期存款的1倍+核心非活期部分（即通知存款、一年期及以下定期存款）的0.5倍；</view
                        >
                        <!-- <view>2.单笔交易产生的手续费超过剩余减免额时不减免；</view> -->
                        <view>2.不同商户入账账户相同时, 手续费额度共享；</view>
                        <view>3.页面中涉及“XX收款额”测算是按照0.2%费率估算，仅供参考。</view>
                    </view>
                    <view class="bar-icon">
                        <view class="btn-bar" @click="goDetail">查看减免明细</view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="no-open">
            <image :src="noOpenImg" />
            <view class="no-open-text">您当前未参加手续费减免活动！</view>
            <view class="bar-icon">
                <view class="btn-bar" @click="goDetail">查看历史减免明细</view>
            </view>
            <!-- <view class="no-open-text">可联系客户经理进行开通</view> -->
        </view>
    </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import headerImg from '@/assets/images/feeWaiver/taizhou/activity-header.png';
import { ref } from 'vue';
import { getFeeDeductionInfo } from '@/services/feeWaiver';
import noOpenImg from '@/assets/images/subsidy/no-open.png';

const data = ref({});
const noOpen = ref(false);

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = new Date(year, month, 0).getDate();
const prevYear = month === 1 ? year - 1 : year;
const prevMonth = month === 1 ? 12 : month - 1;
const prevDay = new Date(prevYear, prevMonth, 0).getDate();

const query = ref({
    skey: '',
    sauthid: '',
});

onLoad((options) => {
    query.value = options;
    const authInfo = {
        'SKEY':query.value.skey,
        'SAUTHID':query.value.sauthid
    }
    getFeeDeductionInfo(options.mchId, authInfo).then((res) => {
        console.log(res, '====');
        if (res.result === '200') {
            data.value = res.message;
        } else {
            noOpen.value = true;
            uni.showToast({
                icon: 'none',
                title: res.message,
                duration: 3500,
            });
        }
    });
});

const goDetail = () => {
    uni.navigateTo({
        url: `/pages/feeWaiver/taizhou/list?mchId=${query.value.mchId}&skey=${query.value.skey}&sauthid=${query.value.sauthid}&t=` + Date.parse(new Date()),
    });
};
</script>

<style scoped lang="less">
.page {
    min-height: 100vh;
}
.orange {
    background: #ff7148;
}
.gray {
    background: #f1f1f1;
}
.header {
    image {
        display: block;
        width: 100%;
    }
}
.content-box {
    padding: 0 30rpx;
    transform: translateY(-115rpx);
}
.content {
    // padding: 50rpx 10rpx;
    padding: 1rpx 10rpx 50rpx 10rpx;
    min-height: 1000rpx;
    background: #fff;
    border-top-left-radius: 13px;
    border-top-right-radius: 13px;
    border-bottom-left-radius: 13px;
    border-bottom-right-radius: 13px;
    letter-spacing: 2rpx;
}
.info-box {
    margin: 20rpx 0 30rpx 0;
    // font-size: 28rpx;
    color: #333;

    & > view {
        padding-left: 28rpx;
    }
    .info-title {
        color: #f74438;
        font-weight: bold;
        background-image: linear-gradient(90deg, rgba(253, 117, 69, 0.3), rgba(253, 117, 69, 0));
        background-size: 23% 39%;
        background-repeat: no-repeat;
        background-position: left bottom;
        background-clip: content-box;
    }
    .info-item {
        margin-top: 20rpx;
        padding-left: 28rpx;
        // font-size: 30rpx;
    }
    .info-time {
        color: #979797;
    }
    .info-title-normal {
        margin-top: 20rpx;

        // &:before {
        //     content: ' ';
        //     margin-right: 20rpx;
        //     display: inline-block;
        //     width: 10rpx;
        //     height: 10rpx;
        //     vertical-align: middle;
        //     border-radius: 10rpx;
        //     background: #000;
        // }
    }
    .info-money {
        margin-top: 15rpx;
        padding-left: 50rpx;
        // font-size: 32rpx;
        color: #fd7545;

        .small-money {
            margin-left: 36rpx;
            padding: 4rpx 16rpx;
            font-size: 24rpx;
            color: #fd7545;
            background: linear-gradient(90deg, rgba(253, 117, 69, 0.08) 2.24%, rgba(253, 117, 69, 0) 77.24%);
            border-radius: 4rpx;
        }
    }
}

.bar-class {
    position: relative;
    padding-left: 50rpx !important;
    &:before {
        content: ' ';
        position: absolute;
        left: 30rpx;
        top: 8rpx;
        bottom: 8rpx;
        display: block;
        width: 8rpx;
        border-radius: 8rpx;
        background: linear-gradient(180deg, #fe5b30 0%, #ffa40b 100%);
    }
}
.warn-text {
    padding-left: 28rpx;
    // font-size: 20rpx;
    color: #979797;
}
.bar-icon {
    margin-top: 48rpx;
    position: relative;

    &:before,
    &:after {
        content: ' ';
        position: absolute;
        top: 0;
        transform: translateY(-50%);
        display: block;
        width: 20rpx;
        height: 20rpx;
        border-radius: 20rpx;
        background: #ff7148;
    }
    &:before {
        left: -20rpx;
    }
    &:after {
        right: -20rpx;
    }
}
.btn-bar {
    padding-top: 40rpx;
    border-top: 1rpx dashed #e4e4e4;
    text-align: center;
    // font-size: 24rpx;

    &:after {
        content: ' ';
        margin-left: 16rpx;
        display: inline-block;
        width: 20rpx;
        height: 20rpx;
        border-top: 1px solid #333;
        border-right: 1px solid #333;
        transform: rotate(45deg);
    }
}
.no-open {
    overflow: hidden;
    image {
        margin: 196rpx auto 40rpx;
        display: block;
        width: 308rpx;
        height: 242rpx;
    }
    .no-open-text {
        margin-bottom: 10rpx;
        font-size: 30rpx;
        color: #aaa;
        text-align: center;
    }
}
</style>
