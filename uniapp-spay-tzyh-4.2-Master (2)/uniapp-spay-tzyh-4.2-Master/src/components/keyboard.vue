<template>
    <view class="keyboard">
        <view v-if="props.src" class="top-img">
            <image :src="props.src" mode="heightFix" />
        </view>
        <view v-else class="top-back" />
        <view class="keyboardFlex">
            <view class="keyboardFlexItem">
                <view class="flex">
                    <view
                        v-for="(item, index) in numberArr"
                        :key="index"
                        :class="
                            'flexItem text-center' +
                            (item.val == '0' ? ' flexItem2' : '') +
                            (((index + 1) % 3 === 0 || item.val === '.') ? ' flexItem3' : '')
                        "
                        @click="onHandleInput(item.val)"
                    >
                        {{ item?.val }}
                    </view>
                </view>
            </view>
            <view class="keyboardFlexCo keyboardFlexItem">
                <view class="deleteBtn text-center" @click="deleteClick">
                    <!-- #ifndef MP-WEIXIN -->
                    <image class="delete" mode="widthFix" :src="deleteLogo" />
                    <!-- #endif -->
                    <!-- #ifndef H5 -->
                    <image class="delete" mode="widthFix" :src="deleteLogo" :style="{ marginBottom: '0' }" />
                    <!-- #endif -->
                </view>
                <view
                    :class="'confirmBtn text-center font-size-32' + (data?.isClick ? '' : ' disabled')"
                    @click="onConfirm"
                    >{{ confirmText || '确认' }}</view
                >
            </view>
        </view>
        <view class="cover-color" />
    </view>
</template>

<script setup lang="ts">
import { defineProps, reactive, onMounted, defineEmits } from 'vue';
import deleteLogo from '../assets/images/payment/del.png';
// const platform = uni.getSystemInfoSync();
// console.log(platform);

// 组件对外方法
const emit = defineEmits(['change', 'confirm']);

const numberArr = [
    {
        type: 'money',
        val: '1',
    },
    {
        type: 'money',
        val: '2',
    },
    {
        type: 'money',
        val: '3',
    },
    {
        type: 'money',
        val: '4',
    },
    {
        type: 'money',
        val: '5',
    },
    {
        type: 'money',
        val: '6',
    },
    {
        type: 'money',
        val: '7',
    },
    {
        type: 'money',
        val: '8',
    },
    {
        type: 'money',
        val: '9',
    },
    {
        type: 'money',
        val: '0',
    },
    {
        type: 'money',
        val: '.',
    },
];
type dataType = {
    value: string;
    isClick: boolean;
};

const data: dataType = reactive({
    value: '',
    isClick: false,
});

const props = defineProps({
    confirmText: {
        type: String,
        required: false,
        default: '确认',
    },
    value: {
        type: String,
        required: false,
        default: '',
    },
    currentEnv: {
        type: String,
        required: false,
        default: '',
    },
    src: {
        type: String,
        required: false,
        default: '',
    },
    canInput: {
        type: Boolean,
        required: false,
        default: true,
    },
});

onMounted(() => {
    const { value } = props;
    if (value) {
        data.value = value;
        data.isClick = true;
    }
});

// onUpdated((prev: object) => {
//     if (prev.value != props.value) {
//         data.value = prev.value;
//         data.isClick = true;
//     }
// });

/**
 * 点击删除
 */
const deleteClick = () => {
    if (props.value) return;
    const { value } = data;
    let result = value;
    if (value.length > 0) result = result.substring(0, result.length - 1);
    const lens = result?.length;
    data.value = result;
    data.isClick = lens && result.substring(lens - 1, lens) != '.' ? true : false;
    emit('change', result);
};

/**
 * 数字输入
 */
const onHandleInput = (val) => {
    const { value } = data;
    if (!props.canInput) return;
    const reg = /^(([1-9][\d]{0,5}|0)(\.[\d]{0,2})?)$/;
    let result = value + '' + val;
    if (!reg.test(result) && result != '') {
        if (/^0/.test(result) && !/^0\./.test(result)) result = result.substring(1);
        if (result == '.') result = '';
        const arr = result.split('.');
        if (arr.length > 2) {
            result = '';
        } else {
            if (arr[0].length > 6) {
                arr[0] = arr[0].substring(0, 6);
            }
            arr.forEach((item, index) => {
                if (index == 1) {
                    result = result + '.' + item.replace(/\D/g, '').substring(0, 2);
                } else {
                    result = item.replace(/\D/g, '');
                }
            });
        }
    }
    const lens = result?.length;
    data.value = result;
    data.isClick = lens && result.substring(lens - 1, lens) != '.' ? true : false;
    emit('change', result);
};

/**
 * 点击支付按钮
 */
const onConfirm = (e) => {
    e.stopPropagation();
    if (data.isClick) emit('confirm');
};
</script>

<style lang="scss" scoped>
.keyboard {
    background-color: $uni-border-color;
    height: 616rpx;
    // overflow: hidden;
    position: fixed;
    width: 750rpx;
    bottom: 0;
    left: 0;
    padding: 0;
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
    .cover-color {
        z-index: 0;
        height: 100rpx;
        bottom: -100rpx;
        position: absolute;
        width: 750rpx;
        border-top: 1px solid $uni-border-color;
        left: 0;
        background-color: $uni-bg-color-inverse;
    }
    .top-back {
        background-color: $uni-bg-color;
        height: 66rpx;
    }
    .top-img {
        background-color: $uni-bg-color-inverse;
        height: 64rpx;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
        margin-bottom: 2rpx;
        image {
            margin-top: 12rpx;
            height: 40rpx;
            width: auto;
        }
    }
    .keyboardFlex {
        display: flex;
        flex-flow: row wrap;
        // border-bottom: 1px solid $uni-border-color;
        .keyboardFlexCo {
            flex: 0 1 0.25;
        }
        .keyboardFlexItem {
            flex: 1 1;
        }
    }
    .flex {
        width: 562rpx;
        justify-content: flex-start;
        display: flex;
        flex-flow: row wrap;
        // justify-content: space-between;
        .flexItem {
            background-color: $uni-bg-color-inverse;
            font-size: 60rpx;
            border-radius: 0;
            margin-bottom: 2rpx;
            margin-left: 2rpx;
            flex: 0 1 185rpx;
            height: 136rpx;
            line-height: 136rpx;
            color: $uni-text-color;
        }
        .flexItem3 {
            flex: 0 1 184rpx;
            margin-left: 3rpx;
        }
        .flexItem2 {
            /*  #ifdef MP-WEIXIN  */
            flex: 0 1 370rpx;
            /*  #endif  */
            /*  #ifdef H5  */
            flex: 0 1 372rpx;
            /*  #endif  */
        }
        .flexColumn2 {
            height: 320rpx;
        }
    }
    .deleteBtn,
    .confirmBtn {
        margin-bottom: 16rpx;
        border-radius: 0;
        width: 100%;
        margin-left: -4rpx;
        font-size: 40rpx;
    }
    .text-center {
        text-align: center;
    }
    .deleteBtn {
        background-color: $uni-bg-color-inverse;
        height: 136rpx;
        line-height: 136rpx;
        margin-bottom: 0rpx;
        /*  #ifdef MP-WEIXIN  */
        margin-left: -1rpx;
        /*  #endif  */
        /*  #ifdef H5  */
        margin-left: 1rpx;
        /*  #endif  */
        .delete {
            width: 50rpx;
            height: 36rpx;
            line-height: 36rpx;
            margin-bottom: -10rpx;
        }
        image {
            pointer-events: none;
            width: 30rpx;
            height: 20rpx;
        }
    }
    .confirmBtn {
        /*  #ifdef MP-WEIXIN  */
        margin-left: -1rpx;
        /*  #endif  */
        /*  #ifdef H5  */
        margin-left: 1rpx;
        /*  #endif  */
        background-color: $uni-color-base;
        color: $uni-text-color-inverse;
        height: 414rpx;
        line-height: 414rpx;
    }
    .disabled {
        /*  #ifdef CDRCB */
        background-color: $uni-text-color-disable;
        /*  #endif  */
        /*  #ifndef CDRCB */
        background-color: $uni-color-base;
        opacity: 0.6;
        /*  #endif  */
    }
}
</style>
