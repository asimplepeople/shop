module.exports = {
    hostWx: wx, // 必传入，微信原生小程序wx对象
    webviewUrl: '/pages/common/web', // 选传，如果需要支持h5广告需传入主体小程序的webview的页面路径
    webviewUrlKey: 'url', // 选传，如果需要支持h5广告需传入主体小程序的h5链接的key
};
