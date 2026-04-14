<template>
    <view v-if="type === 'normal'" :class="['upload-image-normal', disabled && 'disabled']">
        <view v-if="state.imageUrl" class="image-box">
            <image mode="widthFix" class="img" :src="state.imageUrl" @click="preview" />
            <uni-icons
                v-if="!disabled"
                class="upload-image-close"
                type="close"
                size="16"
                color="#999999"
                @click="deleteImage"
            />
        </view>
        <view
            v-else
            :class="['upload-image-box', isVaild && 'error']"
            :style="{ backgroundImage: `url(${bgImg})` }"
            @click="select"
        >
            <text>{{ tip }}</text>
            <text v-if="isVaild" class="error-tip">请上传{{ tip }}</text>
        </view>
    </view>
    <view
        v-else
        :class="['upload-image-certificate', disabled && 'disabled']"
        :style="{ 'justify-content': position === 'right' ? 'flex-end' : 'flex-start' }"
    >
        <view v-if="state.imageUrl" class="image-box">
            <image mode="widthFix" class="img" :src="state.imageUrl" @click="preview" />
            <uni-icons
                v-if="!disabled"
                class="upload-image-close"
                type="close"
                size="16"
                color="#999999"
                @click="deleteImage"
            />
        </view>
        <view
            v-else
            :class="['upload-image-box', isVaild && 'error']"
            :style="{ backgroundImage: `url(${bgImg})` }"
            @click="select"
        >
            <uni-icons type="camera" size="32" :color="isVaild ? '#f29e99' : '#1D2C4E'" />
            <view class="tip">{{ tip }}</view>
            <text v-if="isVaild" class="error-tip">请上传{{ tip }}</text>
        </view>
    </view>
    <view v-if="state.isPreview" class="upload-image-preview" @click="closePreview">
        <movable-area class="image-view-area">
            <movable-view class="image-view-view" :scale="true" direction="all">
                <image mode="widthFix" class="img" :src="state.imageUrl" />
            </movable-view>
        </movable-area>
    </view>
</template>

<script setup lang="ts">
import { reactive, watch, computed, onBeforeMount, defineProps, defineEmits } from 'vue';
import { useStore } from 'vuex';
import { resultType } from '../types';
import { singleImgUploadApi } from '../services/register';
import { imgChangeBase64 } from '../utils/ImagesUtils';
// import { setBase64ImgStorage, getBase64ImgStorage, removeBase64ImgStorage } from '../utils/Storage';

const props = defineProps({
    // 上传图片组件
    type: {
        type: String,
        required: false,
        default: 'normal', // normal 通用， certificate 证书
    },
    // 绑定值
    value: {
        type: String,
        required: false,
        default: '',
    },
    // 上传提示
    tip: {
        type: String,
        required: false,
        default: '上传图片',
    },
    // 选择个数，最大9
    count: {
        type: Number,
        required: false,
        default: 1,
    },
    position: {
        type: String,
        required: false,
        default: 'left', // type certificate 生效，left 居左 right 居右
    },
    bgImg: {
        type: String,
        required: false,
        default: '',
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    // 是否校验上传
    vaild: {
        type: Boolean,
        required: false,
        default: false,
    },
    // 是否上传，默认上传
    isUpload: {
        type: Boolean,
        required: false,
        default: true,
    },
    // 需缓存字段
    storageField: {
        type: String,
        required: false,
        default: '',
    },
    // 是否读取缓存图片
    readCache: {
        type: Boolean,
        required: false,
        default: true,
    },
});

// 组件对外方法
const emit = defineEmits(['select', 'delete', 'success', 'update:value', 'click']);

const store = useStore();
const state = reactive({
    imageUrl: props.value,
    isPreview: false,
});

// 是否验证图片为空
const isVaild = computed(() => props.vaild && !state.imageUrl);

/**
 * 上传接口
 * @param fileRes 文件
 */
const uploadApi = async (fileRes: any) => {
    state.imageUrl = fileRes.tempFilePaths[0];
    const base64Img = await imgChangeBase64(fileRes.tempFiles[0], fileRes.tempFilePaths[0]);
    if (props.isUpload) {
        const res: resultType = await singleImgUploadApi({
            base64Img,
            token: store.state.merchantStore.token,
        });
        const { result, message } = res;
        uni.showToast({
            icon: 'none',
            title: result === '200' ? '上传成功' : message,
        });
        if (result === '200') {
            emit('update:value', base64Img);
            // setBase64ImgStorage(props.storageField, base64Img);
            store.dispatch('setBase64Imgs', {
                [props.storageField]: base64Img,
            });
            emit('success', {
                imgId: message.imgPath,
                base64Img,
            });
        }
    } else {
        emit('update:value', base64Img);
        // setBase64ImgStorage(props.storageField, base64Img);
        store.dispatch('setBase64Imgs', {
            [props.storageField]: base64Img,
        });
        emit('success', {
            base64Img,
        });
    }
};

/**
 * 选择文件
 */
const select = () => {
    emit('click');
    if (props.disabled) return;
    uni.chooseImage({
        count: props.count,
        success: (res) => {
            emit('select', res);
            console.log('chooseImage', res);
            uploadApi(res);
        },
        fail: (err) => {
            console.log('err', err);
        },
    });
};

/**
 * 删除图片
 */
const deleteImage = () => {
    emit('update:value', '');
    // setBase64ImgStorage(props.storageField, '');
    store.dispatch('setBase64Imgs', {
        [props.storageField]: '',
    });
    emit('delete');
    state.imageUrl = '';
};

/**
 * 预览图片
 */
const preview = () => {
    state.isPreview = true;
};

/**
 * 关闭预览
 */
const closePreview = () => {
    state.isPreview = false;
};

/**
 * 读取缓存
 */
const readCacheFn = () => {
    if (props.readCache && props.storageField) {
        // const img = getBase64ImgStorage(props.storageField);
        const img = store.state.merchantStore.base64Imgs[props.storageField];
        state.imageUrl = img || '';
        emit('update:value', state.imageUrl);
    }
    if (!props.readCache) {
        // removeBase64ImgStorage(props.storageField);
        store.dispatch('setBase64Imgs', {
            [props.storageField]: '',
        });
        emit('update:value', '');
    }
};

// 监听图片传入值
watch(
    () => props.value,
    (val) => {
        state.imageUrl = val;
        // setBase64ImgStorage(props.storageField, val);
        store.dispatch('setBase64Imgs', {
            [props.storageField]: val,
        });
    },
    { deep: true }
);

// 监听是否读取缓存
watch(
    () => props.readCache,
    () => {
        readCacheFn();
    },
    { deep: true }
);

onBeforeMount(() => {
    readCacheFn();
});
</script>

<style lang="scss" scoped>
.upload-image-certificate {
    margin-bottom: 30rpx;
    width: 50%;
    display: flex;
    justify-content: flex-start;

    .image-box {
        width: 320rpx;
        min-height: 176rpx;
        border-radius: 2rpx;
        border: 1rpx dashed $uni-border-color;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
            width: 220rpx;
            min-height: 140rpx;
        }

        .upload-image-close {
            position: absolute;
            right: -24rpx;
            top: -24rpx;
        }
    }

    .upload-image-box {
        position: relative;
        width: 320rpx;
        min-height: 176rpx;
        border-radius: 2rpx;
        border: 1rpx dashed $uni-border-color;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 14rpx;
        color: #1d2c4e;
        background-size: 102%;
        background-position: center center;
        background-repeat: no-repeat;

        .tip {
            margin: 8rpx 0;
        }

        &.error {
            color: #f29e99;
        }

        .error-tip {
            line-height: 44rpx;
            color: #dd524d;
            font-size: 20rpx;
            position: absolute;
            bottom: -46rpx;
            white-space: nowrap;
        }
    }
}

.upload-image-normal {
    margin-bottom: 30rpx;
    width: 33.3%;

    .image-box {
        position: relative;

        .img {
            width: 240rpx;
            min-height: 164rpx;
        }

        .upload-image-close {
            position: absolute;
            right: -64rpx;
            top: -38rpx;
        }
    }

    .upload-image-box {
        position: relative;
        width: 240rpx;
        min-height: 164rpx;
        border-radius: 8rpx;
        border: 1rpx dashed $uni-border-color;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 32rpx;
        &::before {
            display: block;
            content: '+';
            color: #333333;
            font-size: 80rpx;
            line-height: 80rpx;
            margin-top: -10rpx;
        }

        &.error {
            color: #f29e99;
        }

        &.error::before {
            color: #f29e99;
        }

        .error-tip {
            line-height: 44rpx;
            color: #dd524d;
            font-size: 24rpx;
            position: absolute;
            bottom: -44rpx;
        }
    }
}

.upload-image-close {
    padding: 20rpx;
}

.upload-image-preview {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(0, 0, 0, 0.8);
    display: block;

    .img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-height: 100%;
        max-width: 100%;
    }

    .image-view-area,
    .image-view-view {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
}

.disabled {
    opacity: 0.7;
}
</style>
