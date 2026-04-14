<template>
    <view class="add-card">
        <view class="card-form">
            <!--   #ifdef QSBANK  -->
            <view class="cardNum">
                <view class="cardNum-label">银行卡号</view>
                <view class="cardNum-content" @click="handleBankCardClick">
                    <view class="cardNum-text">{{ formatCardNumber(data.formData.bankNo) }}</view>
                    <uni-icons type="forward" size="16" color="#ccc" />
                </view>
            </view>
            <!-- #endif -->
            <!--   #ifndef QSBANK  -->
            <input-item
                :value="data.formData.bankNo"
                name="bankNo"
                label="银行卡号"
                placeholder="请输入银行卡号"
                :error="errList.indexOf('bankNo') > -1"
                type="string"
                @blur="cardInput"
                @input="inputCardChange"
            />
            <!-- #endif -->
            <input-item
                v-if="data.isCredit"
                name="cvv2"
                placeholder="请输入信用卡后背后三位"
                type="number"
                :maxlength="4"
                :password="true"
                @input="(e) => inputChange(e, 'cvv2')"
            >
                <template #label>
                    CVV2
                    <!-- <uni-icons type="help" size="14" color="#ccc" /> -->
                </template>
            </input-item>
            <view v-if="data.isCredit" class="credit-date">
                <view class="credit-label"
                    >有效期至
                    <!-- <uni-icons type="help" size="14" color="#ccc" /> -->
                </view>
                <view class="credit-content">
                    <picker
                        class="credit-select"
                        :value="data.yearIndex"
                        :range="data.yearData"
                        @change="onDateChange('year', $event)"
                    >
                        <view class="select-label"
                            >{{ data.yearData[data.yearIndex] || 'YY'
                            }}<uni-icons class="select-icon" type="bottom" size="18" color="#ccc"
                        /></view>
                    </picker>
                    <picker
                        class="credit-select"
                        :value="data.monthIndex"
                        :range="data.monthData"
                        @change="onDateChange('month', $event)"
                    >
                        <view class="select-label"
                            >{{ data.monthData[data.monthIndex] || 'MM'
                            }}<uni-icons class="select-icon" type="bottom" size="18" color="#ccc"
                        /></view>
                    </picker>
                </view>
            </view>
            <view class="bottom" />
            <input-item
                name="userName"
                :error="errList.indexOf('userName') > -1"
                label="持卡人姓名"
                placeholder="请输入持卡人姓名"
                type="text"
                @input="(e) => inputChange(e, 'userName')"
            />
            <input-item
                name="cardType"
                :error="errList.indexOf('cardType') > -1"
                label="证件类型"
                :select-data="['身份证']"
                type="select"
                @change="(e) => inputChange(e, 'cardType')"
            >
                <template #suffix>
                    <uni-icons type="forward" size="16" color="#ccc" />
                </template>
            </input-item>
            <input-item
                name="cardNo"
                label="证件号"
                :error="errList.indexOf('cardNo') > -1"
                :border="false"
                placeholder="请输入证件号码"
                type="text"
                @input="(e) => inputChange(e, 'cardNo')"
            />

            <view class="bottom" />
            <input-item
                name="phone"
                label="手机号"
                :error="errList.indexOf('phone') > -1"
                placeholder="请输入银行预留手机号"
                type="number"
                @input="(e) => inputChange(e, 'phone')"
            />
            <input-item
                name="code"
                label="验证码"
                :error="errList.indexOf('code') > -1"
                :border="false"
                placeholder="请输入验证码"
                :maxlength="6"
                type="number"
                width="320rpx"
                @input="(e) => inputChange(e, 'code')"
            >
                <template #suffix>
                    <view :class="['get-code', data.timeStatus === 'wait' && 'code-wait']" @click="getCode">
                        {{ data.getMsg }}
                    </view>
                </template>
            </input-item>
            <view class="error-content">
                <template v-for="(item, key) in rules" :key="key">
                    <view v-if="errList.indexOf(key) > -1" class="error-info">
                        <uni-icons type="info" size="20" color="#E82E29" />
                        {{ item.message }}
                    </view>
                </template>
            </view>
        </view>
        <footer-button
            :show-agreenment="data.showAgreenment"
            :text="data.showAgreenment ? '同意协议并签约' : '签约'"
            theme="solid"
            type="primary"
            @click="onAgreen"
            @agreen-click="agreenClick"
        />
        <!-- 图形码弹窗 -->
        <uni-popup ref="codeModal" type="center">
            <view class="pic-code">
                <view class="title">图形验证码</view>
                <view class="pic-content">
                    <img
                        class="code-img"
                        :src="data.verificationImgCode ? 'data:image/png;base64,' + data.verificationImgCode : ''"
                        alt=""
                        @click="getImgCode('again')"
                    />
                    <input class="code-input" type="text" placeholder="请输入图形验证码" @input="codeInput" />
                </view>
                <view class="footer">
                    <button class="confirm" @click="picCodeConfirm">确认</button>
                </view>
            </view>
        </uni-popup>
        <!-- 协议弹窗 -->
        <uni-popup ref="agreenModal" type="center">
            <view class="agreen-modal">
                <view class="title"> {{ agreement[BANK_CODE]?.title }} </view>
                <view class="close" @click="agreenClose">
                    <uni-icons type="closeempty" size="24" color="#ccc" />
                </view>
                <view class="content">
                    <view v-for="(item, index) in agreement[BANK_CODE]?.content" :key="index + '_'">
                        <view
                            v-if="item.text"
                            class="text-indent"
                            :style="{ fontWeight: item.type ? item.type : undefined }"
                            >{{ item.text }}</view
                        >
                        <view v-else class="text-indent">
                            <text
                                v-for="(value, i) in item.textArr"
                                :key="i + '_'"
                                :style="{ fontWeight: value.type ? value.type : undefined }"
                            >
                                {{ value.text }}
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>
        <!-- #ifdef QSBANK-->
        <!-- 选择银行卡弹窗 -->
        <uni-popup :ref="bankCardSelectDialog" type="bottom">
            <view class="bankcard-dialog">
                <view class="bankcard-dialog-header">
                    {{ '选择银行卡' }}
                    <view class="bankcard-dialog-header-back" @click="handleBankCardClose">
                        <uni-icons color="#CCCCCC" type="back" size="20" />
                    </view>
                </view>
                <view class="bankcard-dialog-content">
                    <uni-list>
                        <uni-list-item
                            v-for="item in data.qsBankCardList"
                            :key="item.value"
                            clickable
                            :thumb="iconQuickQsbank"
                            thumb-size="sm"
                            :title="item.label"
                            @click="selectBankItemClick(item)"
                        >
                            <template #footer>
                                <radio
                                    class="bankcard-dialog-radio"
                                    :value="item.value"
                                    :checked="item.value == data.formData.bankNo"
                                />
                            </template>
                        </uni-list-item>
                    </uni-list>
                </view>
            </view>
        </uni-popup>
        <!-- #endif -->
    </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import FooterButton from '../../components/footer-button.vue';
import InputItem from '../../components/input-item.vue';
import { Base64, Bank } from '../../utils/GlobalUtils';
import {
    queryCardType,
    getVerificationImgCode,
    verificationImgCode,
    quickBind,
    quickAuth,
} from '../../services/payment/quick';
import { queryBankAccountInfo } from '../../services/payment/payment';
import { onLoad } from '@dcloudio/uni-app';
import { Regular } from '../../utils/Regular';
import agreement from './agreement';
// #ifdef QSBANK
import iconQuickQsbank from '../../assets/images/payment/icon_quick_qsbank.png';
// #endif
const BANK_CODE: any = process.env.BANK_CODE;
// console.log(agreement[BANK_CODE]);

type dataType = {
    // 齐商银行客户绑定银行卡列表
    qsBankCardList: any;
    // 是否展示协议页面
    showAgreenment: boolean;
    // 获取验证码 文案
    getMsg: string;
    // 倒计时(60s)
    timeCount: number;
    // 倒计时状态(init, wait, retry)
    timeStatus: string;
    // 是否为贷记卡
    isCredit: boolean;
    // 有效期 - 月份选中
    monthIndex: number;
    // 有效期 - 月份数据
    monthData: string[];
    // 有效期 - 年份选中
    yearIndex: number;
    // 有效期 - 年份数据
    yearData: string[];
    // 表单数据
    formData: any;
    // 应用appid
    appid: string;
    // 页面参数
    params: any;
    // 用户输入的图形验证码
    inputImgCode: string;
    // 图形验证码(base64格式图片)
    verificationImgCode: string;
    // 验证码 key,校验验证码时需要上送此字段
    verificationImgId: string;
    //签约令牌
    signToken?: string;
};

const agreenModal = ref();
const codeModal = ref();
// state数据
const data: dataType = reactive({
    qsBankCardList: [],
    showAgreenment: BANK_CODE !== 'qsbank', //齐商不展示协议，其他银行正常展示
    getMsg: '获取验证码',
    timeCount: 60,
    timeStatus: 'init',
    formData: {
        cvv2: '',
        expired: '',
    },
    appid: '',
    isCredit: false,
    monthIndex: -1,
    monthData: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    yearIndex: -1,
    yearData: [],
    params: {},
    inputImgCode: '',
    verificationImgCode: '',
    verificationImgId: '',
});
// 错误规则
const rules = reactive({
    bankNo: {
        message: '银行卡格式错误',
    },
    cardNo: {
        message: '身份证格式错误',
    },
    userName: {
        message: '持卡人姓名格式错误',
    },
    phone: {
        message: '手机号格式错误',
    },
    code: {
        message: '验证码格式错误',
    },
    cvv2: {
        message: 'CVV2格式错误',
    },
    expired: {
        message: '有效期格式错误',
    },
});
// 错误列表
let errList: string[] = reactive([]);

const init = () => {
    // 年份数据
    const years: string[] = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 2100 - currentYear; i++) {
        years.push(currentYear + i + '');
    }
    data.yearData = years;
    // 初始index
    // data.monthIndex = 0;
    // data.yearIndex = new Date().getFullYear() - 2000;
};

const showToast = (title) => {
    uni.showToast({
        icon: 'none',
        title,
        duration: 2500,
    });
};

// #ifdef QSBANK
let bankCardSelectDialogRef: any = {};
const bankCardSelectDialog = (el) => {
    bankCardSelectDialogRef = el;
};
const handleBankCardClick = () => {
    bankCardSelectDialogRef.open();
};
const handleBankCardClose = () => {
    bankCardSelectDialogRef.close();
};
const verifyBankCard = (value) => {
    const event: any = {};
    event.detail = {};
    event.detail.value = value;
    // eslint-disable-next-line
    cardInput(event);
};
const selectBankItemClick = (item) => {
    handleBankCardClose();
    verifyBankCard(item.value);
};
const formatCardNumber = (num) => {
    // return num ? num.replace(/\s/, '').replace(/([0-9]{4})(?=[0-9])/g, '$1 ') : '';
    return num
        ? num
              .replace(/\s/, '') // eslint-disable-line
              .replace(/^(\d{6})(\d*)(\d{4})$/, (a, b, c, d) => b + c.replace(/\d/g, '*') + d) // eslint-disable-line
              .replace(/(.{4})(?=.)/g, '$1 ') // eslint-disable-line
        : '';
};
const formatCardList = (list) => {
    return list.map((item) => {
        return {
            label: formatCardNumber(item.bankCardNo),
            value: item.bankCardNo,
        };
    });
};
const queryQSBankCardList = () => {
    const { thirdUserId, appid, signSource, mchId } = data.params;
    queryBankAccountInfo({
        thirdUserId,
        appid,
        signSource,
        mchId,
    }).then((res) => {
        if (res.result === '200') {
            if (res?.message?.data?.length > 0) {
                data.qsBankCardList = formatCardList(res.message.data);
                verifyBankCard(data.qsBankCardList[0].value);
                uni.showToast({
                    title: '已默认最新的银行卡，可点击切换',
                    icon: 'none',
                    duration: 2500,
                });
            } else {
                uni.showToast({
                    title: '没有可用的银行卡',
                    icon: 'none',
                    duration: 2500,
                });
            }
        }
    });
};
// #endif

onLoad(async (options) => {
    console.log(options);
    data.params = options;
    data.params.thirdUserId = uni.getStorageSync('OPENID') || '';
    data.appid = uni.getStorageSync('APPID');

    init();

    // #ifdef QSBANK
    queryQSBankCardList();
    // #endif
});

// 银行卡卡号变更
const cardInput = async (e) => {
    data.formData.bankNo = e.detail.value;
    try {
        const res = await queryCardType({ bankCardNo: Base64(Bank.removeFomart(e.detail.value)) });
        if (res?.result === '200') {
            data.isCredit = res?.message == 2;
        } else {
            throw new Error(res?.message?.remark);
        }
    } catch (error: any) {
        showToast(error.message || '银行卡识别失败');
    }
};

// 验证码输入
const codeInput = (e) => {
    data.inputImgCode = e.detail.value;
};

// 清楚表单错误
const clearError = (errorName: string[]) => {
    errorName.forEach((item) => {
        const index = errList.indexOf(item);
        errList.splice(index, 1);
    });
    // console.log(errList);
};

/**
 * 监听银行卡号数据变更
 */
const inputCardChange = (item) => {
    const val = Bank.fomart(item.detail ? item.detail.value : item.value);
    data.formData.bankNo = val;
};

// 监听表单数据变更
const inputChange = (item, name) => {
    data.formData[name] = item.detail ? item.detail.value : item.value;
    clearError([name]);
};

// 有效期变更
const onDateChange = (type, e) => {
    let month, year;
    if (type === 'month') {
        data.monthIndex = e.detail.value;
        month = data.monthData[e.detail.value];
        year = data.yearIndex !== undefined ? data.yearData[data.yearIndex] : '';
    } else {
        data.yearIndex = e.detail.value;
        month = data.monthIndex >= 0 ? data.monthData[data.monthIndex] : '';
        year = data.yearData[e.detail.value];
    }
    // 年份只需要后两位数
    if (year) {
        year = (year + '').slice(2);
    }
    // 有效期
    data.formData.expired = year + month + '';
    if (year && month) clearError(['expired']);
};

// 倒计时
const codeTimeOut = (count) => {
    let c = count || 60;
    data.getMsg = c + '秒后重新获取';
    if (count === 0 && data.timeStatus === 'wait') {
        data.timeStatus = 'retry';
        data.timeCount = 60;
        data.getMsg = '重新获取';
        return;
    }
    let timer = setTimeout(() => {
        c--;
        data.timeCount = c;
        data.getMsg = c + '秒后重新获取';
        codeTimeOut(c);
        clearTimeout(timer);
    }, 1000);
};

// 获取图形验证码
const getImgCode = async (type) => {
    const { thirdUserId } = data.params;
    // console.log('verificationImgCode====' + data.verificationImgCode);
    try {
        const res = await getVerificationImgCode({ thirdUserId });
        if (res?.result === '200') {
            // 打开图形码验证
            type !== 'again' && codeModal.value.open();
            data.verificationImgCode = res?.message.verificationCodeImg;
            data.verificationImgId = res?.message.kaptchaId;
        } else {
            throw new Error(res?.message?.remark);
        }
    } catch (error: any) {
        showToast(error.message || '获取图形验证码失败');
    }
};

// 校验表单
const validateForm = async (formData, needVerCode = true) => {
    if (!formData.bankNo || !Regular.card.test(Bank.removeFomart(formData.bankNo))) {
        errList.push('bankNo');
        throw new Error(rules['bankNo']['message']);
    }

    // 贷记卡需要校验cvv2和有效期
    if (data.isCredit) {
        if (!formData.cvv2) {
            errList.push('cvv2');
            throw new Error(rules['cvv2']['message']);
        }
        if (!formData.expired) {
            errList.push('expired');
            throw new Error(rules['expired']['message']);
        }
    }

    if (!formData.userName) {
        errList.push('userName');
        throw new Error(rules['userName']['message']);
    }
    if (!formData.cardNo || !Regular.idCard.test(formData.cardNo)) {
        errList.push('cardNo');
        throw new Error(rules['cardNo']['message']);
    }
    if (!formData.phone || !Regular.mobile.test(formData.phone)) {
        errList.push('phone');
        throw new Error(rules['phone']['message']);
    }
    if (data.timeStatus === 'init' && needVerCode) {
        throw new Error('请先获取验证码');
    }
    if (!formData.code && needVerCode) {
        errList.push('code');
        throw new Error(rules['code']['message']);
    }
    return true;
};

// 快捷鉴权（发送验证码）
const quickAuthReq: any = async ({ thirdUserId, signSource, mchId, creditParams }) => {
    const { formData, appid } = data;
    return await quickAuth({
        thirdUserId,
        signSource,
        mchId,
        appid,
        clientName: Base64(formData.userName),
        bankCardNo: Base64(Bank.removeFomart(formData.bankNo)),
        identType: 1,
        idCardNo: Base64(formData.cardNo),
        mobile: Base64(formData.phone),
        ...creditParams,
    });
};

const quickAuthReqest = async () => {
    const { thirdUserId, signSource, mchId } = data.params;
    const { formData, isCredit } = data;
    let creditParams = {};
    // 贷记卡
    if (isCredit) {
        creditParams = {
            cvv2No: Base64(formData.cvv2),
            cardValidity: Base64(formData.expired),
        };
    }
    // 鉴权（发送验证码）
    const smsRes = await quickAuthReq({
        thirdUserId,
        signSource,
        mchId,
        creditParams,
    });

    // 验证码发送成功
    if (smsRes?.result === '200') {
        if (data.timeStatus === 'init' || data.timeStatus === 'retry') {
            data.timeStatus = 'wait';
            codeTimeOut(data.timeCount);
        }
        data.signToken = smsRes.message.signToken;
    }
};

// 获取验证码
const getCode = async () => {
    const { formData } = data;
    // let creditParams = {};
    // 贷记卡
    // if (isCredit) {
    //     creditParams = {
    //         cvv2No: Base64(formData.cvv2),
    //         cardValidity: Base64(formData.expired),
    //     };
    // }
    try {
        // if (data.timeStatus === 'init') {
        if (data.timeStatus !== 'wait') {
            await validateForm(formData, false);
            // #ifdef CDRCB
            getImgCode('first');
            // #endif
            // #ifdef STANDARD || QSBANK || HNNXBANK
            quickAuthReqest();
            // #endif
        }

        // }

        // // 重新获取(已经过了图形验证)，重新发送短信
        // if (data.timeStatus === 'retry') {
        //     // 鉴权（发送验证码）
        //     const smsRes = await quickAuthReq({
        //         thirdUserId,
        //         signSource,
        //         mchId,
        //         creditParams,
        //     });

        //     // 验证码发送成功
        //     if (smsRes?.result === '200') {
        //         if (timeStatus === 'init' || timeStatus === 'retry') {
        //             data.timeStatus = 'wait';
        //             codeTimeOut(data.timeCount);
        //         }
        //         data.signToken = smsRes.message.signToken;
        //     } else {
        //         throw new Error(smsRes?.message);
        //     }
        // }
    } catch (error: any) {
        showToast(error.message || '校验不通过');
    }
};

// 确认图形验证码
const picCodeConfirm = async () => {
    const { thirdUserId } = data.params;
    const { inputImgCode, verificationImgId } = data;
    // 校验图形验证码
    const res = await verificationImgCode({
        thirdUserId,
        verificationCode: inputImgCode,
        kaptchaId: verificationImgId,
    });

    // 校验图形码成功
    if (res?.result === '200') {
        codeModal.value.close();
        await quickAuthReqest();
    } else {
        // 重新刷新图形验证码
        getImgCode('again');
        throw new Error(res?.message);
    }
};
// 同意协议并签约
const onAgreen = async () => {
    const { formData, signToken } = data;
    try {
        await validateForm(formData);
        try {
            const { mchId } = data.params;
            if (!signToken) {
                return showToast('缺少签约token');
            }
            const res = await quickBind({
                verifyCode: formData.code,
                mchId,
                signToken,
            });
            if (res?.result === '200') {
                console.log('绑卡成功');
                // 绑卡成功
                uni.navigateTo({
                    url: '/pages/payment/bind-result?status=success',
                });
            } else {
                throw new Error(res?.message);
            }
        } catch (error: any) {
            console.log('绑卡失败');
            // 绑卡失败
            uni.navigateTo({
                url: '/pages/payment/bind-result?status=fail&message=' + error.message,
            });
        }
    } catch (error: any) {
        showToast(error.message || '校验不通过');
    }
};
// 显示服务协议弹窗
const agreenClick = () => {
    agreenModal.value.open();
};

// 关闭服务协议弹窗
const agreenClose = () => {
    agreenModal.value.close();
};
</script>

<style lang="scss" scoped>
.add-card {
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    min-height: 100vh;
}
.card-form {
    flex: 1 1;
    // padding-bottom: 280rpx;
    .bottom {
        width: 100%;
        height: 20rpx;
        background-color: $uni-bg-color-grey;
    }
    .get-code {
        color: $uni-text-color-active;
        font-size: $uni-font-size-sm;
        padding: 10rpx 0 10rpx 10rpx;
    }
    .code-wait {
        color: $uni-text-color-placeholder;
    }
    // #ifdef QSBANK
    .cardNum {
        display: flex;
        align-items: center;
        position: relative;
        padding: 40rpx 30rpx;
        background-color: #fff;

        &-label {
            font-size: $uni-font-size-sm;
            color: $uni-color-subtitle;
            flex: 0 1 220rpx;
        }
        &-content {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
        }
        &-text {
            flex: 1 1;
            font-size: $uni-font-size-sm;
            color: $uni-text-color;
        }
    }
    // #endif
    .credit-date {
        display: flex;
        align-items: center;
        background-color: $uni-text-color-inverse;
        padding: 40rpx 30rpx;
        .credit-label {
            width: 156rpx;
            display: flex;
            align-items: center;
            font-size: $uni-font-size-sm;
            color: $uni-color-subtitle;
        }
        .credit-content {
            display: flex;
            align-items: center;
        }
        .credit-select {
            color: $uni-text-color;
            font-size: $uni-font-size-sm;
        }
        .select-label {
            display: flex;
            align-items: center;
            padding-right: 50rpx;
        }
        .select-icon {
            margin-left: 20rpx;
        }
    }
    .error-content {
        padding: 20rpx 30rpx;
    }
    .error-info {
        display: flex;
        align-items: center;
        font-size: $uni-font-size-sm;
        color: $uni-color-error;
        margin-bottom: 20rpx;
        :deep(.uni-icons) {
            margin-right: 12rpx;
        }
    }
}
.pic-code {
    width: 480rpx;
    box-sizing: border-box;
    border-radius: 20rpx;
    background-color: $uni-text-color-inverse;
    .title {
        color: $uni-text-color;
        font-size: $uni-font-size-sm;
        font-weight: 600;
        text-align: center;
        padding: 40rpx 0 0;
    }
    .pic-content {
        padding: 30rpx 40rpx 40rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .code-img {
            width: 140rpx;
            height: 60rpx;
            margin-right: 40rpx;
            display: block;
        }
        .code-input {
            color: $uni-text-color;
            font-size: $uni-font-size-sm;
        }
    }
    .footer {
        .confirm {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $uni-text-color-inverse;
            height: 100rpx;
            color: $uni-text-color-active;
            font-size: $uni-font-size-sm;
            border-left: none;
            border-right: none;
            border-bottom: none;
            outline: none;
            border-radius: 0 0 20rpx 20rpx;
        }
    }
}
.agreen-modal {
    box-sizing: border-box;
    position: relative;
    background-color: $uni-text-color-inverse;
    width: 630rpx;
    border-radius: 20rpx;
    margin: 0 auto;
    padding: 30rpx 40rpx 40rpx;
    .title {
        color: $uni-text-color;
        font-weight: 600;
        text-align: center;
        padding: 0 40rpx;
    }
    .close {
        position: absolute;
        top: 24rpx;
        right: 30rpx;
    }
    .content {
        margin-top: 44rpx;
        font-size: $uni-font-size-sm;
        height: 700rpx;
        overflow-y: scroll;
        color: $uni-text-color;
        .text-indent {
            text-indent: 30rpx;
        }
    }
}
// #ifdef QSBANK
.bankcard-dialog {
    background-color: $uni-bg-color-inverse;
    border-radius: 16rpx 16rpx 0 0;

    &-header {
        position: relative;
        padding: 30rpx 20rpx;
        border-bottom: 2rpx solid $uni-border-color;
        text-align: center;

        &-back {
            text-align: left;
            position: absolute;
            width: 100rpx;
            top: 32rpx;
            left: 20rpx;
        }
    }

    &-content {
        padding: 0rpx 20rpx;
        min-height: 640rpx;
    }
}
// #endif
</style>
