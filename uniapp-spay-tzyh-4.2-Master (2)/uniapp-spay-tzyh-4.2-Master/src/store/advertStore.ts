const advertStore = {
    state: {
        advertList: [
            // // h5广告
            // {
            //     adNumber: 'AD2406192222',
            //     desc: 'h5',
            //     imgPath: '',
            //     imgWeixinPath: '',
            //     url: 'https://baidu.com',
            //     displayMode: 1,
            //     payType: '0,1,2',
            //     adType: 1,
            //     adSlotTypeList: [217, 218],
            //     launchType: '1',
            //     appId: '',
            //     minProgramUrl: '',
            //     showAdvert: 0,
            // },
            // // 小程序广告
            // {
            //     adNumber: 'AD2408134916',
            //     adSlotTypeList: [217, 218],
            //     adType: 1,
            //     appId: 'wxece3a9a4c82f58c9',
            //     desc: '饿了么',
            //     displayMode: 1,
            //     imgPath: '',
            //     imgWeixinPath: '',
            //     launchType: '2',
            //     minProgramUrl: '',
            //     payType: '0,1,2',
            //     showAdvert: 0,
            //     url: '/index/pages/h5/mtlm/mtlm?mt=3&lm=MTgxNzc4MDc3NzA1NzQ3NjYzMQ%3D%3DNTY0%3D%3D%3D%3D&uid=413236&container=meituan_wxmini&lch=cps:x:0:b6d6b7985905b9a5baf80b245a1536a9:0729h:404:413236',
            // },
            // // 半屏小程序广告
            // {
            //     adNumber: 'AD2406195378',
            //     desc: '半屏小程序',
            //     imgPath: '',
            //     imgWeixinPath: '',
            //     url: '',
            //     displayMode: 1,
            //     payType: '0,1,2',
            //     adType: 1,
            //     adSlotTypeList: [217, 218],
            //     launchType: '3',
            //     appId: 'wxece3a9a4c82f58c9',
            //     minProgramUrl:
            //         '/index/pages/h5/mtlm/mtlm?mt=3&lm=MTgxNzc4MDc3NzA1NzQ3NjYzMQ%3D%3DNTY0%3D%3D%3D%3D&uid=413236&container=meituan_wxmini&lch=cps:x:0:b6d6b7985905b9a5baf80b245a1536a9:0729h:404:413236',
            //     showAdvert: 0,
            // },
            // wx插件广告
            {
                adNumber: 'AD2406190307',
                desc: 'wx插件',
                imgPath: 'https://imgeppcm.hstypay.com/image//3000082475/pdetail/bac770cd972946a089e2d96950608924.jpg',
                imgWeixinPath: '',
                url: 'https://www.baidu.com/',
                displayMode: 1,
                payType: '0,1,2',
                adType: 1,
                adSlotTypeList: [217, 218],
                launchType: '4',
                appId: 'wxde8ac0a21135c07d',
                minProgramUrl:
                    '/index/pages/h5/mtlm/mtlm?mt=3&lm=MTgwNTkwNDU3NzMxNzk5MDQyOA%3D%3DNjg0%3D%3D%3D%3D&uid=363180&container=meituan_wxmini&lch=cps:x:0:ab84a73f6e3f154699d8e7fdcb72b595:fb0626:128:363180',
                showAdvert: 1,
                advertType: 'ps',
            },
            // // 支付后弹窗广告
            // {
            //     adNumber: 'AD2407299321',
            //     desc: '...',
            //     imgPath: 'https://c-ssl.dtstatic.com/uploads/blog/202308/28/73SjeYEgHeqavvO.thumb.1000_0.jpeg',
            //     // imgPath: 'http://adverttest.swiftpass.top/pic/adpic/adbody/2024/08/15/89b9bb07-bfaa-4000-bfdb-dd5c11e2f512.jpg',
            //     // imgPath: 'http://adverttest.swiftpass.top/pic//adpic/adbody/2024/05/24/e05ac26c-bcba-48c1-a53f-94a63ffc9b8a.png',
            //     // imgPath: 'http://adverttest.swiftpass.top/pic//adpic/adbody/2024/05/24/e05ac26c-bcba-48c1-a53f-94a63ffc9b8a.png',
            //     imgWeixinPath: '',
            //     // 美团小程序
            //     // url: 'weixin://wxde8ac0a21135c07d/index/pages/h5/mtlm/mtlm?mt=3&lm=MTgxNzc4MDc3NzA1NzQ3NjYzMQ%3D%3DNTY0%3D%3D%3D%3D&uid=413236&container=meituan_wxmini&lch=cps:x:0:b6d6b7985905b9a5baf80b245a1536a9:0729h:404:413236',
            //     // 全能帮帮学
            //     url: 'weixin://wx8f81cb5ce22ed494/pages/middlelink/middlelink?applyScene=app_middle_page&transWxUser=1&sceneValue=545&redirectUri=https%3A%2F%2Flbook6.jzfdzybs.com%2Fwxtf%2Fgroup%2Fh5index%2Findex26996540947%3Fh5TaskId%3DW6KgyIGuI6MZfIGp6O4d82CUTPsWtJyvR7DAXvNCZd6ENsc35XXW-ArP2WgOVkSiKdIcQC1wWr4%3D%26channelId%3D269965',
            //     displayMode: 1,
            //     payType: '0,2',
            //     adType: 1,
            //     adSlotTypeList: [217, 218],
            //     launchType: '5',
            //     appId: '',
            //     minProgramUrl: '',
            //     showAdvert: 0,
            // },
            // // 支付后banner广告
            // {
            //     adNumber: 'AD2406195377',
            //     desc: '开发-支付后banner',
            //     imgPath: 'https://imgeppcm.hstypay.com/image//3000082475/pdetail/bac770cd972946a089e2d96950608924.jpg',
            //     imgWeixinPath: '',
            //     // url: 'weixin://wx84dd50b996d3d862/gh_bfcd071dba17',
            //     // 全能帮帮学
            //     url: 'weixin://wx8f81cb5ce22ed494/pages/middlelink/middlelink?applyScene=app_middle_page&transWxUser=1&sceneValue=545&redirectUri=https%3A%2F%2Flbook6.jzfdzybs.com%2Fwxtf%2Fgroup%2Fh5index%2Findex26996540947%3Fh5TaskId%3DW6KgyIGuI6MZfIGp6O4d82CUTPsWtJyvR7DAXvNCZd6ENsc35XXW-ArP2WgOVkSiKdIcQC1wWr4%3D%26channelId%3D269965',
            //     // h5
            //     // url: 'https://lbook6.jzfdzybs.com/wxtf/group/h5index/index26996540947?h5TaskId=W6KgyIGuI6MZfIGp6O4d82CUTPsWtJyvR7DAXvNCZd6ENsc35XXW-ArP2WgOVkSiKdIcQC1wWr4=&channelId=269965',
            //     displayMode: 1,
            //     payType: '0,1,2',
            //     adType: 1,
            //     adSlotTypeList: [217, 218],
            //     launchType: '7',
            //     appId: '',
            //     minProgramUrl: '',
            //     showAdvert: 0,
            //     functionSwitch: 1, // 功能开关，是否展示返回按钮 1开启 0关闭
            // },
            // // 虚拟键
            // {
            //     adNumber: 'AD2406195333',
            //     desc: '虚拟键',
            //     imgPath: '',
            //     imgWeixinPath: '',
            //     url: '',
            //     displayMode: 1,
            //     payType: '0,1,2',
            //     adType: 1,
            //     adSlotTypeList: [217, 218],
            //     launchType: '8',
            //     appId: 'wxde8ac0a21135c07d',
            //     minProgramUrl:
            //         '/index/pages/h5/mtlm/mtlm?mt=3&lm=MTgxNzc4MDc3NzA1NzQ3NjYzMQ%3D%3DNTY0%3D%3D%3D%3D&uid=413236&container=meituan_wxmini&lch=cps:x:0:b6d6b7985905b9a5baf80b245a1536a9:0729h:404:413236',
            //     showAdvert: 0,
            //     showRevert: 0, // 模态弹框操作按钮：1，则需要开启返回字段，0,则不需要开启返回字段
            // },
        ], // 广告列表
        advertParam: {}, // 广告参数
        showShield: false, // 是否提供关闭广告入口
    },
    mutations: {
        setAdvertList(state, info) {
            state.advertList = info;
        },
        setAdvertParam(state, info) {
            state.advertParam = info;
        },
        setShowShield(state, info) {
            state.showShield = info;
        },
    },
    getters: {},
    actions: {
        updateAdvertList({ commit }, info) {
            commit('setAdvertList', info);
        },
        updateAdvertParam({ commit }, info) {
            commit('setAdvertParam', info);
        },
        updateShowShield({ commit }, info) {
            commit('setShowShield', info);
        },
    },
};

export default advertStore;
