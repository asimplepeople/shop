<template>
    <view>
        <view class="choose-tab">
            <view
                class="choose-tab-item"
                :class="state.params.productType == 1 ? 'active' : ''"
                data-choose="1"
                @click="clickTab"
            >
                金融产品
            </view>
            <view
                class="choose-tab-item"
                :class="state.params.productType == 2 ? 'active' : ''"
                data-choose="2"
                @click="clickTab"
            >
                聚财快贷
            </view>
        </view>

        <view class="content">
            <view :style="state.params.productType != 1 ? 'display:none' : ''">
                <template v-if="state.financialData.length > 0">
                    <view
                        v-for="(item, key) in state.financialData"
                        :key="key"
                        class="product-item"
                        @click="go(item.url)"
                    >
                        <view class="product-name">
                            {{ item.productName }}
                            <view class="label">{{ item.label }}</view>
                        </view>
                        <view class="product-bottom">
                            <view class="product-bottom-left">
                                <view class="rate">
                                    {{ item.rate }}
                                </view>
                                <view class="remark">
                                    {{ item.intro }}
                                </view>
                            </view>
                            <view class="product-bottom-right">
                                <view class="timeLimit">
                                    {{ item.timeLimit }}
                                </view>
                                <view class="explain">
                                    {{ item.explain }}
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
                <view v-else class="no-data">
                    <view class="no-data-img">
                        <img src="../../assets/images/no-data.png" />
                    </view>
                    <view class="no-data-title"> 当前无理财产品，敬请期待 </view>
                </view>
                <view v-show="state.financialLoadMore">
                    <uni-load-more :status="state.financialLoadStatus" />
                </view>
            </view>
            <view :style="state.params.productType != 2 ? 'display:none' : ''">
                <template v-if="state.wealthData.length > 0">
                    <view v-for="(item, key) in state.wealthData" :key="key" class="product-item" @click="go(item.url)">
                        <view class="product-name">
                            {{ item.productName }}
                            <view class="label">{{ item.label }}</view>
                        </view>
                        <view class="product-bottom">
                            <view class="product-bottom-left">
                                <view class="rate">
                                    {{ item.rate }}
                                </view>
                                <view class="remark">
                                    {{ item.intro }}
                                </view>
                            </view>
                            <view class="product-bottom-right">
                                <view class="timeLimit">
                                    {{ item.timeLimit }}
                                </view>
                                <view class="explain">
                                    {{ item.explain }}
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
                <view v-else class="no-data">
                    <view class="no-data-img">
                        <img src="../../assets/images/no-data.png" />
                    </view>
                    <view class="no-data-title"> 当前无理财产品，敬请期待 </view>
                </view>
                <view v-show="state.wealthLoadMore">
                    <uni-load-more :status="state.wealthLoadStatus" />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { queryProduct } from '../../services/financial';

// type dataType = {
//     financialData: any;
//     wealthData: any;
//     params: any;
//     financialLoadMore: boolean;
//     financialLoadStatus: string;
//     wealthPage: any;
//     financialPage: any;
// };
const ua = navigator.userAgent.toLowerCase();

const state = reactive({
    financialData: [],
    financialLoadMore: false,
    financialLoadStatus: 'more', //more：加载前；loading：加载中；no-more：没有更多数据；
    wealthData: [],
    wealthLoadMore: false,
    wealthLoadStatus: 'more', //more：加载前；loading：加载中；no-more：没有更多数据；
    wealthPage: 1, //聚财快贷
    financialPage: 1, //金融产品
    params: {
        productType: 1,
        pageSize: 10,
    },
});

const getProductList = async (params: any) => {
    const res = await queryProduct({ ...params });
    if (res) {
        const { result } = res;
        if (result === '200' && res.message && res.message.rows.length > 0) {
            const list = res.message.rows;
            if (state.params.productType == 1) {
                if (state.financialPage > 1) {
                    state.financialData = state.financialData.concat(list);
                } else {
                    state.financialData = list;
                }

                if (res.message.rows.length < state.params.pageSize) {
                    state.financialLoadMore = true;
                    state.financialLoadStatus = 'no-more';
                } else {
                    state.financialLoadMore = false;
                }
            } else {
                if (state.wealthPage > 1) {
                    state.wealthData = state.wealthData.concat(list);
                } else {
                    state.wealthData = list;
                }
                if (res.message.rows.length < state.params.pageSize) {
                    state.wealthLoadMore = true;
                    state.wealthLoadStatus = 'no-more';
                } else {
                    state.wealthLoadMore = false;
                }
            }
        } else {
            if (state.params.productType == 1) {
                state.financialLoadMore = false;
                state.financialLoadStatus = 'more';
                if (state.financialPage > 1) {
                    state.financialPage -= 1;
                }
            } else {
                state.wealthLoadMore = false;
                state.wealthLoadStatus = 'more';
                if (state.wealthPage > 1) {
                    state.wealthPage -= 1;
                }
            }
        }
    } else {
        uni.showToast({
            title: res.data.msg,
            icon: 'none',
        });
        state.financialLoadMore = false;
        state.financialLoadStatus = 'no-more';
        if (state.params.productType == 1) {
            if (state.financialPage > 1) {
                state.financialPage -= 1;
            }
        } else {
            if (state.wealthPage > 1) {
                state.wealthPage -= 1;
            }
        }
    }
};

const clickTab = (e) => {
    if (state.params.productType == e.target.dataset.choose) {
        return;
    } else {
        state.params.productType = e.target.dataset.choose;
        if (e.target.dataset.choose == 1) {
            state.financialPage = 1;
        } else {
            state.wealthPage = 1;
        }
        // if (e.target.dataset.choose == 1) {
        //     if (state.financialData.length > 0) {
        //         return;
        //     }
        // } else {
        //     if (state.wealthData.length > 0) {
        //         return;
        //     }
        // }
        getProductList({
            ...state.params,
            pageNumber: state.params.productType == 1 ? state.financialPage : state.wealthPage,
        });
    }
};
onReachBottom(() => {
    if (state.params.productType == 1) {
        if (!state.financialLoadMore && state.financialData.length > 0) {
            state.financialLoadMore = true;
            state.financialPage += 1;
            state.financialLoadStatus = 'loading';
            getProductList({
                ...state.params,
                pageNumber: state.financialPage,
            });
        }
    } else {
        if (!state.wealthLoadMore && state.wealthData.length > 0) {
            state.wealthLoadMore = true;
            state.wealthPage += 1;
            state.wealthLoadStatus = 'loading';
            getProductList({
                ...state.params,
                pageNumber: state.wealthPage,
            });
        }
    }
});

const go = (url) => {
    let obj = {
        url,
    };
    if (ua.match('android')) {
        try {
            window.androidShare && window.androidShare.pushNextPage(JSON.stringify(obj));
        } catch (error) {
            uni.showToast({
                icon: 'none',
                duration: 3000,
                title: error.message,
            });
        }
    } else if (ua.match('iphone') || ua.match('ipad')) {
        try {
            window.webkit && window.webkit.messageHandlers.pushNextPage.postMessage(obj);
        } catch (error) {
            uni.showToast({
                icon: 'none',
                duration: 3000,
                title: error.message,
            });
        }
    }
};

onLoad(() => {
    getProductList({
        ...state.params,
        pageNumber: state.params.productType == 1 ? state.financialPage : state.wealthPage,
    });
});
</script>

<style lang="scss" scoped>
.choose-tab {
    position: fixed;
    top: 0;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    background-color: #ffffff;
    color: #999999;
}
.choose-tab-item {
    width: 50%;
}
.active {
    position: relative;
    color: #333333;
    font-size: 34rpx;
    font-weight: 700;
}
.active::after {
    content: '';
    display: block;
    width: 100rpx;
    height: 8rpx;
    border-radius: 20rpx;
    background-color: #f1514f;
    position: absolute;
    bottom: 0;
    left: 136rpx;
}
.content {
    padding: 120rpx 30rpx 0px;
    min-height: calc(100vh - 200rpx);
    text-align: center;
}
.product-item {
    background-color: #ffffff;
    border-radius: 10rpx;
    padding: 34rpx 30rpx;
    margin-bottom: 20rpx;
    .product-name {
        display: flex;
        color: #333333;
        font-size: 30rpx;
        font-weight: 700;
        .label {
            color: #f1514f;
            font-size: 22rpx;
            font-weight: 500;
            background-color: #feeeed;
            margin-left: 20rpx;
            padding: 6rpx 10rpx;
        }
    }
    .product-bottom {
        display: flex;
        text-align: left;
        margin-top: 20rpx;
        align-content: space-between;
        .product-bottom-left {
            flex: 1;
            .rate {
                color: #f1514f;
                font-size: 48rpx;
                font-weight: 700;
            }
            .remark {
                // margin-top: 2px;
                color: #999999;
                font-size: 24rpx;
                font-weight: 500;
            }
        }
        .product-bottom-right {
            flex: 1;
            .timeLimit {
                color: #333333;
                font-size: 30rpx;
                font-weight: 700;
            }
            .explain {
                margin-top: 20rpx;
                color: #999999;
                font-size: 24rpx;
                font-weight: 500;
            }
        }
    }
}
.product-item:last-child {
    margin-bottom: 0px;
    font-size: 24rpx;
    font-weight: 500;
}
.no-data {
    margin-top: 72rpx;
    display: flex;
    align-items: center;
    flex-direction: column;
    .no-data-img {
        width: 308rpx;
        height: 238rpx;
        text-align: center;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .no-data-title {
        margin-top: 46rpx;
        color: #aaaaaa;
        font-size: 30rpx;
        font-weight: 500;
    }
}
</style>
