<template>
    <view class="page">
        <template v-if="!isSuccess">
            <view class="box-item">
                <view class="info-row">
                    <view class="info-title">{{ payload.certType === '1' ? '法人/负责人' : '商户名称' }}</view>
                    <view class="info-value">{{ infoRef.name }}</view>
                </view>
                <view class="info-row">
                    <view class="info-title">证件类型</view>
                    <view class="info-value">{{ infoRef.idType }}</view>
                </view>
                <view class="info-row">
                    <view class="info-title">证件号码</view>
                    <view class="info-value">{{ infoRef.idCode }}</view>
                </view>
                <view class="info-time">
                    <view class="top-info">
                        <view class="info-title">证件有效期</view>
                        <view class="info-value">
                            <radio-group @change="({ detail }) => (infoRef.idExpiredType = detail.value)">
                                <label>
                                    <radio color="#64c4d9" :value="0" :checked="infoRef.idExpiredType === 0" />非长期
                                </label>
                                <label>
                                    <radio color="#64c4d9" :value="1" :checked="infoRef.idExpiredType === 1" />长期
                                </label>
                            </radio-group>
                        </view>
                    </view>
                    <view v-if="infoRef.idExpiredType !== 1" class="bottom-info" @click="calendar.open()">
                        <view class="expire-time">
                            <view>
                                <text>截止日期</text>
                                <text class="time-text">{{ infoRef.endTime }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="btn-box">
                <button @click="submit">提交</button>
            </view>
        </template>
        <view v-else class="success-box">
            <icon type="success" size="90" color="#64c4d9" />
            <view class="normal-title">上传成功</view>
            <view class="gray-title">商户证件上传成功，等待银行审核中</view>
            <button @click="complete">完成</button>
        </view>

        <uni-calendar ref="calendar" :insert="false" :lunar="true" @confirm="changeDate" />
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { submitImage, getCertInfo } from '@/services/expiredCertificates';
import { onLoad } from '@dcloudio/uni-app';
import { exitApp } from '@/utils/MainUtils';

let info = {};
let mchId = '';
const infoRef = ref({
    name: '',
    idType: '居民身份证',
    idCode: '',
    idExpiredType: 1,
    endTime: '-',
});
const isSuccess = ref(false);
const payload = JSON.parse(sessionStorage.getItem('expiredCertificates_params'));
const beforeSubmit = () => {
    if (info.name === '') {
        uni.showToast({
            icon: 'none',
            duration: 2000,
            title: '请输入名称',
        });
        return true;
    }
    if (info.idCode === '') {
        uni.showToast({
            icon: 'none',
            duration: 2000,
            title: '请输入证件号码',
        });
        return true;
    }
    if (info.idExpiredType !== 1 && (info.endTime === '-' || info.endTime === '')) {
        uni.showToast({
            icon: 'none',
            duration: 2000,
            title: '请选择证件有效期',
        });
        return true;
    }

    return false;
};
const submit = () => {
    if (beforeSubmit()) {
        return;
    }
    const params = {
        mchId,
        holderName: info.name,
        validityType: info.idExpiredType,
        idCode: info.idCode,
        ...payload,
    };
    if (info.idExpiredType === 0) {
        params.expiryDateEnd = info.endTime;
    }
    submitImage(params).then((res) => {
        if (res.result === '200') {
            console.log('===');
            isSuccess.value = true;
        }
    });
};
const calendar = ref();
const changeDate = (date) => {
    info.endTime = date.fulldate;
};
const complete = () => {
    exitApp();
};
onLoad((options) => {
    mchId = options.mchId;
    getCertInfo({
        certType: payload.certType,
        mchId,
    }).then((res) => {
        if (res.result === '200') {
            console.log(res);
            if (payload.certType === '1') {
                infoRef.value.name = res.message.holderName;
                infoRef.value.idCode = res.message.idCode;
                info = infoRef.value;
            } else {
                infoRef.value.idType = '营业执照';
                infoRef.value.name = res.message.holderName;
                infoRef.value.idCode = res.message.idCode;
                info = infoRef.value;
            }
        }
    });
});
</script>

<style lang="less" scoped>
.page {
    padding-bottom: 200rpx;
    min-height: 100vh;
    box-sizing: border-box;
    background: #f1f1f1;
    overflow: hidden;
    color: #333;

    button {
        height: 100rpx;
        line-height: 100rpx;
        font-size: 32rpx;
        color: #fff;
        background: #64c4d9;

        &:after {
            border: none;
        }
    }
}
.box-item {
    margin-top: 20rpx;
    padding: 0 30rpx;
    background: #fff;

    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 112rpx;
        line-height: 112rpx;
        border-bottom: 1rpx solid #f1f1f1;

        &:last-of-type {
            border: none;
        }
    }
    .info-title {
        font-size: 35rpx;
    }
    .uni-input {
        text-align: right;
    }
    .info-value {
        color: #aaa;

        radio {
            transform: scale(0.7);
        }
    }
    .info-time {
        padding: 30rpx 0;
        .top-info {
            display: flex;
            justify-content: space-between;
        }
        .bottom-info {
            margin-top: 30rpx;

            .expire-time {
                display: flex;
                flex-direction: row-reverse;
                color: #aaa;

                .time-text {
                    margin-left: 24rpx;
                    color: #333;

                    &.start-time-text {
                        margin-right: 24rpx;
                    }
                    &:after {
                        content: ' ';
                        margin-left: 16rpx;
                        display: inline-block;
                        width: 14rpx;
                        height: 14rpx;
                        border-top: 1px solid #aaa;
                        border-right: 1px solid #aaa;
                        transform: translateX(-6rpx) rotate(45deg);
                        vertical-align: middle;
                    }
                }
            }
        }
    }
}
.btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 30rpx 44rpx;
}
.success-box {
    margin-top: 120rpx;
    padding: 0 30rpx;
    text-align: center;

    icon {
        margin: 0 auto;
    }
    .normal-title {
        margin: 40rpx 0 20rpx;
        font-size: 40rpx;
        color: #000;
    }
    .gray-title {
        font-size: 30rpx;
        color: #aaa;
    }
    button {
        margin-top: 60rpx;
    }
}
</style>
