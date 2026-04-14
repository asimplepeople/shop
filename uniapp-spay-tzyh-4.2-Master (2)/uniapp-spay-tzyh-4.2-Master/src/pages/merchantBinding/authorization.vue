<template>
    <view />
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
// import { getwxAuth } from '../../services/merchantBinding';

onLoad(async () => {
    const url = window.location.origin;
    window.location.href = `/spay/xiaowei/sppay-xiaowei-app-web/wxAuth?redirect_url=${url}/spayh5/webapp/pages/merchantBinding/binding`;
    // window.open();
    // const res = await getwxAuth({
    //     redirect_url:,
    // });
});
</script>
<style lang="scss" scoped></style>
