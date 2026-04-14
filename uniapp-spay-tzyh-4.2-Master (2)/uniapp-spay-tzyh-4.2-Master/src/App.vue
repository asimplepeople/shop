<script lang="ts">
import { initStore } from './utils/MainUtils';
// #ifdef MP
import * as SentryMP from 'sentry-miniapp';
// #endif
// setup语法有问题，无法捕获onError，先使用options方式
export default {
    onLaunch(options) {
        console.log('App Launch');
        // 初始化缓存状态
        initStore(options);
    },
    onShow() {
        console.log('App Show');
    },
    onHide() {
        console.log('App Hide');
    },
    // 捕获 app error
    // #ifdef MP
    onError(err) {
        SentryMP.captureException(err);
        console.error(err);
    },
    // #endif
};
</script>
<style lang="scss">
@import './src/assets/css/default.scss';
</style>
