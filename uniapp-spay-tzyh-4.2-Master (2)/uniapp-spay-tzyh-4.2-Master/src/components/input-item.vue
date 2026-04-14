<template>
    <view :class="['input-item', error && 'input-error']">
        <view class="input-label" :style="labelWidth && 'width:' + labelWidth">
            <slot name="label">{{ label }}</slot>
        </view>
        <view class="input-content">
            <picker
                v-if="type === 'select'"
                :style="{ width: width }"
                class="form-select"
                :value="selectIndex"
                :range="selectData"
                @change="onChange"
            >
                <view class="uni-input">{{ selectData[selectIndex] }}</view>
            </picker>
            <input
                v-else
                :value="props.value"
                :type="type"
                :password="password"
                :style="{ width: width }"
                class="form-input"
                :maxlength="maxlength"
                :placeholder="placeholder"
                placeholder-style="color: #CCCCCC;"
                @input="onInput"
                @change="onChange"
                @blur="onBlur"
            />
            <view class="input-suffix">
                <slot name="suffix"></slot>
                <!-- <uni-icons type="forward" size="16" color="#ccc" /> -->
            </view>
        </view>
        <view v-if="border" class="input-border" />
    </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
const emit = defineEmits(['input', 'change', 'blur', 'update:value']);
const props = defineProps({
    // 名称
    name: {
        type: String,
        required: true,
        default: '',
    },
    // label文本
    label: {
        type: String,
        required: false,
        default: '',
    },
    // label宽度
    labelWidth: {
        type: String,
        required: false,
    },
    // 输入框占位
    placeholder: {
        type: String,
        required: false,
        default: '',
    },
    value: {
        type: String,
        required: false,
        default: '',
    },
    // 输入框类型
    type: {
        type: String,
        required: true,
        default: 'text',
    },
    // 输入框是否为密码域
    password: {
        type: Boolean,
        required: false,
        default: false,
    },
    // 下边框
    border: {
        type: Boolean,
        required: false,
        default: true,
    },
    // 输入框最大可输入长度
    maxlength: {
        type: Number,
        required: false,
        default: 140,
    },
    // 输入款宽度
    width: {
        type: String,
        required: false,
    },
    // select数据
    selectData: {
        type: Array,
        required: false,
        default: () => {
            return [];
        },
    },
    // select当前选中
    selectIndex: {
        type: Number,
        required: false,
        default: 0,
    },
    // 是否显示错误信息
    error: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const onChange = (e) => {
    emit('change', {
        name: props.name,
        value: e.detail.value,
    });
    // emit('update:value', e.detail.value);
};
const onInput = (e) => {
    // console.log(e.detail);
    emit('input', e);
    // console.log(emit('input', e));
    // emit('update:value', e.detail.value);
};
const onBlur = (e) => {
    emit('blur', e);
};
</script>

<style lang="scss" scoped>
.input-item {
    display: flex;
    align-items: center;
    position: relative;
    padding: 40rpx 30rpx;
    background-color: $uni-text-color-inverse;
    .input-label {
        font-size: $uni-font-size-sm;
        color: $uni-color-subtitle;
        flex: 0 1 220rpx;
    }
    .input-content {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        .form-input {
            font-size: $uni-font-size-sm;
            color: $uni-text-color;
            flex: 1 1;
        }
        .form-select {
            flex: 1 1;
            font-size: $uni-font-size-sm;
            color: $uni-text-color;
        }
    }
    .input-border {
        position: absolute;
        bottom: 0rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 690rpx;
        height: 1rpx;
        background-color: $uni-border-color;
    }
}
.input-error {
    .input-label {
        color: $uni-color-error;
    }
    .input-content {
        .form-input {
            color: $uni-color-error;
        }
    }
}
</style>
