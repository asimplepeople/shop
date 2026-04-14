<template>
    <!--  #ifdef CDRCB || TAIZHOU -->
    <view class="pay-result font-size-28">
        <view class="top">
            <view class="top-img text-center">
                <image :src="cdrcbFinish[currentBrowser]?.logo" />
            </view>
            <view class="text-center text-color margin-bottom-16">支付成功</view>
            <view class="money text-center font-size-64 title-color margin-bottom-6">
                <text class="font-size-40 desc-color">¥</text>
                {{ Money.fenChangeYuan(Numeral.sub(data.money, data.daMoney || 0, 0)) }}
            </view>
            <view v-if="Number(data.daMoney || 0)" class="desc text-center desc-color del-line">
                ¥{{ Money.fenChangeYuan(data.money) }}
            </view>
        </view>
        <view class="center">
            <view class="list">
                <view class="listitem text-color"> 订单详情 </view>
                <view v-if="Number(data.daMoney || 0)" class="listitem">
                    <view class="listitem-hd warning-color">优惠金额</view>
                    <view class="listitem-bd warning-color text-right">-¥{{ Money.fenChangeYuan(data.daMoney) }}</view>
                </view>
                <view class="listitem">
                    <view class="desc-color listitem-hd">订单金额</view>
                    <view class="text-right title-color listitem-bd"> ¥{{ Money.fenChangeYuan(data.money) }} </view>
                </view>
                <view class="listitem">
                    <view class="desc-color listitem-hd">商户名称</view>
                    <view class="text-right title-color listitem-bd">
                        {{ data.mchName }}
                    </view>
                </view>
                <view class="listitem">
                    <view class="desc-color listitem-hd">订单号</view>
                    <view class="text-right title-color listitem-bd">
                        {{ data.orderNo }}
                    </view>
                </view>
            </view>
        </view>

        <!-- #ifdef H5 -->
        <!-- 广告 -->
        <advertPlugin ref="advertPluginRef" show-type="show" />
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <!-- 广告 -->
        <swiftpass-assistant :options="pluginOptions" />
        <!-- #endif -->

        <button
            v-if="currentBrowser !== 'ysf'"
            class="cdrcb-btn"
            :class="cdrcbFinish[currentBrowser]?.class"
            bind:type="'primary'"
            @click="confirm"
        >
            完成
        </button>
    </view>
    <uni-popup :ref="popupRefDialog" type="dialog">
        <view class="popup-content">
            <image
                class="popup-adv-image"
                :src="data.topAdv?.advPic"
                mode="widthFix"
                @click="toAdvPage(data.topAdv?.advUrl)"
            />
            <image :src="iconClose" class="popup-adv-close" @click="popupRefDialogRef.close()" />
        </view>
    </uni-popup>
    <!-- #endif -->
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app';
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import FooterButton from '../../components/footer-button.vue';
import { orderNoOrderDetail } from '../../services/payment/payment';
import { Money } from '../../utils/MoneyUtils';
import { Numeral } from '../../utils/NumeralUtils';
import { getWhichBrowser, navigateToAdvPage, generateRandomString} from '../../utils/GlobalUtils';
import Config from '../../../config/config';
import iconFinish from '../../assets/images/payment/cdrcb_wechat.png';
import iconAlipayFinish from '../../assets/images/payment/cdrcb_alipay.png';
import iconYsfFinish from '../../assets/images/payment/cdrcb_ysf.png';
import iconTaiZhoufFinish from '../../assets/images/payment/taizhou/finish.svg';
import iconClose from '../../assets/images/payment/icon_close.png';

// #ifdef H5
// 广告
import { getAd } from '../../services/advert';
import advertPlugin from '../../components/advert-plugin.vue';
const advertPluginRef = ref();
// import { getMockAdvertData } from '../../mock-data/advert-mock';
// #endif

// #ifdef MP-WEIXIN
// 广告
type pluginOptionsType = {
    fromType: string;
    bakDistributionId: string;
    channelToken: string;
    distributionId: string;
    mchId?: string;
    openid?: string;
    amount?: string;
    outTradeNo?: string;
    psSecret?: string;
    wxBannerAdvId?: string;
    wxVideoAdvId?: string;
    wxCustomAdvId?: string;
    wxInterstAdvId?: string;
    isMock?: boolean;
    mockDataType?: object;
    customMockData?: object;
};
const pluginOptions: pluginOptionsType = reactive({
    fromType: '4.2',
    channelToken: Config?.adParams?.channelT,
    bakDistributionId: '',
    distributionId: '',
    mchId: '',
    openid: '',
    amount: '',
    outTradeNo: '',
    // isMock: true,
    // mockDataType: [[4, 'wx']],
});
// #endif

const openDetail = ref(true); //默认打开订单
let popupRefDialogRef: any = {};

const store = useStore();

const popupRefDialog = (el) => {
    popupRefDialogRef = el;
};

const currentBrowser = getWhichBrowser();
const cdrcbFinish = {
    micromessenger: {
        logo: iconFinish,
        class: 'wechat-btn',
    },
    miniprogram: {
        logo: iconFinish,
        class: 'wechat-btn',
    },
    aliapp: {
        logo: iconAlipayFinish,
        class: 'aliapp-btn',
    },
    ysf: {
        logo: iconYsfFinish,
        class: 'ysf-btn',
    },
    tzbank: {
        logo: iconTaiZhoufFinish,
        class: 'tzbank-btn',
    },
};

type advType = {
    advPic?: string;
    advUrl?: string;
};

type dataType = {
    // 用户id
    userId: string;
    // 订单号
    orderNo: string;
    // 优惠
    daMoney: string | number;
    // 积分
    integral: number | string;
    // 金额
    money: string | number;
    // 商户号
    mchId: string;
    //商户名
    mchName: string;
    //支付成功回调地址
    callbackUrl: string;
    //广告数据
    adv?: advType;
    //弹框广告 成都农商行数据
    topAdv?: advType;
};
const data: dataType = reactive({
    orderNo: '',
    daMoney: '0',
    userId: '',
    money: '0',
    integral: 0,
    mchId: '',
    mchName: '',
    callbackUrl: '',
    adv: {},
    topAdv: {},
});

const mchInfoStore = computed(() => {
    return store.state.paymentStore.mchInfo;
});

// 完成
const confirm = () => {
    // #ifdef MP-WEIXIN
    wx.exitMiniProgram &&
        wx.exitMiniProgram({
            success: function () {
                console.log('退出小程序成功');
            },
        });
    // #endif
    // #ifdef  H5
    if (currentBrowser === 'aliapp') {
        window.AlipayJSBridge.call('closeWebview');
    } else if (currentBrowser === 'micromessenger') {
        window.WeixinJSBridge.call('closeWindow');
    }
    // #endif
    // #ifdef  TAIZHOU
    if (currentBrowser === 'tzbank') {
        window.AlipayJSBridge.call('prePage');
    }
    // #endif
    // #ifdef QSBANK
    location.href = data.callbackUrl;
    // #endif
};

const openDetailCol = () => {
    openDetail.value = !openDetail.value;
};

// 跳转到广告页(页面广告，使用范围)
const toAdvPage = (url) => {
    navigateToAdvPage(url);
};

// #ifdef H5
// 广告
const showH5Ad = async (params) => {
    try {
        // 每次进入清空一下store中的数据
        store.dispatch('updateAdvertList', []);
        let res = await getAd(params);
        let data = res?.data || {};
        // TODO: 测试数据;
        // data = getMockAdvertData(1, 2, 3, 4, 5, 7, 8); // 1:h5, 2:小程序, 3:半屏小程序 4:插件 5:支付后弹窗 7:支付后banner 8:虚拟键

        console.log('~ file: pay-result.vue ~ showH5Ad ~ data:', data);

        if (data?.list && data.list.length > 0) {
            // 将返回的广告列表存入store中
            store.dispatch('updateAdvertList', data.list);
            store.dispatch('updateAdvertParam', params);
            store.dispatch('updateShowShield', data.showShield || false);
            advertPluginRef.value.showInterstAdvertFn();
        } else {
            console.log('获取广告链接失败');
        }
    } catch (e: any) {
        console.log('获取广告链接失败: ', e?.message);
    }
};
// #endif

// 广告
const onAd = (message) => {
    let adv = message?.adv;
    console.log('🚀 ~ file: pay-result.vue:326 ~ getDetail ~ adv:', adv);
    // #ifdef CDRCB
    const topAdv = message?.topAdv || {};
    if (Array.isArray(adv) && adv.length) {
        console.log(adv);
        data.adv = adv[0];
    }
    if (topAdv.advPic && topAdv.advUrl) {
        // console.log(topAdv);
        data.topAdv = topAdv;
        popupRefDialogRef.open();
    }
    // #endif
    /*  #ifndef CDRCB */
    if (adv?.redirectType) {
        if (adv?.advUrl && adv?.redirectType == '1') toAdvPage(adv?.advUrl);
    }
    // #endif

    console.warn('🚀 ~ getDetail ~ mchInfoStore:', mchInfoStore);
    const pluginsParams = {
        bakdistributionId: adv?.bakdistributionId || mchInfoStore.value.payAcceptOrg,
        distributionid: adv?.distributionid || mchInfoStore.value.distributionId,
        mchId: adv?.mchId || message?.data?.mchId,
        amount: adv?.amount || Money.fenChangeYuan(data.money),
        openid: adv?.openid || message?.data?.payAcceptOrg,
        outTradeNo: adv?.outTradeNo || message?.data?.payAcceptOrg,
    };
    console.warn('🚀 ~ getDetail ~ pluginsParams:', pluginsParams);
    // #ifdef H5
    // 广告
    let payType = 2;
    if (currentBrowser === 'micromessenger') {
        payType = 0;
    } else if (currentBrowser === 'aliapp') {
        payType = 1;
    }
    showH5Ad({
        mchId: pluginsParams?.mchId || generateRandomString(12, true), // 商户号
        openid: pluginsParams?.openid || generateRandomString(16, true), // 用户openid
        amount: pluginsParams?.amount ? Money.removeThousandFormat(pluginsParams?.amount) : '0.01', // 支付金额
        outTradeNo: pluginsParams?.outTradeNo || generateRandomString(30, true), // 订单号
        distributionId: pluginsParams?.distributionid, // 渠道号
        bakDistributionId: pluginsParams?.bakdistributionId, // 受理机构号
        launchType: 1, // 1：h5 2. 小程序 3 半屏 4 插件
        payType, // 0是微信 1是支付宝 2是其他
    });
    // #endif
    // #ifdef MP-WEIXIN
    // 广告
    pluginOptions.bakDistributionId = pluginsParams?.bakdistributionId;
    pluginOptions.distributionId = pluginsParams?.distributionid;
    pluginOptions.mchId = pluginsParams?.mchId;
    pluginOptions.amount = pluginsParams?.amount;
    pluginOptions.openid = pluginsParams?.openid;
    pluginOptions.outTradeNo = pluginsParams?.outTradeNo;
    // #endif
};

// 获取订单详情
const getDetail = async (params) => {
    try {
        const res = await orderNoOrderDetail({
            ...params,
        });
        // console.log(res, '订单详情');
        if (res?.result == '200') {
            //广告的转化率不高，做成服务端获得广告URL后，小程序直接加载URL
            //根据 redirectType 来判断
            if (res?.message?.data?.daMoney) data.daMoney = res?.message?.data?.daMoney;
            if (res?.message?.data?.orderNoMch) {
                data.orderNo = res?.message?.data?.orderNoMch;
            } else {
                data.orderNo = params.orderNo;
            }

            data.mchName = res?.message?.data?.mchName;
            data.callbackUrl = res?.message?.data?.callbackUrl;
            //获取广告参数
            onAd(res?.message);
        }
    } catch (error: any) {
        uni.showToast({
            icon: 'none',
            mask: true,
            title: error.message || '订单详情获取失败',
            duration: 2500,
        });
    }
};

onLoad((options) => {
    console.log('options', options);
    const { userId, orderNo, money, mchId, integral, daMoney, mktOrderNo, transactionId, isFastPay } = options;

    console.log('🚀 ~ file: pay-result.vue:371 ~ onLoad ~ options:', options);

    data.userId = userId || '';
    data.money = money || '0';
    // data.orderNo = orderNo || '';
    data.mchId = mchId || '';
    data.integral = integral || '';
    data.daMoney = daMoney || '';

    //  获取订单详情
    getDetail({
        userId,
        money,
        mchId,
        orderNo,
        isFastPay: isFastPay || '',
        // #ifndef CDRCB
        mktOrderNo,
        transactionId: transactionId || '',
        // #endif
    });

    // showH5Ad({
    //     mchId: "459542200442973",
    //     openid: "o0W2O7V8KeEhOCXJRn7YiEwC4dvw",
    //     amount: 0.01,
    //     outTradeNo: "45954220044297318548941151822612",
    //     bakDistributionId: "459550000001",
    //     distributionId: "b052",
    //     launchType: 1, // 1：h5 2. 小程序 3 半屏 4 插件
    //     payType: 2, // 0是微信 1是支付宝 2是其他
    // });
});

onReady(() => {
    uni.setNavigationBarTitle({
        title: '支付成功',
    });
});
</script>

<style lang="scss" scoped>
.pay-result {
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: 184rpx;
    background-color: #f9f9f9;
    .pay-success {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 70rpx 0 68rpx 0;
        background: #ffffff;
        .success-img {
            width: 120rpx;
            height: 120rpx;
        }
        .success-text {
            font-size: 28rpx;
            color: #696969;
            font-weight: 400;
        }
    }
    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 30rpx;
        font-size: $uni-font-size-sm;
        border-bottom: 1rpx solid #f1f1f1;
        background-color: #fff;
        &:last-child {
            border-bottom: none;
        }

        .list-left {
            color: $uni-text-color-tab;
        }

        .list-right {
            display: flex;
            align-items: center;

            &.open {
                color: $uni-text-color-tab;
            }

            &.integral {
                color: #fc5a45;
            }

            .right-icon {
                margin-left: 8rpx;
            }
        }
    }

    .pay-detail {
        color: $uni-text-color-disable;

        .list-left {
            color: $uni-text-color-disable;
        }
    }

    .result-adinfo {
        .adinfo-banner {
            display: block;
            width: 690rpx;
            margin: 20rpx auto;
            border-radius: 8rpx;
        }
    }

    .text-center {
        text-align: center;
    }
    .text-right {
        text-align: right;
    }
    .title-color {
        color: $uni-text-color;
    }
    .text-color {
        color: $uni-text-color-dark-grey;
    }
    .warning-color {
        color: $uni-color-warning;
    }

    .desc-color {
        color: $uni-text-color-grey;
    }
    .margin-bottom-16 {
        margin-bottom: 16rpx;
    }
    .margin-bottom-6 {
        margin-bottom: 6rpx;
    }
    .font-size-28 {
        font-size: 28rpx;
    }
    .top {
        padding: 70rpx 30rpx 60rpx;
        background-color: #fff;
        .top-img {
            image {
                width: 106rpx;
                height: 106rpx;
                margin-bottom: 20rpx;
            }
        }
        .font-size-64 {
            font-size: 64rpx;
        }
        .font-size-40 {
            font-size: 40rpx;
        }
        .del-line {
            text-decoration: line-through;
        }
    }
    .center {
        margin-top: 30rpx;
        // background-color: white;
        // padding-bottom: 30rpx;
        .list {
            background-color: white;
            padding: 0 30rpx;
            .listitem {
                display: flex;
                height: 80rpx;
                line-height: 80rpx;
                border-bottom: 1rpx solid $uni-border-color;
                .listitem-hd {
                    flex: 0 1 150rpx;
                }
                .listitem-bd {
                    flex: 1 1;
                }
            }
            .listitem:last-child {
                border: 0;
            }
        }
    }
    .btn {
        width: 560rpx;
        margin-top: 40rpx;
        font-size: 36rpx;
        background-color: $uni-color-base;
        color: $uni-text-color-inverse;
        height: 96rpx;
        border-radius: 48rpx;
        position: fixed;
        bottom: 90rpx;
        left: 95rpx;
    }
    .wechat-btn {
        background-color: #07c160;
    }
    .aliapp-btn {
        background-color: #3379f6;
    }
    .ysf-btn {
        background-color: #e50012;
    }
    .tzbank-btn {
        background-color: #1199a0;
    }
    .fixed-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
.pay-container {
    min-height: unset;
    height: calc(100vh - 184rpx);
    overflow-y: auto;
}
.cdrcb-pay-result {
    display: flex;
    flex-direction: column;
    .center {
        flex: 1 1;
    }
    .adv-block {
        margin: 20rpx 30rpx;
        max-height: 290rpx;
        border-radius: 8rpx;
        overflow: hidden;
        .adv-image {
            width: 100%;
        }
    }
    .cdrcb-btn {
        width: 560rpx;
        margin-top: 60rpx;
        font-size: 36rpx;
        background-color: $uni-color-base;
        color: $uni-text-color-inverse;
        height: 96rpx;
        border-radius: 48rpx;
        // position: fixed;
        margin-bottom: 90rpx;
        margin-left: 95rpx;
    }
}
.popup-content {
    position: relative;
    border-radius: 16rpx;
    max-height: 1490rpx;
    overflow: hidden;
    .popup-adv-image {
        position: relative;
        border-radius: 16rpx;
    }
    .popup-adv-close {
        position: absolute;
        width: 60rpx;
        height: 60rpx;
        top: 12rpx;
        right: 12rpx;
    }
}
</style>
