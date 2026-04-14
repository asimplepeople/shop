import { createSSRApp } from 'vue';
import App from './App.vue';
import store from './store';
import { getViteEnv } from '../config/config';
// #ifdef MP
import * as SentryMP from 'sentry-miniapp';
// #endif
// #ifdef H5
import { injectApp } from './utils/MainUtils';
// import Vconsole from 'vconsole';
import * as SentryH5 from '@sentry/vue';
import { BrowserTracing } from '@sentry/browser';
// #endif

// #ifdef H5
// 注入app方法，提供app调用
injectApp();
// new Vconsole();
// #endif
//console.log('process.env', process.env);
export function createApp() {
    const app = createSSRApp(App).use(store);
    const SENTRY_H5_ENABLED = getViteEnv('SENTRY_H5_ENABLED');
    const SENTRY_MP_ENABLED = getViteEnv('SENTRY_MP_ENABLED');
    // #ifdef H5
    if (process.env.NODE_ENV === 'production' && SENTRY_H5_ENABLED === 'true') {
        SentryH5.init({
            app,
            dsn: 'https://15d22e2cba9a4ca09c8134d7ecde7eda@sentry.swiftpass.cn/109',
            integrations: [new BrowserTracing()],
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 0.01,
            environment: `${process.env.BANK_CODE}`,
        });
    }
    // #endif
    // #ifdef MP
    if (process.env.NODE_ENV === 'production' && SENTRY_MP_ENABLED === 'true') {
        SentryMP.init({
            dsn: 'https://0e0d9f9efedc46af98fd9914dcb08b67@sentry.swiftpass.cn/119',
            // integrations: [new SentryMP.BrowserTracing()],
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            // tracesSampleRate: 0.01,
            environment: `${process.env.BANK_CODE}`,
        });
    }
    // #endif
    return {
        app,
    };
}
