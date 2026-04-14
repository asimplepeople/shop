<template>
    <view class="flexCenter"> <img :src="data.isFollow ? success : fail" class="bingStateImg" /> </view>
    <view :class="data.isFollow ? 'flexCenter success' : 'flexCenter fail'">
        {{ data.isFollow ? '绑定成功' : '绑定失败' }}
    </view>
    <view class="flexCenter mark">
        {{ data.isFollow ? data.successText : data.faikText }}
    </view>
    <view class="tips">齐商银行提供服务</view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import success from '@/assets/images/bindSuccess.png';
import fail from '@/assets/images/bindFail.png';

const data = reactive({
    isFollow: false,
    successText: '绑定成功后，“齐商银行公众号”将及时推送您齐商聚财账号下的交易信息，请注意接收',
    faikText: ' 确认账号密码是否准确，请稍后重试或联系客户经理咨询',
});
onLoad((options) => {
    data.isFollow = options.isFollow as unknown as boolean;
    console.info(options);
});
</script>
<style lang="scss" scoped>
.flexCenter {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 400;
}
.flexCenter:first-child {
    padding-top: 190rpx;
}
.bingStateImg {
    width: 148rpx;
    height: 148rpx;
}
.success {
    letter-spacing: 0.01em;
    color: #67bf59;
    margin: 20rpx 0 60rpx 0;
}
.fail {
    letter-spacing: 0.01em;
    color: #f8a6a4;
    margin: 20rpx 0 60rpx 0;
}
.mark {
    padding: 0 78rpx;
    color: #979797;
}

.tips {
    position: absolute;
    bottom: 80rpx;
    left: 0;
    right: 0;
    text-align: center;
    font-weight: 400;
    font-size: 24rpx;
    color: #cccccc;
}
</style>
