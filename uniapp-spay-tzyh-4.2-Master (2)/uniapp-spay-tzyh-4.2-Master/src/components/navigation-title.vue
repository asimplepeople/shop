<template>
    <view class="bar-title">
        <view class="return" @click="goback">
            <img :src="returnImg" /><view class="name">
                {{ title }}
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import returnImg from '../assets/images/return.png';
import { exitApp } from '@/utils/MainUtils';

const props = defineProps({
    title: {
        type: String,
        required: false,
        default: '',
    },
});
const goback = () => {
    exitApp();
};
</script>
<style lang="scss" scoped>
.bar-title {
    background-color: $uni-color-base;
    line-height: 100rpx;
    .return {
        display: flex;
        align-items: center;
        padding-left: 40rpx;
        img {
            width: 20rpx;
            height: 36rpx;
        }
    }
    .name {
        font-size: 36rpx;
        color: #ffffff;
        margin-left: 30%;
    }
}
</style>
