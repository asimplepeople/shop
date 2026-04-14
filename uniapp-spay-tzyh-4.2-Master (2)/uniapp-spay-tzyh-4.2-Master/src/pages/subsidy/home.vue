<template>
    <view v-if="loading" />
    <view style="height: 100vh" v-else>
        <view v-if="noOpen" class="no-open">
            <img :src="img" />
            <view class="info-text">商户暂未开通此功能</view>
            <view> 可联系客户经理进行开通</view>
        </view>
        <view v-else class="relief-record">
            <view class="record-box">
                <view class="info-text m-t-22">已享用手续费减免金额(元)</view>
                <view class="used-price">{{ formatNumber(subsidy.subsidyUse) }}</view>
                <view class="validity-period">{{ subsidy.beginTime }} 至 {{ subsidy.endTime }}</view>
                <view class="amount-box">
                    <view class="amount-item">
                        <view>总额度(元)</view>
                        <view>{{ formatNumber(subsidy.subsidyTotal) }}</view>
                    </view>
                    <view class="amount-item">
                        <view>剩余额度(元)</view>
                        <view>{{ formatNumber(subsidy.subsidyRemain) }}</view>
                    </view>
                </view>
                <view class="history-record" @click="goList">
                    <text>历史记录</text>
                    <text class="arrow" />
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from 'vue';
import img from '@/assets/images/subsidy/no-open.png';
import { isOpenMchSubsidy } from '@/services/subsidy';

const data = reactive({
    mchId: '',
    noOpen: false,
    subsidy: {},
    img,
    loading: true,
});

const methods = {
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
    goList() {
        uni.navigateTo({ url: '/pages/subsidy/list?mchId=' + data.mchId });
    },
    async isOpenMchSubsidy({ mchId }) {
        const res = await isOpenMchSubsidy({ mchId });
        if (res.result === '200') {
            console.log(res);
            data.noOpen = res.message.useStatus === 2;
            data.subsidy = res.message;
            data.loading = false;
        }
    },
};

export default defineComponent({
    name: 'SubsidyHome',
    onLoad(option) {
        data.mchId = option.mchId;
        methods.isOpenMchSubsidy(option);
    },
    setup() {
        return {
            ...toRefs(data),
            ...methods,
        };
    },
});
</script>

<style scoped lang="scss">
.m-t-22 {
    margin-top: 22px;
}
.no-open {
    margin-top: 85px;
    text-align: center;
    font-size: 15px;
    color: #aaa;

    img {
        display: block;
        width: 154px;
        margin: 0 auto;
    }
    .info-text {
        margin-top: 24px;
    }
}
.relief-record {
    padding: 8px 15px;
    background: #f1f1f1;
    height: 100%;
    box-sizing: border-box;

    .record-box {
        text-align: center;
        background: #fff;
        overflow: hidden;

        .info-text {
            font-size: 12px;
            color: #aaa;
        }
        .used-price {
            margin: 15px 0;
            font-weight: 500;
            font-size: 40px;
            color: #333;
        }
        .validity-period {
            font-size: 12px;
            color: #aaa;
        }
        .amount-box {
            position: relative;
            display: flex;
            margin: 0 10px;
            padding: 22px 0;
            border-bottom: 1px dashed #e4e4e4;

            &:before,
            &:after {
                position: absolute;
                bottom: -5px;
                content: ' ';
                background: #f1f1f1;
                width: 10px;
                height: 10px;
                border-radius: 10px;
                z-index: 11;
            }
            &:before {
                left: -15px;
            }
            &:after {
                right: -15px;
            }

            .amount-item {
                flex: 1;
                &:first-of-type {
                    border-right: 1px solid #e4e4e4;
                }
            }
        }
        .history-record {
            margin: 21px auto;
            width: 100px;
            font-size: 12px;
            color: #aaa;

            .arrow {
                display: inline-block;
                margin-left: 6px;
                width: 6px;
                height: 6px;
                border: 1px solid #aaa;
                border-left: none;
                border-bottom: none;
                transform: translateY(-1px) rotate(45deg);
            }
        }
    }
}
</style>
