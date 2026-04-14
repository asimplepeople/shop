<!--
 * @Description: 广告插件
 * @Creater: xuchunyang
-->

<template>
    <view :class="['ad-contain']">
        <!-- #ifdef MP-WEIXIN -->
        <block v-if="showType === 'show' && showAdvert === 1">
            <!-- #ifdef OPENSWFAD -->
            <!-- 威富通微信原生广告 -->
            <block v-if="advertType === 'wx' && swfad">
                <swf-adv-plugin v-if="videoAdvId" :unit-id="videoAdvId" ad-type="video" />
                <custom v-if="customAdvId" :unit-id="customAdvId" />
                <!-- <swf-adv-plugin v-if="bannerAdvId" :unit-id="bannerAdvId" /> -->
            </block>
            <!-- #endif -->
            <!-- #ifdef OPENUNIAD -->
            <!-- uniad原生广告 -->
            <block v-if="advertType === 'uniad' && uniad">
                <ad v-if="isIos && uniadCustomAdvId" :adpid="uniadCustomAdvId" />
                <ad v-if="uniadBannerAdvId" :adpid="uniadBannerAdvId" />
                <!-- <image v-if="!isIos" class="vip-shop" :src="vipShopBanner" mode="widthFix" @click="goVipShop" /> -->
                <ad-interstitial
                    v-if="uniadInterstAdvId"
                    ref="uniadInterstAdv"
                    :adpid="uniadInterstAdvId"
                    :loadnext="true"
                    @load="onAdLoad"
                    @error="onAdError"
                />
            </block>
            <!-- #endif -->
        </block>
        <!-- #endif -->

        <!-- 支付后banner位 -->
        <view v-if="showType === 'show' && bannerAdImgPath && bannerShow" class="banner-contain">
            <view
                v-if="showShield"
                class="banner-ad-tip"
                @tap="
                    () => {
                        adConfigurePopup = !adConfigurePopup;
                    }
                "
            >
                <view>广告</view>
                <image :lazy-load="true" mode="aspectFill" class="active-image" :src="showActiveImg" />
            </view>
            <view v-if="adConfigurePopup" class="banner-tip-popup">
                <view class="banner-tip-popup-title banner-tip-popup-common">由服务商提供的内容</view>
                <view class="banner-line" />
                <view class="banner-tip-popup-content banner-tip-popup-common" @tap="closeAding">关闭当前广告</view>
                <view class="banner-line" />
                <view class="banner-tip-popup-content banner-tip-popup-common" @tap="closeAdvert('30')">
                    30天内不再显示
                </view>
            </view>
            <image
                class="banner-pic"
                mode="widthFix"
                :src="bannerAdImgPath"
                @tap="handleBannerJump('', bannerAdChannelUrl)"
            />
            <!-- 支付后banner位-多功能开关open begin -->
            <block v-if="isOpenMultiFuncSwitch">
                <slot name="top"></slot>
                <view :class="['multi-func-wrap', fromType === 'zhjy' && 'bgc-white']">
                    <view class="multi-func-contain">
                        <view class="multi-func-left" @tap="handleBannerJump('abandon')">
                            <view>放弃</view>
                            <view>福利</view>
                        </view>
                        <view class="multi-func-right" @tap="handleBannerJump('paySuccess', bannerAdChannelUrl)">
                            支付完成
                            <view class="multi-func-tips" @tap="handleBannerJump('tips', bannerAdChannelUrl)">
                                <view>领福利</view>
                            </view>
                        </view>
                    </view>
                </view>
                <slot name="bottom"></slot>
            </block>
            <!-- 支付后banner位-多功能开关open end -->
        </view>
        <view
            v-if="showType === 'show' && !bannerAdImgPath && advertList.length"
            class="banner-contain"
            style="height: 600rpx"
        />
        <view
            v-if="showType === 'show' && !showAdvert && advertList.length"
            class="banner-contain"
            style="height: 600rpx"
        />

        <!-- 最底部关闭广告配置 -->
        <view v-if="showType == 'show' && showShield && advertList.length" class="bottom-btn-ad">
            <view style="position: relative">
                <view v-if="isShowBottomPopup" class="bottom-btn-dialog">
                    <view class="dialog-content">
                        <view class="dialog-title">
                            <view>广告个性化配置</view>
                            <text
                                :class="['iconfont', 'iconicon-close']"
                                style="font-size: 12px"
                                @tap="
                                    () => {
                                        isShowBottomPopup = false;
                                    }
                                "
                            />
                        </view>
                        <view class="dialog-text">30天内不展示广告</view>
                        <view class="dialog-btn-content">
                            <view class="dialog-btn" @tap="closeAdvert('30')"> 确定 </view>
                        </view>
                    </view>
                </view>
            </view>
            <view
                class="advert-configure-text"
                @tap="
                    () => {
                        isShowBottomPopup = !isShowBottomPopup;
                    }
                "
                >个性配置</view
            >
        </view>

        <!-- 弹窗广告 -->
        <uni-popup
            v-if="showType === 'show' && popAdImgPath"
            ref="advertPopup"
            type="center"
            :ext-mask-class="{ zIndex: 100 }"
            :ext-trans-class="{ zIndex: 100 }"
            :is-mask-click="false"
            catchtouchmove="true"
            @mask-click="handlePopupJump(popAdChannelUrl)"
        >
            <block>
                <cover-view class="advert-popup-wrap" :style="{ paddingBottom: '0' }">
                    <cover-image
                        class="advert-img"
                        mode="widthFix"
                        :src="popAdImgPath"
                        :show-menu-by-longpress="true"
                        @tap="handlePopupJump(popAdChannelUrl)"
                    />
                    <cover-image class="advert-close" :src="imgCloseCircle" @tap="closeAdvertPopup" />
                </cover-view>
            </block>
        </uni-popup>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Config from '../../config/config';
import { getAdvertInfo, getAd, closeAdvert } from '../services/advert';
import { isIos, advImageJump, navigateToAdvPage } from '../utils/GlobalUtils';
import CloseCircle from '@/assets/images/close-circle.png';
// import { getMockAdvertData } from '../mock-data/advert-mock';
let interstitialAd = null;
export default {
    components: {},
    props: {
        // 展示类型
        showType: {
            type: String,
            default: '', // init 初始化广告数据，show 展示广告
        },
        // 商户信息，必须包含out_mch_id：商户号，distribution_id：渠道号，bak_distribution_id：受理机构号
        mchInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },
        // 是否展示半屏，默认展示
        openEmbedded: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            isIos: isIos(),
            showAdvert: 0, // 1: 有微信插件广告 0： 没有微信插件广告
            advertType: '', // // wx=威富通广告, uniad, fshows=首展, wx=沃氪, ps=派深（kew=凯尔文, bjcs=北京彩狮，停用）
            // 派深和凯尔文用的同一个插件，并且凯尔文不用了，所以派深替换凯尔文
            ps: Config?.adParams?.ps, // 派深广告插件开关
            yw: Config?.adParams?.yw, // 派深广告插件开关
            // bjcs: Config?.adParams?.bjcs, // 北京彩狮半屏广告插件开关
            fshows: Config?.adParams?.fshows, // 首展页面插件广告开关
            wk: Config?.adParams?.wk, // 沃氪页面插件广告开关
            // yg: Config?.adParams?.yg, // 扬歌半屏插件广告开关
            // kewPageId: Config?.adParams?.vipShopBanner, // 卡尔文页面Id
            // bynPlugin: null, // 北京彩狮半屏广告插件实例
            // bynPluginPid: Config?.adParams?.bynPluginPid, // 北京彩狮半屏广告插件pid
            fshowsPlugin: null, // 首展页面插件广告开关实例
            fshowsPluginLabel: Config?.adParams?.fshowsPluginLabel, // 首展页面插件广告label
            wkSecret: Config?.adParams?.wkSecret, // 沃氪密钥
            psSecret: Config?.adParams?.psSecret, // 派深密钥
            ygEmpPlugin: null, // 扬歌半屏插件广告开关实例
            // ygMediaId: Config?.adParams?.ygMediaId, // 扬歌媒体id
            openid: '', // 用户openid
            videoAdvId: Config?.adParams?.videoAdvId, // 威富通广告插件视频广告id
            customAdvId: Config?.adParams?.customAdvId, // 威富通广告插件格子广告id
            interstAdvId: Config?.adParams?.interstAdvId, // 威富通广告插件插屏广告id
            // bannerAdvId:Config?.adParams?.bannerAdvId // 威富通广告插件banner广告id
            // uniadVideoAdvId:Config?.adParams?.uniadVideoAdvId, // uniad广告插件视频广告id
            uniadCustomAdvId: Config?.adParams?.uniadCustomAdvId, // uniad广告插件格子广告id
            uniadBannerAdvId: Config?.adParams?.uniadBannerAdvId, // uniad广告插件banner广告id
            uniadInterstAdvId: Config?.adParams?.uniadInterstAdvId, // uniad广告插件插屏广告id
            swfad: Config?.adParams?.swfad, // 威富通广告插件开关
            uniad: Config?.adParams?.uniad, // uniad广告插件开关
            // vipShopBanner: Config?.adParams?.vipShopBanner, // 唯品会banner图片地址
            // vipShopPath: Config?.adParams?.vipShopPath, // 唯品会小程序地址

            popAdImgPath: '', // 弹窗广告图片路径
            popAdChannelUrl: '', // 弹窗广告跳转路径
            bannerAdImgPath: '', // banner广告图片路径
            bannerAdChannelUrl: '', // banner广告跳转路径
            adConfigurePopup: false, // 是否显示广告配置弹窗
            bannerShow: true, // 支付后banner位是否展示
            // showShield: true, // 是否展示关闭广告弹窗
            isOpenMultiFuncSwitch: false, // 是否开启【支付后banner】的多功能开关
            isShowBottomPopup: false, // 是否显示底部个性配置弹窗
            showBottom: false, // 控制是否显示“加载更多”
            hasPreloaded: false, // 是否调用过预加载接口
            closeInterstitialAdTime: 20000, // 插屏关闭时间
        };
    },
    computed: {
        ...mapState({
            //广告列表
            advertList: (state) => state.advertStore.advertList,
            // 广告参数，关闭广告请求广告都需要用到
            advertParam: (state) => state.advertStore.advertParam,
            // 是否展示关闭广告选项
            showShield: (state) => state.advertStore.showShield,
        }),
        imgCloseCircle() {
            return CloseCircle;
        },
        imgAdvert() {
            return decodeURIComponent(this.imgPath);
        },
    },
    watch: {
        mchInfo: {
            handler() {
                // #ifdef MP-WEIXIN
                // 初始化广告，获取广告开关
                if (this.showType === 'init' && this.mchInfo.out_mch_id && this.mchInfo.bak_distribution_id) {
                    this.getAdvertInfo();
                }
                // #endif
            },
            immediate: true,
        },
    },
    //到达底部后第二次滑动才能展示底部配置
    // onReachBottom() {
    //     console.log('触底');
    //     setTimeout(() => {
    //         this.showBottom = true;
    //     }, 500);
    // },
    beforeUnmount() {
        this.destroyInterstitialAd();
    },
    unmounted() {
        this.destroyInterstitialAd();
    },
    methods: {
        ...mapMutations(['setAdvertList', 'setAdvertParam', 'setShowShield']),
        destroyInterstitialAd() {
            // 组件销毁前关闭微信原生插屏弹窗
            interstitialAd && interstitialAd.destory && interstitialAd.destory();
            console.log('组件销毁前关闭微信原生插屏弹窗', 'interstitialAd.destory()');
        },
        // h5收银台跳转到广告页(页面广告，使用范围)
        toAdvPage(url) {
            navigateToAdvPage(url);
        },
        // 获取广告开关
        async getAdvertInfo() {
            // 非首展和沃氪不调用插件预加载接口
            // if (!(this.fshows || this.wk) || this.hasPreloaded) return;

            const {
                out_mch_id: mchId,
                distribution_id: distributionId,
                bak_distribution_id: bakDistributionId,
            } = this.mchInfo;
            const params = {
                mchId,
                distributionId,
                bakDistributionId,
            };
            console.log('getAdvertInfo.params:', params);
            const res = await getAdvertInfo(params);
            console.log('getAdvertInfo.res:', res);
            const data = res || {};
            const { showAdvert, advertType, secretConfig } = data;
            this.showAdvert = showAdvert || 0;
            this.advertType = advertType || '';
            // todo 测试数据
            // this.showAdvert = 1;
            // this.advertType = 'fshows';
            // 初始化广告插件
            this.initAd(secretConfig);
            // 是否调用过预加载接口，只触发一次
            this.hasPreloaded = true;
        },
        // 获取openId
        async getOpenid() {
            if (!this.openid) {
                this.openid = uni.getStorageSync('OPENID');
            }
            return Promise.resolve();
        },
        // 初始化广告插件
        async initAd(config) {
            // 外部广告开关
            if (this.showAdvert === 1) {
                // 北京彩狮插件半屏广告
                // if (this.advertType === 'bjcs' && this.bjcs && !this.bynPlugin) {
                //     // 获取openId
                //     await this.getOpenid();
                //     this.bynPlugin = requirePlugin('bynPlugin');
                //     const adParams = {
                //         pid: (config && config.pid) || this.bynPluginPid,
                //         wxOpenId: this.openid, // 可选 推荐填入,
                //     };
                //     console.log('bjcs.adParams:', adParams);
                //     // 刷新广告数据
                //     this.bynPlugin.prefetchAd(adParams);
                // }
                // 首展页面插件广告
                if (this.advertType === 'fshows' && this.fshows && !this.fshowsPlugin) {
                    // 获取openId
                    await this.getOpenid();
                    // eslint-disable-next-line no-undef
                    this.fshowsPlugin = requirePlugin('fshows-plugin');
                    const adParams = {
                        openId: this.openid,
                        label: (config && config.label) || this.fshowsPluginLabel,
                    };
                    console.log('fshows.adParams:', adParams);
                    // 广告预加载
                    this.fshowsPlugin.preloadAd(adParams);
                }
                // 扬歌插件半屏广告
                // if (this.advertType === 'yg' && this.yg && !this.ygEmpPlugin) {
                //    // eslint-disable-next-line no-undef
                //     this.ygEmpPlugin = requirePlugin('yg-emp-plugin');
                //     // 初始化扬歌插件
                //     const result = this.ygEmpPlugin.init((config && config.mediaId) || this.ygMediaId);
                //     console.log('ygEmpPlugin.init:', result);
                // }
            }
        },
        /**
         * 展示插件广告
         */
        async showAdvertFn(plugin) {
            const { secretConfig } = plugin;

            // 外部广告开关
            if (this.showAdvert === 1) {
                // 派深开关开启直接跳转派深页面
                if (this.advertType === 'ps' && this.ps) {
                    console.log('派深广告');
                    // 获取openId
                    await this.getOpenid();
                    // secret会经常变动，所以需要优先使用接口返回的secret
                    const secret = (secretConfig && secretConfig.secret) || this.psSecret;
                    console.log('plugin.ps.secret:', secret);

                    //为了点击返回可以返回首页
                    uni.reLaunch({
                        url: `plugin://iclickSendCoupon/coupon-index?open_id=${this.openid}&secret=${secret}`,
                    });
                    return Promise.resolve(true);
                }

                // 北京彩狮半屏广告
                // if (this.advertType === 'bjcs' && this.bjcs) {
                //     console.log('北京彩狮半屏广告');
                //     const adParams = {
                //         pid: this.bynPluginPid,
                //         wxOpenId: this.openid, // 可选 推荐填入,
                //         wx,
                //     };
                //     console.log('bjcs.adParams:', adParams);
                //     // 调起半屏
                //     this.bynPlugin.showAd(adParams);
                //     return Promise.resolve(false);
                // }
                // 首展开关开启直接首展广告页面
                if (this.advertType === 'fshows' && this.fshows) {
                    console.log('首展页面插件广告');
                    // label相当于secret，会经常变动，所以需要优先使用接口返回的label
                    const label = (secretConfig && secretConfig.label) || this.fshowsPluginLabel;
                    console.log('plugin.fshows.label:', label);
                    uni.reLaunch({
                        url: `plugin://fshows-plugin/sendCoupon?openId=${this.openid}&label=${label}`,
                    });
                    return Promise.resolve(true);
                }
                // 沃氪开关开启直接跳转沃氪广告页面
                if (this.advertType === 'wk' && this.wk) {
                    // 获取openId
                    await this.getOpenid();
                    console.log('沃氪广告');
                    // secret会经常变动，所以需要优先使用接口返回的secret
                    const secret = (secretConfig && secretConfig.secret) || this.wkSecret;
                    console.log('plugin.wk.secret:', secret);
                    uni.reLaunch({
                        url: `plugin://wkcoupon/v2-index-coupon?open_id=${this.openid}&secret=${secret}`,
                    });
                    return Promise.resolve(true);
                }
                // 扬歌半屏广告
                // if (this.advertType === 'yg' && this.yg) {
                //     console.log('扬歌半屏广告');
                //     // 调起半屏
                //     this.ygEmpPlugin.openEmbeddedMP();
                //     return Promise.resolve(false);
                // }
            }
            return Promise.resolve(false);
        },

        openMiniProgram(item) {
            // 实现打开小程序的逻辑

            if (item.appId) {
                uni.navigateToMiniProgram({
                    appId: item.appId,
                    path: item.minProgramUrl || item.url,
                    success(res) {
                        if (res.errMsg === 'navigateToMiniProgram:ok') {
                            console.log('成功打开小程序', res);
                        } else {
                            console.log('关闭小程序', res);
                        }
                    },
                });
            }
        },

        showVirtualModalToAd(item) {
            // 实现显示虚拟键广告的逻辑
            if (item.appId && this.openEmbedded) {
                // this.showVagueMask = true;
                uni.showModal({
                    title: '',
                    content: '支付成功',
                    showCancel: item?.showRevert === 1, // 1:则需要开启返回字段 0:则不需要开启返回字段
                    cancelText: '返回',
                    cancelColor: '#aaaaaa',
                    success: (res) => {
                        console.log('showVirtualModalToAd.虚拟键弹窗', res);

                        if (res.confirm) {
                            console.log('显示半屏小程序广告', item);
                            uni.openEmbeddedMiniProgram({
                                appId: item.appId,
                                path: item.minProgramUrl,
                                success: () => {},
                            });
                        } else if (item?.showRevert === 1 && res.cancel) {
                            console.log(
                                '🚀 ~ file: advert-plugin.vue:305 ~ showVirtualModalToAd ~ res.cancel:',
                                res.cancel
                            );
                        }
                        // this.showVagueMask = false;
                    },
                });
            }
        },

        showWxAndUniad(item) {
            this.showAdvert = item?.showAdvert || 0;
            this.advertType = item?.advertType;
            if (item.showAdvert === 1) {
                // 展示威富通原生微信插屏广告
                if (item.advertType === 'wx' && this.swfad && this.interstAdvId && item?.screenPlugSwitch !== 0) {
                    console.log('显示微信插屏广告');
                    try {
                        const plugin = requirePlugin('swfAdvPlugin');
                        interstitialAd = plugin.showInsertAd();
                        const timer1 = setTimeout(() => {
                            clearTimeout(timer1);
                            this.destroyInterstitialAd();
                            console.log('销毁微信原生插屏弹窗');
                        }, this.closeInterstitialAdTime);
                    } catch (error) {
                        console.log('展示威富通原生微信插屏广告:', error);
                    }
                }
                // 展示uniad插屏广告
                if (item.advertType === 'uniad' && this.uniad && this.uniadInterstAdvId) {
                    console.log('显示uniad插屏广告');
                    const timer = setTimeout(() => {
                        clearTimeout(timer);
                        const { uniadInterstAdv } = this.$refs;
                        uniadInterstAdv && uniadInterstAdv.show();
                    }, 1500);
                }
            }
        },

        showPopAd(item) {
            this.popAdImgPath = item.imgPath || '';
            this.popAdChannelUrl = item.url || '';
            // 打开自定义弹窗广告
            this.$nextTick(() => {
                this.openAdvertPopup();
            });
        },
        showBannerAd(item) {
            this.bannerAdImgPath = item.imgPath || '';
            this.bannerAdChannelUrl = item.url || '';
            this.isOpenMultiFuncSwitch = item.functionSwitch === 1; // 是否开启多功能开关
        },
        /**
         * 展示插屏广告
         * @param {Object} data - 包含广告信息的数据对象
         * @returns {Promise} 返回一个Promise对象，可用于处理广告展示的结果
         */
        async showInterstAdvertFn() {
            // this.advertList = advertList?.map((data) => {
            //     const { showAdvert, advertType } = data;
            //     if (typeof showAdvert !== 'undefined') {
            //         if (typeof showAdvert === 'number') this.showAdvert = showAdvert;
            //         if (typeof showAdvert === 'boolean') this.showAdvert = showAdvert ? 1 : 0;
            //         if (typeof showAdvert === 'string') this.showAdvert = Number(showAdvert);
            //         if (advertType) this.advertType = advertType;
            //     }
            //     return {
            //         ...data,
            //         // 是否展示插件广告
            //         showAdvert,
            //         // 插件广告类型
            //         advertType,
            //     };
            // });
            console.log(
                '🚀 ~ file: advert-plugin.vue:365 ~ this.advertList=advertList.map ~ this.advertList:',
                this.advertList
            );

            // 调用广告
            this.advertList?.forEach((item) => {
                // #ifdef MP-WEIXIN
                switch (item.launchType) {
                    case '1': // H5
                        advImageJump(item.url || item.minProgramUrl);
                        break;
                    case '2': // 小程序
                        this.openMiniProgram(item);
                        break;
                    case '3': // 半屏小程序
                    case '8': // 虚拟键
                        // 半屏小程序和虚拟键类型 都走虚拟键逻辑
                        this.showVirtualModalToAd(item);
                        break;
                    case '4': // 插件
                        this.showWxAndUniad(item);
                        break;
                    case '5': // 支付后弹窗
                        this.showPopAd(item);
                        break;
                    case '7': // 支付后banner
                        this.showBannerAd(item);
                        break;
                    default:
                        break;
                }
                // #endif
                // #ifdef H5
                switch (item.launchType) {
                    case '5': // 支付后弹窗
                        item.channelUrl = item?.url || item?.advUrl || '';
                        this.showPopAd(item);
                        break;
                    case '7': // 支付后banner
                        item.channelUrl = item?.url || item?.advUrl || '';
                        this.showBannerAd(item);
                        break;
                    default:
                        if (item?.adType === 1) {
                            //广告类型：1.常规广告 2.优量汇广告(小程序不用)
                            // 广告展示方式：0.banner方式 1.URL方式
                            if (item?.displayMode === 1 && item?.url) {
                                //URL方式直接跳转广告链接
                                this.toAdvPage(item?.url);
                            }
                        }
                        break;
                }
                // #endif
            });
        },
        /**
         * 查询广告平台广告
         * @param {Object} router - 支付完成需要跳转的页面路径及拼接好参数
         * @param {Object} params - getAd接口查询参数，如果url为空作为广告平台查询返回的广告信息
         */
        async channelGetAd(router, params) {
            let data = null;
            let res = null;
            // 开启插件模式，launchType 传 4
            // if (this.showAdvert === 1) params.launchType = 4;
            // 小程序内默认传2
            params.launchType = 2;

            // 每次进入清空一下store中的数据
            this.setAdvertList([]);
            try {
                res = await getAd(params);
                data = res?.data || {};
                // TODO: 测试数据
                // data = getMockAdvertData(1, 2, 3, 4, 5, 7, 8); // 1:h5, 2:小程序, 3:半屏小程序 4:插件 5:支付后弹窗 7:支付后banner 8:虚拟键

                console.log('🚀 ~ file: advert-plugin.vue:515 ~ channelGetAd ~ data:', data);

                if (data?.list && data.list.length > 0) {
                    uni.hideLoading();
                    console.log('获取广告链接接口成功', data);
                    // 将返回的广告列表存入store中
                    this.setAdvertList(data.list);
                    this.setAdvertParam(params);
                    this.setShowShield(data.showShield);
                    // 成功页h5广告与插件广告互斥
                    // 首展、沃氪、派深广告
                    const jumpStraightPlugin = data.list.filter(
                        (item) =>
                            item.launchType == '4' &&
                            (item.advertType === 'fshows' || item.advertType === 'wk' || item.advertType === 'ps')
                    );
                    if (jumpStraightPlugin.length > 0) {
                        console.log('channelGetAd  jumpStraightPlugin:', jumpStraightPlugin);
                        const plugin = jumpStraightPlugin[0];
                        this.showAdvert = plugin.showAdvert || 0;
                        if (plugin.advertType) this.advertType = plugin.advertType;
                        if (await this.showAdvertFn(plugin)) return;
                    }

                    // H5广告（替代逻辑搜toAdvPage(decodeURIComponent(options.url || ''));）
                    // const h5Ad = data.list.filter((item) => item.launchType == '1');

                    // console.log('🚀 ~ file: advert-plugin.vue:608 ~ channelGetAd ~ h5Ad:', h5Ad);

                    // if (h5Ad.length > 0) {
                    //     this.showAdvert = h5Ad[0].showAdvert || 0;
                    //     let haveAdvRouter = `${router}&show_advert=${this.showAdvert}`;
                    //     if (
                    //         this.showAdvert == 0 &&
                    //         ((h5Ad[0].url && h5Ad[0].url !== 'null') || (h5Ad[0].advUrl && h5Ad[0].advUrl !== 'null'))
                    //     ) {
                    //         console.log('加载h5广告');
                    //         haveAdvRouter = `${haveAdvRouter.replace('adv=1', 'adv=2')}&url=${encodeURIComponent(
                    //             h5Ad[0].url || h5Ad[0].advUrl
                    //         )}`;
                    //     }
                    //     navigateToAdvPage(decodeURIComponent(haveAdvRouter || ''));
                    //     return;
                    // }

                    // // 广告平台是否配置了广告 1 配置了广告 0 未配置广告
                    // let hasChannelAdv = 0;

                    // // 有配置插件
                    // if (this.showAdvert == 1) hasChannelAdv = 1;

                    // // showAdvert为1时展示插件广告
                    // if (await this.showAdvertFn()) return;
                    // // 包含广告信息的路径
                    // let haveAdvRouter = `${router}&show_advert=${this.showAdvert}&advert_type=${this.advertType}`;
                    // // 成功页h5广告与插件广告互斥 adv 1 无h5广告 2 有h5广告，url有值为h5
                    // if (
                    //     this.showAdvert == 0 &&
                    //     ((data.url && data.url !== 'null') || (data.advUrl && data.advUrl !== 'null'))
                    // ) {
                    //     haveAdvRouter = `${haveAdvRouter}&adv=2&url=${encodeURIComponent(data.url || data.advUrl)}`;
                    //     hasChannelAdv = 1;
                    // }
                    // launchType 5 支付后弹窗  7 支付后banner
                    // TODO: 测试数据
                    // data.launchType = '5';
                    // data.imgPath = 'https://imgeppcm.hstypay.com/image//3000082475/pdetail/bac770cd972946a089e2d96950608924.jpg';
                    // data.url = 'weixin://wx30d5982de1b060fe/pages/promotion/html5?url=https%3A%2F%2Fmp.elong.com%2Ftenthousandaura%2F%3Factivitycode%3D73086812-aaae-48ba-b14a-f087a6b61a92%26isSocket%3DHotelActivityId_9043%26of%3D5022335&isRefresh=refresh&isSocket=HotelActivityId_9043';
                    // data.url =
                    //     'weixin://wx41890c67ed9b401e/pages/pay/index/saas?q=http%3A%2F%2Fzhifu4-spay.k8s.swiftpass.top%2Fspay%2Fmerchant%2FscanQr%3FqrId%3D1b1dad4ea94f4ac19dd5982e03bd6a8c';
                    // if (this.showAdvert == 0 && data.launchType && (data.launchType == '5' || data.launchType == '7')) {
                    //     if (data.launchType == '5') {
                    //         haveAdvRouter += '&channel_popup=1';
                    //     }
                    //     haveAdvRouter += `&launch_type=${data.launchType}`;
                    //     if (data.imgPath) haveAdvRouter += `&img_path=${encodeURIComponent(data.imgPath)}`;
                    //     if (data.url) haveAdvRouter += `&channel_url=${encodeURIComponent(data.url || data.advUrl)}`;
                    //     hasChannelAdv = 1;
                    // }
                    // // 半屏广告判断
                    // if (data.appId && this.showAdvert !== 1 && this.openEmbedded) {
                    //     uni.openEmbeddedMiniProgram({
                    //         appId: data.appId,
                    //         path: data.minProgramUrl,
                    //     });
                    //     hasChannelAdv = 1;
                    // }
                    // haveAdvRouter += `&hasChannelAdv=${hasChannelAdv}`;
                    // console.log('实际路由', haveAdvRouter);

                    // uni.redirectTo({ url: haveAdvRouter });
                    // return;
                }
                console.log('获取广告链接失败');
                uni.hideLoading();
                uni.redirectTo({ url: router });
            } catch (e) {
                console.log('获取广告链接失败');
                uni.hideLoading();
                uni.redirectTo({ url: router });
            }
        },
        onAdLoad(e) {
            console.log('onload', e);
        },
        onAdError(e) {
            console.log(`onerror: ${e.detail.errCode} message:: ${e.detail.errMsg}`);
        },
        // 打开唯品会小程序
        goVipShop() {
            uni.navigateToMiniProgram({
                appId: 'wxe9714e742209d35f',
                path: this.vipShopPath,
                extraData: {},
                success() {
                    // 打开唯品会成功
                    console.log('打开唯品会成功');
                },
            });
        },
        // 实时获取当前广告参数
        getAdvertParam() {
            return {
                showAdvert: this.showAdvert,
                advertType: this.advertType,
            };
        },
        // 打开弹屏广告弹窗
        openAdvertPopup() {
            this.$refs.advertPopup.open();
        },
        closeAdvertPopup() {
            this.$refs.advertPopup.close();
        },
        // 点击【支付后banner广告】后，跳转分流操作
        handleBannerJump(which, channelUrl) {
            if (which === 'abandon') {
                uni.exitMiniProgram({
                    success() {
                        console.log('退出小程序成功');
                    },
                    fail(err) {
                        console.log('退出小程序失败', err);
                    },
                });
                return;
            }
            advImageJump(channelUrl);
        },
        // 点击【支付后弹窗广告】后
        handlePopupJump(channelUrl) {
            this.$refs.advertPopup.close();
            advImageJump(channelUrl);
        },

        closeAding() {
            this.bannerShow = false;
            console.log('关闭banner广告');
        },

        // 关闭广告
        closeAdvert(date) {
            this.bannerShow = false;
            this.setShowShield(false);
            this.showAdvert = 0;
            if (this.advertParam) {
                const { distributionId, bakDistributionId, openid, payType } = this.advertParam;
                console.log('closeAdvert  this.advertParam:', this.advertParam);
                closeAdvert({
                    distributionId,
                    bakDistributionId,
                    openid,
                    payType,
                    forbidDay: date,
                });
                // 测试数据
                // closeAdvert({
                //     distributionId: '100590520856',
                //     bakDistributionId: '100520520881',
                //     openid: '2088512160728554',
                //     payType: '0',
                //     forbidDay: date,
                // })
                //     .then((res) => {
                //         if (res?.code == 'Ok' && res?.success) {
                //             this.bannerShow = false;
                //             this.setShowShield(false);
                //         }
                //     })
                //     .catch((err) => {
                //         this.bannerShow = false;
                //         this.setShowShield(false);
                //     });
            }
        },
    },
};
</script>

<style scoped lang="scss">
.advert-popup-wrap {
    width: 100%;
    position: relative;
    padding-bottom: 108rpx;
    overflow: visible;
    z-index: 10000;
    padding: 13rpx;
    .advert-img {
        width: 590rpx;
        border-radius: 40rpx;
    }
    .advert-close {
        width: 48rpx;
        height: 48rpx;
        position: absolute;
        left: 21rpx;
        top: -13rpx;
        transform: translateX(-50%);
        opacity: 0.75;
        padding: 10rpx;
        overflow: visible;
    }
}

.banner-contain {
    width: 100%;
    // padding: 20rpx;
    // box-sizing: border-box;
    position: relative;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;
    .banner-ad-tip {
        position: absolute;
        left: 40rpx;
        top: 40rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(168, 169, 173, 1);
        display: flex;

        .active-image {
            margin-top: 15rpx;
            margin-left: 5rpx;
            width: 25rpx;
            height: 10rpx;
        }
    }

    .banner-tip-popup {
        position: absolute;
        left: 40rpx;
        top: 76rpx;
        height: 192rpx;
        width: 290rpx;
        border-radius: 16rpx;
        box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 1);

        .banner-line {
            margin: 0 44rpx 0 30rpx;
            width: calc(100% - 74rpx);
            // width: 100%;
            background-color: rgba(235, 235, 235, 1);
            height: 1rpx;
        }

        .banner-tip-popup-common {
            height: 64rpx;
            width: 100%;
            text-align: center;
            line-height: 64rpx;
            font-size: 22rpx;
            font-weight: 400;
        }

        .banner-tip-popup-title {
            color: rgba(51, 51, 51, 1);
        }

        .banner-tip-popup-content {
            color: rgba(116, 116, 160, 1);
        }
    }
    .banner-pic {
        width: 100%;
        border-radius: 6rpx;
        min-height: 220rpx;
    }

    .multi-func-wrap {
        width: 100%;
        &.bgc-white {
            background-color: #fff;
            .multi-func-contain {
                padding: 16rpx 0;
            }
        }
        .multi-func-contain {
            width: 610rpx;
            padding: 36rpx 0 10rpx 0;
            margin: 0 auto;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            text-align: center;
            .multi-func-left {
                width: 106.8rpx;
                box-sizing: border-box;
                color: #960000;
                background-color: #ef7980;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 33.6rpx;
                letter-spacing: 0.15em;
                border-radius: 60rpx 2rpx 2rpx 60rpx;
                padding: 12rpx 0 12rpx 9rpx;
            }
            .multi-func-right {
                background: linear-gradient(180deg, #ff0000 0%, #e10000 100%);
                font-family: Alibaba PuHuiTi;
                font-size: 40rpx;
                font-weight: 400;
                line-height: 54.8px;
                letter-spacing: 0.05em;
                color: #fff;
                flex: 1;
                line-height: 88rpx;
                border-radius: 2rpx 60rpx 60rpx 2rpx;
                padding-right: 37rpx;
                position: relative;

                .multi-func-tips {
                    width: 108rpx;
                    background-color: #ffc829;
                    box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0, 0, 0, 0.15);
                    border-radius: 30rpx 30rpx 30rpx 2rpx;
                    color: #000000;
                    font-size: 20rpx;
                    font-weight: 400;
                    padding: 2rpx 0;
                    line-height: 33.6rpx;
                    position: absolute;
                    top: -16rpx;
                    right: 0;
                }
            }
        }
    }
}

.bottom-btn-ad {
    position: relative;
    bottom: 0rpx;
    width: 100%;
    text-align: center;
    padding-top: 100rpx;

    .advert-configure-text {
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(116, 116, 160, 1);
    }
}

.bottom-btn-dialog {
    position: absolute;
    top: -210rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20rpx;
    width: 100%;

    .dialog-content {
        width: 276rpx;
        height: 190rpx;
        // background-color: rgba(248, 248, 250, 1);
        border-radius: 16rpx;
        border: 1rpx solid rgba(248, 248, 250, 1);
        box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
        position: relative;
        background-color: #ffffff;

        &::after {
            content: '';
            border: 16rpx solid transparent;
            border-top: 16rpx solid rgba(255, 255, 255, 1);
            position: absolute;
            right: 125rpx;
            bottom: -44rpx;
            // top: 55%;
            transform: translateY(-50%);
        }

        .dialog-title {
            height: 50rpx;
            padding: 6rpx 15rpx 6rpx 16rpx;
            font-size: 22rpx;
            line-height: 50rpx;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            // line-height: 50rpx;
            text-align: center;
            background-color: rgba(248, 248, 250);
            border-radius: 16rpx 16rpx 0 0;
            display: flex;
            justify-content: space-between;

            .active-image {
                margin-top: 10rpx;
                width: 32rpx;
                height: 32rpx;
            }
        }

        .dialog-text {
            height: 30rpx;
            padding: 10rpx 0;
            font-weight: 400;
            font-size: 22rpx;
            text-align: center;
            color: rgba(153, 153, 153, 1);
        }

        .dialog-btn-content {
            height: 60rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .dialog-btn {
                width: 192rpx;
                height: 50rpx;
                border-radius: 20rpx;
                border: 2rpx solid rgba(248, 248, 250, 1);
                line-height: 50rpx;
                text-align: center;
                font-size: 22rpx;
                font-weight: 400;
                color: rgba(116, 116, 160, 1);
            }
        }
    }
}
.ad-contain {
    width: 100%;
    margin-top: 50rpx;
    background-color: #f7f8fa;

    display: flex;
    justify-content: flex-end;
    flex-direction: column;
}
</style>
