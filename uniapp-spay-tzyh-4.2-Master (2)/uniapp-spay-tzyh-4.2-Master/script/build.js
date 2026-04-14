const shell = require('shelljs');
const path = require('path');
// const manifest = require('../src/manifest.json');
const package = require('../package.json');
const currentPath = path.resolve(__dirname, '..');
const { loadEnv } = require('vite');
const { generateManifestJson, generatePagesJson } = require('./generateJson.js');
// 自定义编译命令
const compile = process.argv[2];
// env配置文件名
const envConfig = process.argv[3] || 'production';
console.log('🚀 ~ envConfig:', envConfig);
//env目录下配置的环境配置
const viteEnv = loadEnv(envConfig, path.join(currentPath, 'env'));
// 环境变量
const env = package['uni-app'].scripts[compile].env;
// 银行bankCode
const bankCode = env.BANK_CODE;
console.log('bankCode', bankCode);
// 编译平台
const platform = env.UNI_PLATFORM;
console.log('platform', platform);
// 基础目录
const baseUrl = env.APP_BASE_URL;
// 构建包目录，只保留webapp这一层目录
const flag = baseUrl.lastIndexOf('/');
const buildPath = baseUrl.substr(flag + 1);
console.log('baseUrl', baseUrl);
console.log('buildPath', buildPath);
// 判断是否传了--mode 参数
if (JSON.stringify(viteEnv) === '{}') {
    console.error('输入的 --mode 环境参数错误，请检查后重新运行');
    return;
}

Promise.all([generateManifestJson(), generatePagesJson()]).then(() => {
    shell.exec(`uni build -p ${compile} --mode ${envConfig}`, function (code) {
        console.log('Exit code:', code);
        // 拷贝静态资源，格式：public/平台/银行编码
        shell.cp('-rf', `public/${platform}/${bankCode}`, `dist/build/${platform}`);
        if (platform === 'h5') {
            shell.rm('-rf', `build/${buildPath}`);
            shell.mkdir('-p', currentPath, 'build');
            shell.cp('-rf', 'dist/build/h5', `build/${buildPath}`);
        }
    });
});