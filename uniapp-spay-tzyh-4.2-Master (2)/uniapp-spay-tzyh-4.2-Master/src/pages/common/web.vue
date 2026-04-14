<template>
    <web-view :src="data.url" />
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';

type dataType = {
    // webview链接地址
    url: string;
};
const data: dataType = reactive({
    url: '',
});

onLoad((options) => {
    const { url } = options;
    console.log(url, '跳转地址');
    console.log(decodeURIComponent(url || ''));
    data.url = decodeURIComponent(url || '') || '';
});
</script>

<style lang="scss" scoped></style>
