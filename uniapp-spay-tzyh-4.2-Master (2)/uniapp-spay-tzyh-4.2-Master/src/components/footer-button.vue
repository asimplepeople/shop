<template>
    <view :class="['footer-button', className]">
        <!-- 同意协议 -->
        <view v-if="showAgreenment" class="agreenment" @click="agreen">
            <uni-icons
                class="agreenment-icon"
                :type="data.isAgreen ? 'checkbox-filled' : 'circle'"
                :color="data.isAgreen ? '#01A763' : '#CCCCCC'"
                size="20"
            />
            我已阅读并同意<text @click.prevent="agreementClick">《服务协议》</text>
        </view>
        <!-- 按钮 -->
        <button
            :disabled="btnDisabled"
            :class="['confrim', circle && 'circle', theme, btnDisabled && 'disabled']"
            :type="type"
            :plain="plain"
            @click="btnClick"
        >
            {{ text }}
        </button>
        <view v-if="platform === 'ios'" class="cover-color" />
    </view>
</template>

<script setup lang="ts">
import { reactive, computed, defineProps, defineEmits } from 'vue';
const platform = uni.getSystemInfoSync().platform;
console.info(platform);
// 组件属性
const props = defineProps({
    // 按钮文案
    text: {
        type: String,
        required: true,
        default: '确认',
    },
    // 圆角按钮
    circle: {
        type: Boolean,
        required: false,
        default: false,
    },
    // 按钮禁用
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    // 显示协议选择
    showAgreenment: {
        type: Boolean,
        required: false,
        default: false,
    },
    // 按钮主题背景
    // theme: {
    //     type: String,
    //     required: false,
    //     default: 'light', // light 浅色背景， solid 深色背景
    // },
    // 按钮类型
    type: {
        type: String,
        required: false,
        default: '',
    },
    // 按钮是否镂空
    plain: {
        type: Boolean,
        required: false,
        default: false,
    },
    className: {
        type: String,
        required: false,
        default: '',
    },
});

// 组件对外方法
const emit = defineEmits(['click', 'agreenClick']);

type dataType = {
    isAgreen: Boolean;
};
// 组件state
const data: dataType = reactive({
    isAgreen: false,
});

// 同意协议
const agreen = () => {
    data.isAgreen = !data.isAgreen;
};

// 按钮禁用
const btnDisabled = computed(() => {
    if (props.showAgreenment) {
        if (data.isAgreen) {
            return false;
        } else {
            return true;
        }
    }
    return props.disabled;
});

// 按钮点击
const btnClick = (e) => {
    if (btnDisabled.value) {
        return;
    } else {
        emit('click', data.isAgreen, e);
    }
};
// 显示协议
const agreementClick = (e) => {
    if (props.showAgreenment) {
        emit('agreenClick', e);
    }
};
</script>

<style lang="scss" scoped>
.footer-button {
    box-sizing: border-box;
    width: 100%;
    padding: 36rpx 40rpx;
    background-color: $uni-bg-color-inverse;
    .agreenment {
        display: flex;
        align-items: center;
        color: $uni-text-color-active;
        font-size: $uni-font-size-min;
        margin-bottom: 40rpx;
        &-icon {
            margin-right: 10rpx;
        }
    }
    .confrim {
        height: 112rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $uni-font-size-base;
        // border: 1rpx solid $uni-color-base;
        outline: none;
        border-radius: $uni-border-radius-lg;
    }
    .light {
        background-color: $uni-text-color-inverse;
        color: $uni-color-base;
        &.disabled {
            background-color: $uni-text-color-inverse;
            color: $uni-color-base;
        }
    }
    .disabled {
        opacity: 0.6;
    }
    .solid {
        background-color: $uni-color-base;
        color: $uni-text-color-inverse;
        &.disabled {
            background-color: $uni-color-base;
            color: $uni-text-color-inverse;
        }
    }
    .circle {
        border-radius: 56rpx;
    }
    .cover-color {
        height: 0;
        height: constant(safe-area-inset-bottom);
        height: env(safe-area-inset-bottom);
        background-color: $uni-bg-color-inverse;
    }
}
</style>
