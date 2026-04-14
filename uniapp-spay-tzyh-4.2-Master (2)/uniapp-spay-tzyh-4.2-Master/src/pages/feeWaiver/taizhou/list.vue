<template>
    <view class="page">
        <view v-if="!noOpen" class="content">
            <view v-if="false" class="date-picker" @click="open">
                <text>{{ date.startTime }} - {{ date.endTime }}</text>
                <img :src="dateImg" />
                <text class="arrow-down" />
            </view>
            <scroll-view v-if="listData.list.length > 0" class="scroll-box" scroll-y>
                <view v-for="(item, i) in listData.list" :key="i" class="list-item">
                    <view class="top-time">{{ item.discountMonth }}</view>
                    <view class="bottom-detail">
                        <view class="detail-item">
                            <view class="money">{{ item.commissionFeeTotal / 100 }}</view>
                            <view class="title">应付手续费(元)</view>
                        </view>
                        <view class="detail-item">
                            <view class="money">{{ item.amounyUsed / 100 }}</view>
                            <view class="title">减免手续费(元)</view>
                        </view>
                        <view class="detail-item">
                            <view class="money">{{ (item.commissionFeeTotal - item.amounyUsed) / 100 }}</view>
                            <view class="title">实付手续费(元)</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <view v-else class="no-data-box">
                <img :src="noData" />
                <view>暂无手续费减免记录</view>
            </view>
            <!--  date-picker   -->
            <uni-calendar
                ref="calendarRef"
                class="uni-calendar--hook"
                :clear-date="false"
                :insert="date.insert"
                :lunar="date.lunar"
                :range="date.range"
                @confirm="confirm"
            />
        </view>
        <view v-else class="no-open">
            <image :src="noOpenImg" />
            <view class="no-open-text">商户暂未开通此功能</view>
            <view class="no-open-text">可联系客户经理进行开通</view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { dateformat } from '@/utils/DateUtils';
import noOpenImg from '@/assets/images/subsidy/no-open.png';
import dateImg from '@/assets/images/subsidy/date.png';
import noData from '@/assets/images/subsidy/no-data.png';
import { getFeeDeductionDetail } from '@/services/feeWaiver';

const today = dateformat(new Date(new Date().valueOf() - 3 * 30 * 24 * 60 * 60 * 1000), 'YYYY.MM.DD');
const endDay = dateformat(new Date(), 'YYYY.MM.DD');

const noOpen = ref(false);
const listData = ref({
    list: [],
    page: 1,
    total: 0,
});
const date = ref({
    startTime: today,
    endTime: endDay,
    lunar: true,
    range: true,
    insert: false,
});
const query = ref({
    mchId: '',
    activityId: '',
    skey: '',
    sauthid: '',
});
const getList = async () => {
    const authInfo = {
        'SKEY':query.value.skey,
        'SAUTHID':query.value.sauthid
    }
    const res = await getFeeDeductionDetail(authInfo, {
            mchId: query.value.mchId
        }).catch((err) => err);
    if (res.result === '200') {
        console.log(res);
        listData.value.list = listData.value.list.concat(res.message || []);
    }
};
const calendarRef = ref();
const open = () => calendarRef.value.open();
const confirm = (e) => {
    const { before, after } = e.range;
    const _date = e.fulldate.split('-').join('.');
    let startTime, endTime;

    if (before === '' || after === '') {
        startTime = _date;
        endTime = _date;
    } else {
        const bNum = before.split('-').join('');
        const aNum = after.split('-').join('');
        console.log(bNum, aNum);
        const startDate = bNum < aNum ? before : after;
        const endDate = bNum < aNum ? after : before;

        startTime = startDate.split('-').join('.');
        endTime = endDate.split('-').join('.');
    }

    date.value.startTime = startTime;
    date.value.endTime = endTime;
    listData.value.page = 1;
    listData.value.list = [];
    getList();
};

onLoad((options) => {
    console.log(options);
    query.value = options;
    getList();
});
</script>
<style lang="less" scoped>
.page {
    min-height: 100vh;
    padding: 60rpx 30rpx 0;
    background: #f1f1f1;
}
.content {
    overflow: hidden;
}
.date-picker {
    margin: 20px 0;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #333;
    text-align: center;

    img {
        display: inline-block;
        width: 14px;
        margin: 0 8px;
    }
    .arrow-down {
        display: inline-block;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: #64c4d9 transparent transparent transparent;
        vertical-align: -3px;
    }
}
.scroll-box {
    .list-item {
        margin-bottom: 16rpx;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;

        .top-time {
            font-size: 28rpx;
            line-height: 72rpx;
            color: #fff;
            text-align: center;
            background: #64c4d9;
        }
        .bottom-detail {
            display: flex;
            align-items: center;

            .detail-item {
                flex: 1;
                margin: 30rpx 0;
                padding: 0 9rpx;
                border-right: 1px solid #e4e4e4;
                text-align: center;
                font-size: 24rpx;
                color: #adadad;

                &:last-of-type {
                    border: none;
                }
                .money {
                    font-size: 36rpx;
                    color: #333;
                }
                .title {
                    margin-top: 16rpx;
                }
            }
        }
    }
}
.no-data-box {
    text-align: center;
    font-size: 15px;
    color: #aaa;

    img {
        margin: 85px auto 25px;
        display: block;
        width: 154px;
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
