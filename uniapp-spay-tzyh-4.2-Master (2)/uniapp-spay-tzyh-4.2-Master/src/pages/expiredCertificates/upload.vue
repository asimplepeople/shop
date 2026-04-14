<template>
    <view class="page">
        <view class="warn-text">
            <text>请务必保证您上传的图片真实有效</text>
            <text v-if="false" class="example">查看范例</text>
        </view>
        <view class="upload-list">
            <view v-for="item in uploadList" :key="item.type" class="upload-item" @click="chooseImg(item.type)">
                <image :src="item.img" />
            </view>
        </view>
        <view class="btn-box">
            <button @click="next">下一步</button>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import idFrontImg from '@/assets/images/expiredCertificates/id-front.png';
import idBackImg from '@/assets/images/expiredCertificates/id-back.png';
import licenseImg from '@/assets/images/expiredCertificates/license.png';
import { uploadImage } from '@/services/expiredCertificates';
import { imgChangeBase64 } from '@/utils/ImagesUtils';
import { onLoad } from '@dcloudio/uni-app';

let options = {};
const uploadList = ref([
    {
        img: idFrontImg,
        type: 'base64Img2', //人像面照片base64
    },
    {
        img: idBackImg,
        type: 'base64Img3', //国徽面照片base64
    },
    {
        img: licenseImg,
        type: 'base64Img1', //营业执照图片base64
    },
]);
const imgText = {
    base64Img1: '营业执照图片',
    base64Img2: '国徽面照片',
    base64Img3: '人像面照片',
};
const uploadObj = {};
const chooseImg = (type) => {
    uni.chooseImage({
        count: 1,
        success({ tempFiles, tempFilePaths }) {
            const file = tempFiles[0];
            imgChangeBase64(file, tempFilePaths[0]).then((base64String) => {
                const base64Img = (base64String as string).split(',')[1];
                uploadImage({ base64Img }).then((res) => {
                    if (res.result === '200') {
                        uploadObj[type] = res.message.imgPath1;
                        uploadList.value.find((item) => item.type === type).img = tempFilePaths[0];
                        uni.showToast({
                            icon: 'none',
                            title: '上传成功',
                            duration: 1000,
                        });
                    }
                });
            });
        },
        fail(err) {
            console.log(err);
            uni.showToast({
                icon: 'none',
                duration: 3000,
                title: err,
            });
        },
    });
};

const next = () => {
    const isNullKey = Object.keys(uploadObj).find((key) => uploadObj[key] === '');
    if (isNullKey) {
        console.log(uploadObj, 'uploadObj', isNullKey);
        uni.showToast({
            icon: 'none',
            title: '请上传' + imgText[isNullKey],
            duration: 3000,
        });
        return;
    }
    const payload = {};
    if (options.certType === '1') {
        payload.idsFrontPhoto = uploadObj.base64Img2;
        payload.idsReversePhoto = uploadObj.base64Img3;
    } else {
        payload.businessLicensePhoto = uploadObj.base64Img1;
    }
    sessionStorage.setItem(
        'expiredCertificates_params',
        JSON.stringify({
            certType: options.certType,
            ...payload,
        })
    );
    uni.navigateTo({ url: '/pages/expiredCertificates/certificates-info?mchId=' + options.mchId });
};
onLoad((o) => {
    options = o;
    if (o.certType === '1') {
        uploadList.value = uploadList.value.filter((item) => item.type !== 'base64Img1');
    } else {
        uploadList.value = uploadList.value.filter((item) => item.type === 'base64Img1');
    }
    uploadList.value.forEach((item) => (uploadObj[item.type] = ''));
});
</script>
<style lang="less" scoped>
.page {
    padding-bottom: 200rpx;
    min-height: 100vh;
    box-sizing: border-box;
    background: #fff;
}
.warn-text {
    padding: 40rpx 0;
    font-size: 26rpx;
    color: #666;
    text-align: center;

    .example {
        margin-left: 30rpx;
        color: #64c4d9;
    }
}
.upload-list {
    .upload-item {
        margin-bottom: 40rpx;

        image {
            margin: 0 auto;
            display: block;
            width: 560rpx;
            height: 340rpx;
        }
    }
}
.btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 30rpx 44rpx;

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
</style>
