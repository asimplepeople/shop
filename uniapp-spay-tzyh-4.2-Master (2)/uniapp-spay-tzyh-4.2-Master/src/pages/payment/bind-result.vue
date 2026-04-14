<template>
    <div class="result">
        <div class="icon">
            <uni-icons
                :type="data.status === 'success' ? 'checkbox-filled' : 'clear'"
                :color="data.status === 'success' ? '#74BC69' : '#F8A6A4'"
                size="60"
            />
        </div>
        <div :class="['title', data.status]">{{ data.status === 'success' ? '绑卡成功' : '绑卡失败' }}</div>
        <div v-if="data.status === 'fail'" class="message">
            <div>失败原因</div>
            <div>{{ data.message }}</div>
        </div>
        <footer-button
            v-if="data.status === 'fail'"
            class="fixed-bottom"
            theme="solid"
            text="再试一次"
            type="primary"
            @click="tryAgain"
        />
    </div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import FooterButton from '../../components/footer-button.vue';

const data = reactive({
    status: 'fail',
    message: '',
});

onLoad((options) => {
    console.log(options);
    const status = options.status || 'fail';
    const message = options.message || '';
    uni.setNavigationBarTitle({
        title: status === 'success' ? '绑卡成功' : '绑卡失败',
    });
    data.status = status;
    data.message = message;
    if (status === 'success') {
        setTimeout(() => {
            uni.navigateBack({
                delta: 2,
                success: () => {
                    // 调用回调事件
                    uni.$emit('bindCardFinish');
                },
            });
        }, 1000);
    }
});
// 再试一次
const tryAgain = () => {
    // 回到绑卡流程起点
    uni.navigateBack({ delta: 1 });
};
</script>

<style lang="scss" scoped>
.result {
    height: 100vh;
    background-color: #f9f9f9;
    .icon {
        display: flex;
        padding-top: 140rpx;
        align-items: center;
        justify-content: center;
    }
    .title {
        margin-top: 42rpx;
        color: $uni-text-color-dark-grey;
        text-align: center;
        font-size: $uni-font-size-sm;
        &.success {
            color: #01a763;
        }
        &.fail {
            color: #f8a6a4;
        }
    }
    .message {
        text-align: center;
        margin: 40rpx auto 0;
        width: 386rpx;
        color: $uni-color-subtitle;
        font-size: $uni-font-size-min;
    }
    .fixed-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
</style>
