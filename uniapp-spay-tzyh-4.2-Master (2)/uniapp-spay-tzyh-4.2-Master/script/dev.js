const shell = require('shelljs');
const path = require('path');
// const manifest = require('../src/manifest.json');
const package = require('../package.json');
const currentPath = path.resolve(__dirname, '..');
const { loadEnv } = require('vite');
const { generateManifestJson, generatePagesJson } = require('./generateJson.js');

// 自定义编译命令
const compile = process.argv[2];
console.log('compile', compile);
// env配置文件名
const envConfig = process.argv[3] || 'development';
console.log('🚀 ~ envConfig:', envConfig);
//env目录下配置的环境配置
const viteEnv = loadEnv(envConfig, path.join(currentPath, 'env'));
// 环境变量
const env = package['uni-app'].scripts[compile].env;
// 银行bankCode
const bankCode = env.BANK_CODE;
// 编译平台
const platform = env.UNI_PLATFORM;
// 判断是否传了--mode 参数
if (JSON.stringify(viteEnv) === '{}') {
    console.error('输入的 --mode 环境参数错误，请检查后重新运行');
    return;
}

Promise.all([generateManifestJson(), generatePagesJson()]).then(() => {
    if (platform !== 'h5') {
        // 拷贝静态资源，格式：public/平台/银行编码
        shell.cp('-rf', `public/${platform}/${bankCode}`, `dist/dev/${platform}`);
    }

    shell.exec(`uni -p ${compile} --mode ${envConfig}`, function (code) {
        console.log('Exit code:', code);
    });
});