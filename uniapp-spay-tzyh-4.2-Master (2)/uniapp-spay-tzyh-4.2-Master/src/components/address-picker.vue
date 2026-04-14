<template>
    <view :class="[text ? 'address-item' : 'address-item active']" @click="toggleShowPicker">{{ text }}</view>
    <!--    picker-vier    -->
    <view v-if="visible" class="picker-box" @touchmove="(e) => e.preventDefault()">
        <view :class="['picker-content-box', animate && 'visible']">
            <view class="operation-bar">
                <button class="red" type="default" plain="true" @click="toggleShowPicker">取消</button>
                <button class="blue" type="default" plain="true" @click="handleChangeAddress">确认</button>
            </view>
            <picker-view
                :value="addressIndex"
                class="picker-view"
                indicator-class="indicator-custom"
                @change="generateAddress"
            >
                <picker-view-column>
                    <view v-for="item in addressList" :key="item.value" class="item">{{ item.text }}</view>
                </picker-view-column>
                <picker-view-column>
                    <view v-for="item in addressList[addressIndex[0]].children" :key="item.value" class="item">{{
                        item.text
                    }}</view>
                </picker-view-column>
                <picker-view-column v-if="column === 3">
                    <view
                        v-for="item in addressList[addressIndex[0]].children[addressIndex[1]].children"
                        :key="item.value"
                        class="item"
                        >{{ item.text }}</view
                    >
                </picker-view-column>
            </picker-view>
        </view>
    </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AddressPicker',
    props: {
        text: {
            type: String,
            required: true,
        },
        addressIndex: {
            type: Array,
            required: true,
        },
        addressList: {
            type: Array,
            required: true,
        },
        column: {
            type: Number,
            default: 3,
        },
    },
    emits: ['generate', 'change'],
    data() {
        return {
            visible: false,
            animate: false,
        };
    },
    methods: {
        toggleShowPicker() {
            if (this.visible) {
                this.animate = !this.visible;
                setTimeout(() => {
                    this.visible = !this.visible;
                }, 300);
            } else {
                this.visible = !this.visible;
                setTimeout(() => {
                    this.animate = this.visible;
                });
            }
        },
        generateAddress({ detail }) {
            console.log(detail.value);
            const addressIndex = detail.value;
            this.$emit('generate', addressIndex);
        },
        handleChangeAddress() {
            const i = this.addressIndex;
            // p 省，c 市，a 区
            const p = this.addressList[i[0]];
            const c = p.children[i[1]];

            let address;
            let addressText;
            if (this.column === 3) {
                const a = p.children[i[1]].children[i[2]];
                address = [p.value, c.value, a.value];
                addressText = p.text + c.text + a.text;
            } else {
                address = [p.value, c.value];
                addressText = p.text + c.text;
            }

            this.$emit('change', address, addressText, c.text);
            this.toggleShowPicker();
        },
    },
});
</script>

<style scoped lang="scss">
::v-deep.indicator-custom {
    height: 100upx;
}
.picker-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;

    .picker-content-box {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 0;
        transition: height 0.5s;
        overflow: hidden;

        &.visible {
            height: 600upx;
        }
    }
    .operation-bar {
        position: absolute;
        left: 0;
        top: 0;
        height: 100upx;
        width: 100vw;
        display: flex;
        justify-content: space-between;
        background: #fff;
        z-index: 19;

        uni-button {
            margin: 0;
            padding: 0;
            width: 120upx;
            border: none;
            font-size: 28upx;
            line-height: 100upx;

            &.red {
                color: #ee0a24;
            }
            &.blue {
                color: #1989fa;
            }
        }
    }
    .picker-view {
        width: 100vw;
        height: 600upx;
        z-index: 9;
        background: #fff;

        .item {
            height: 100upx;
            line-height: 100upx;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
    }
}
::v-deep.uni-forms-item.form-item.address-item {
    .uni-forms-item__content {
        font-size: 1rem;
    }
}
.address-item {
    width: 100%;
    height: 104upx;
    line-height: 104upx;
    font-size: 1rem;
    & .active::before {
        position: absolute;
        top: 0;
        left: 200upx;
        display: block;
        content: '请输入';
        font-size: 1rem;
        color: #999;
        font-weight: 200;
    }
}
</style>
