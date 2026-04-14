<template>
    <div></div>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { md5 } from '../../utils/GlobalUtils';
onLoad((options) => {
    const str = md5.createSignData(options || {});
    uni.redirectTo({
        url: '/pages/payment/payment?' + str,
    });
});
</script>

<style lang="scss" scoped></style>
