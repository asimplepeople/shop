<template>
    <view class="banner">
        <img src="../../assets/images/binding.png" alt="" />
    </view>
    <view class="form-box">
        <uni-forms ref="form" :model-value="data" :rules="rules">
            <view class="box">
                <uni-forms-item label-width="70" class="form-item" label="账号" name="userName">
                    <uni-easyinput
                        v-model="data.userName"
                        :input-border="false"
                        type="text"
                        maxlength="20"
                        placeholder="请输入齐商聚财账号"
                    />
                </uni-forms-item>
                <uni-forms-item label-width="70" class="form-item" label="密码" name="password">
                    <uni-easyinput
                        v-model="data.password"
                        :input-border="false"
                        type="password"
                        maxlength="20"
                        placeholder="请输入密码"
                    />
                </uni-forms-item>
                <uni-forms-item label-width="70" class="form-item" label="验证码" name="verifycode">
                    <view class="custom-uni-input">
                        <uni-easyinput
                            v-model="data.verifycode"
                            :input-border="false"
                            type="text"
                            maxlength="6"
                            placeholder="请输入验证码"
                        />
                        <view class="text-button" @click="sendMsgCode">
                            <img v-if="data.validimg" class="verification" :src="data.validimg" alt="" />
                        </view>
                    </view>
                </uni-forms-item>
            </view>
        </uni-forms>
        <button
            :class="btn.finish ? 'submit-btn disable-btn' : 'submit-btn finish-btn'"
            :style="btn.finish ? 'background-color: #e74642 !important;' : ''"
            type="primary"
            :disabled="btn.finish"
            @click="submit"
        >
            完成绑定
        </button>
        <view class="tips">齐商银行提供服务</view>
    </view>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getValidCode, bingdMerchant } from '../../services/merchantBinding';

// form表单实例
const form: any = ref(null);

const rules = reactive({
    userName: {
        rules: [{ required: true }, { maxlength: 20 }],
        label: '账号',
    },
    password: {
        rules: [{ required: true }, { maxlength: 20 }],
        label: '密码',
    },
    verifycode: {
        rules: [{ required: true }, { maxlength: 6 }],
        label: '验证码',
    },
});

const data = reactive({
    userName: '',
    verifycode: '',
    password: '',
    validimg: '',
});

const btn = reactive({
    finish: true,
});

const sendMsgCode = async () => {
    const res = await getValidCode();
    if (res) {
        const blob = new Blob([res], { type: 'image/jpg' });
        const imgSrc = window.URL.createObjectURL(blob);
        data.validimg = imgSrc;
    }
};

const submit = async () => {
    if (btn.finish) {
        return;
    }
    form.value.validate().then(async (ress: any) => {
        let url = `/spay/xiaowei/sppay-xiaowei-app-web/xiaowei/merchantAssociate/check?userName=${
            data.userName
        }&verifycode=${data.verifycode}&password=${data.password}&needPassword=${true}`;
        const res = await bingdMerchant(url, {
            userName: data.userName,
            verifycode: data.verifycode,
            password: data.password,
            needPassword: true,
        });
        if (res && res.success) {
            uni.redirectTo({
                url: `/pages/merchantBinding/result?isFollow=${res.obj.isFollow}`,
            });
        }
    });
};
watch(data, () => {
    if (data.userName && data.verifycode && data.password) {
        btn.finish = false;
    } else {
        btn.finish = true;
    }
});

onLoad(async () => {
    const res = await getValidCode();
    if (res) {
        const blob = new Blob([res], { type: 'image/jpg' });
        const imgSrc = window.URL.createObjectURL(blob);
        data.validimg = imgSrc;
    }
});
</script>
<style lang="scss" scoped>
@import '../../assets/css/form.scss';
.banner {
    img {
        width: 100%;
        height: 100%;
    }
}
.text-button {
    margin-right: 90rpx;
}
.verification {
    padding-top: 10rpx;
    width: 160rpx;
    height: 60rpx;
    img {
        width: 100%;
        height: 100%;
    }
}
.finish-btn {
    opacity: 1;
}
.disable-btn {
    opacity: 0.7 !important;
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
