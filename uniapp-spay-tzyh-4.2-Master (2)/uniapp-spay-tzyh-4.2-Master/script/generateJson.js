const path = require('path');
const fs = require('fs');
const currentPath = path.resolve(__dirname, '..');
const package = require('../package.json');
const { loadEnv } = require('vite');
// 自定义编译命令
const compile = process.argv[2];
// env配置文件名
const envConfig = process.argv[3] || 'development';
//env目录下配置的环境配置
const viteEnv = loadEnv(envConfig, path.join(currentPath, 'env'));
// 环境变量
const env = package['uni-app'].scripts[compile].env;
// 银行bankCode
const bankCode = env.BANK_CODE;
// 编译平台
const platform = env.UNI_PLATFORM;
const baseUrl = env.APP_BASE_URL;
const pluginFlag = viteEnv[`VITE_${env.BANK_CODE.toUpperCase()}_AD_MP_WEIXIN_PLUGIN`] || env.PLUGIN_FLAG;
const pluginFlagArr = pluginFlag ? pluginFlag.split(',').map((i) => i.trim()) : [];

/**
 * 重新组装生成manifest.json
 */
function generateManifestJson() {
    return new Promise((resolve, reject) => {
        const manifest = require('../src/manifest');
        manifest.h5.router.base = `/${baseUrl}/`;
        if (platform === 'mp-weixin') {
            // 默认清空微信支付券威富通广告插件、凯尔文广告、uniad、北京彩狮、首展插件引入
            if (manifest[platform].plugins.swfAdvPlugin) delete manifest[platform].plugins.swfAdvPlugin;
            if (manifest[platform].plugins.sendCoupon) delete manifest[platform].plugins.sendCoupon;
            if (manifest[platform].plugins['uni-ad']) delete manifest[platform].plugins['uni-ad'];
            if (manifest[platform].plugins['coral-adv']) delete manifest[platform].plugins['coral-adv'];
            if (manifest[platform].plugins.iclickSendCoupon) delete manifest[platform].plugins.iclickSendCoupon;
            if (manifest[platform].plugins.bynPlugin) delete manifest[platform].plugins.bynPlugin;
            if (manifest[platform].plugins['fshows-plugin']) delete manifest[platform].plugins['fshows-plugin'];
            if (manifest[platform].plugins.wkcoupon) delete manifest[platform].plugins.wkcoupon;
            if (manifest[platform].plugins['yg-emp-plugin']) delete manifest[platform].plugins['yg-emp-plugin'];
            if (manifest[platform].plugins.brightSunSendCoupon) delete manifest[platform].plugins.brightSunSendCoupon;
            if (manifest[platform].plugins['uni-ad-wx']) delete manifest[platform].plugins['uni-ad-wx'];
            // 增加插件
            if (pluginFlag) {
                const flag = pluginFlagArr;
                console.warn('🚀 ~ returnnewPromise ~ flag:', flag);
                // 威富通广告插件(服务稳定助手)
                if (flag.indexOf('swfad') >= 0) {
                    manifest[platform].plugins.swfAdvPlugin = {
                        version: 'latest',
                        provider: 'wx06bee6359b106c2b',
                        export: 'pluginsData.js',
                    };
                }
                // 威富通卡劵插件
                if (flag.indexOf('wftquan') >= 0) {
                    manifest[platform].plugins.swfAdvPlugin = {
                        version: 'latest',
                        provider: 'wx06bee6359b106c2b',
                        export: 'pluginsData.js',
                    };
                    manifest[platform].plugins.sendCoupon = {
                        version: '1.4.9',
                        provider: 'wxf3f436ba9bd4be7b',
                    };
                }
                // uniad广告插件(uniAD、珊瑚运营平台)
                // if (flag.indexOf('uniad') >= 0) {
                //     manifest[platform].plugins['uni-ad'] = {
                //         version: '1.3.7',
                //         provider: 'wxf72d316417b6767f',
                //     };
                //     manifest[platform].plugins['coral-adv'] = {
                //         version: '1.0.27',
                //         provider: 'wx0e203209e27b1e66',
                //     };
                //     manifest[platform].plugins['uni-ad-wx'] = {
                //         version: '1.0.3',
                //         provider: 'wxf5831aa8e0fc2a0b',
                //     };
                // }
                // 派深广告插件(好物集甄选)首展内部引用，我方不接入
                if (flag.indexOf('ps') >= 0) {
                    manifest[platform].plugins.iclickSendCoupon = {
                        version: 'latest',
                        provider: 'wx3cb160a982b5f5e6',
                    };
                    manifest[platform].plugins.sendCoupon = {
                        version: '1.4.9',
                        provider: 'wxf3f436ba9bd4be7b',
                    };
                }
                // 北京彩狮半屏广告插件
                // if (flag.indexOf('bjcs') >= 0) {
                //     manifest[platform].plugins.bynPlugin = {
                //         'version': 'latest',
                //         'provider': 'wxdedf12325bfe9e8f'
                //     };
                // }

                // 云鼯广告插件
                if (flag.indexOf('yw') >= 0) {
                    manifest[platform].plugins.brightSunSendCoupon = {
                        version: 'latest',
                        provider: 'wxde639ea1c06b6369',
                    };
                    manifest[platform].plugins.sendCoupon = {
                        version: '1.4.9',
                        provider: 'wxf3f436ba9bd4be7b',
                    };
                }
                // 首展页面插件(付呗卡券)
                if (flag.indexOf('fshows') >= 0) {
                    manifest[platform].plugins['fshows-plugin'] = {
                        version: 'latest',
                        provider: 'wx6e9ba7158dcc1452',
                    };
                }
                // 沃氪页面插件(好物研究社)
                if (flag.indexOf('wk') >= 0) {
                    manifest[platform].plugins.wkcoupon = {
                        version: 'latest',
                        provider: 'wx833427bcd18d9f7e',
                    };
                }
                // 扬歌半屏插件(柠檬露)
                // if (flag.indexOf('yg') >= 0) {
                //     manifest[platform].plugins['yg-emp-plugin'] = {
                //         version: 'latest',
                //         provider: 'wxf3cc22a86a0e092d',
                //         export: 'pluginsData.js',
                //     };
                // }
                // 点灯科技插件(DataHandle)
                if (flag.indexOf('ddkj') >= 0) {
                    manifest[platform].plugins.AdPlusPlugin = {
                        version: 'latest',
                        provider: 'wxade0f2ab00868fc1',
                    };
                }
            }
        }
        console.log('manifest', manifest);
        fs.writeFile(`${currentPath}/src/manifest.json`, JSON.stringify(manifest, null, '    '), (e) => {
            if (e) {
                console.error('manifest.json 配置文件更新失败', e);
                reject();
                return;
            }
            console.log(
                '==============================================\n manifest.json 配置文件更新成功 \n=============================================='
            );
            resolve();
        });
    });
}

/**
 * 重新组装生成pages.json
 */
function generatePagesJson() {
    return new Promise((resolve, reject) => {
        // const pages = require('../src/pages');
        const routerFile = path.join(currentPath, 'src', 'router', `${bankCode}.ts`);

        fs.readFile(routerFile, 'utf8', (err, data) => {
            if (err) {
                throw new Error(`读取 ${bankCode}.js失败，请确认是否创建该文件或格式是否正确`);
            } else {
                // console.warn('🚀 ~ fs.readFile ~ data:', data)
                const routerConfig = require(routerFile);
                // console.warn('🚀 ~ fs.readFile ~ routerFile:', routerFile)
                const pages = routerConfig[platform];
                // console.warn('🚀 ~ fs.readFile ~ routerConfig:', routerConfig)
                // console.warn('🚀 ~ fs.readFile ~ pages:', pages)
                if (!pages) {
                    reject();
                    throw new Error(`读取 ${platform} 平台配置失败，请确认格式是否正确`);
                }
                // 默认清空微信支付券、威富通广告插件引入
                if (pages.globalStyle.usingComponents['swiftpass-assistant']) {
                    delete pages.globalStyle['swiftpass-assistant'];
                }
                if (pages.globalStyle.usingComponents['send-coupon']) delete pages.globalStyle['send-coupon'];
                if (platform === 'mp-weixin') {
                    // 增加插件
                    if (pluginFlag) {
                        const flag = pluginFlagArr;
                        // 威富通广告插件(服务稳定助手)
                        if (flag.indexOf('swfad') >= 0) {
                            pages.globalStyle.usingComponents['swiftpass-assistant'] =
                                'plugin://swfAdvPlugin/swiftpass-assistant';
                        }
                        // 威富通卡劵插件
                        if (flag.indexOf('wftquan') >= 0) {
                            pages.globalStyle.usingComponents['swiftpass-assistant'] =
                                'plugin://swfAdvPlugin/swiftpass-assistant';
                            pages.globalStyle.usingComponents['send-coupon'] = 'plugin://sendCoupon/send-coupon';
                        }
                        // 派深插件
                        if (flag.indexOf('ps') >= 0) {
                            pages.globalStyle.usingComponents['send-coupon'] = 'plugin://sendCoupon/send-coupon';
                        }
                        // 云鼯插件
                        if (flag.indexOf('yw') >= 0) {
                            pages.globalStyle.usingComponents['send-coupon'] = 'plugin://sendCoupon/send-coupon';
                        }
                    }
                }
                fs.writeFile(`${currentPath}/src/pages.json`, JSON.stringify(pages, null, '    '), (e) => {
                    if (e) {
                        console.error('pages.json 配置文件更新失败', e);
                        reject();
                        return;
                    }
                    console.log(
                        '==============================================\n pages.json 配置文件更新成功 \n=============================================='
                    );
                    resolve();
                });
            }
        });
    });
}

module.exports = {
    generateManifestJson,
    generatePagesJson,
};
