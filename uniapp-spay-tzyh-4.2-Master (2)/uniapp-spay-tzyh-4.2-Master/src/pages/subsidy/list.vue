<template>
    <view class="page">
        <view class="date-picker" @click="open">
            <text>{{ info.startDate }} - {{ info.endDate }}</text>
            <img :src="img" />
            <text class="arrow-down" />
        </view>
        <uni-calendar
            ref="calendar"
            class="uni-calendar--hook"
            :clear-date="false"
            :insert="info.insert"
            :lunar="info.lunar"
            :range="info.range"
            @confirm="confirm"
            @close="close"
        />
        <scroll-view class="scroll-box" scroll-y @scrolltolower="loadMore" v-if="!listIsNull">
            <view v-for="(item, i) in list" :key="i" class="list-item-box">
                <view class="item-left">
                    <view class="info-text">总额度</view>
                    <view class="price">¥ {{ formatNumber(item.subsidyTotal) }}</view>
                    <view class="info-text"
                        >{{ item.beginTime.split('-').join('.') }} - {{ item.endTime.split('-').join('.') }}</view
                    >
                </view>
                <view class="item-right">
                    <view class="info-text">已用</view>
                    <view class="price">¥ {{ formatNumber(item.subsidyUse) }}</view>
                    <view class="info-text">剩余: ¥ {{ formatNumber(item.subsidyRemain) }}</view>
                </view>
            </view>
        </scroll-view>
        <view class="no-data-box" v-else>
            <img :src="noData" />
            <view>暂无手续费减免记录</view>
        </view>
    </view>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from 'vue';
import img from '@/assets/images/subsidy/date.png';
import noData from '@/assets/images/subsidy/no-data.png';
import { dateformat } from '@/utils/DateUtils';
import { queryHisSubsidyList } from '@/services/subsidy';

const today = dateformat(new Date(new Date().valueOf() - 3 * 30 * 24 * 60 * 60 * 1000), 'YYYY.MM.DD');
const endDay = dateformat(new Date(), 'YYYY.MM.DD');
let data, methods;

export default defineComponent({
    name: 'SubsidyList',
    onLoad(option) {
        data.mchId = option.mchId;
        methods.queryHisSubsidyList();
    },
    setup() {
        data = reactive({
            mchId: '',
            img,
            noData,
            listIsNull: false,
            list: [],
            page: 1,
            total: 0,
            info: {
                lunar: true,
                range: true,
                insert: false,
                startDate: today,
                endDate: endDay,
            },
        });

        methods = {
            formatNumber(val) {
                const v = Number(val).toLocaleString();
                const num = v.split('.')[1];
                if (num) {
                    if (num.length === 1) {
                        return v + '0';
                    } else {
                        return v;
                    }
                } else {
                    return v + '.00';
                }
            },
            async queryHisSubsidyList() {
                const res = await queryHisSubsidyList({
                    beginTime: data.info.startDate.split('.').join('-') + ' 00:00:00',
                    endTime: data.info.endDate.split('.').join('-') + ' 23:59:59',
                    mchId: data.mchId,
                    pageNum: data.page,
                    pageSize: 20,
                }).catch((err) => err);
                if (res.result === '200') {
                    console.log(res);
                    data.total = res.message.total;
                    data.list = data.list.concat(res.message.rows || []);
                }
                console.log(data.list, data.list.length);
                data.listIsNull = data.list.length < 1;
            },
            loadMore() {
                if (data.total > data.list.length) {
                    data.page += 1;
                    methods.queryHisSubsidyList();
                }
                console.log('loadMore');
            },
            confirm(e) {
                console.log('confirm 返回:', e);
                const { before, after } = e.range;
                const date = e.fulldate.split('-').join('.');

                if (before === '' || after === '') {
                    data.info.startDate = date;
                    data.info.endDate = date;
                } else {
                    const bNum = before.split('-').join('');
                    const aNum = after.split('-').join('');
                    console.log(bNum, aNum);
                    const startDate = bNum < aNum ? before : after;
                    const endDate = bNum < aNum ? after : before;

                    data.info.startDate = startDate.split('-').join('.');
                    data.info.endDate = endDate.split('-').join('.');
                }

                data.page = 1;
                data.list = [];
                methods.queryHisSubsidyList();
            },
            close() {
                console.log('弹窗关闭');
            },
        };

        return {
            ...toRefs(data),
            ...methods,
        };
    },
    methods: {
        open() {
            this.$refs.calendar.open();
        },
    },
});
</script>

<style scoped lang="scss">
.page {
    background: #f1f1f1;
    height: 100vh;
    overflow: hidden;

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
            border-color: #3f73f2 transparent transparent transparent;
            vertical-align: -3px;
        }
    }
    .scroll-box {
        padding: 0 15px;
        box-sizing: border-box;
        background: #fff;
        height: calc(100vh - 60px);
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
.list-item-box {
    display: flex;
    justify-content: space-between;
    height: 85px;
    padding: 12px 0;
    overflow: hidden;
    border-bottom: 1px solid #e4e4e4;
    box-sizing: border-box;

    &:last-of-type {
        border: none;
    }
    .item-right {
        text-align: right;
    }
    .info-text {
        font-size: 12px;
        color: #aaa;
    }
    .price {
        margin: 5px 0;
        font-weight: 500;
        font-size: 17px;
        color: #333;
    }
}
</style>
