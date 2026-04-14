import { defineConfig, loadEnv } from "vite";
import { viteMockServe } from 'vite-plugin-mock';
// getAllEnv,
import { getNodeProcessEnv, getAllEnv } from './src/utils/ProcessEnv';
import uni from "@dcloudio/vite-plugin-uni";
import viteCompression from 'vite-plugin-compression';
import path from 'path';
// import visualizer from 'rollup-plugin-visualizer';
// import legacy from '@vitejs/plugin-legacy';

const plugins = [];
// 打包生产环境才引入的插件
// if (process.env.NODE_ENV === 'production') {
//     // 打包依赖包大小展示
//     plugins.push(
//         visualizer({
//             open: true,
//             gzipSize: true,
//             brotliSize: true,
//         })
//     );
// }

// 公共前缀
const APP_BASE_URL = getNodeProcessEnv('APP_BASE_URL');
const BANK_CODE = getNodeProcessEnv('BANK_CODE');

// console.log('process.env', process.env);
console.log('BANK_CODE', BANK_CODE);

// https://cn.vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, path.join(__dirname, 'env'));
    // console.log('env', env);

    return {
        base: APP_BASE_URL ? `/${APP_BASE_URL}/` : '/', // 设置基础目录 './'
        envDir: 'env', // 加载 .env 文件的目录
        publicDir: 'static', // 静态资源
        // 插入环境变量，定义全局常量替换方式，获取常量例如：process.env.xxx
        define: {
            'process.env': getAllEnv(),
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import '/src/assets/css/${BANK_CODE || 'uni'}.scss';`
                }
            },
        },
        plugins: [
            uni(),
            // 兼容老版本
            // legacy({
            //     targets: ['defaults', 'not IE 11'],
            // }),
            // gizp压缩
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 10240,
                algorithm: 'gzip',
                ext: '.gz',
            }),
            viteMockServe({
                mockPath: 'mock',
                localEnabled: false,
                prodEnabled: false,
                injectCode: `
                        import { setupProdMockServer } from './mock/mockProdServer';
                        setupProdMockServer();
                    `,
            }),
            ...plugins,
        ],
        // 别名
        resolve: {
            alias: {
                // '@': resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录，支付宝小程序别名会报错
                // 解决vue-i18n警告You are running the esm-bundler build of vue-i18n. It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.
                // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
            },
        },
        build: {
            target: 'es2015', // 指定es版本,浏览器的兼容性 'es2020'
            polyfillModulePreload: true,
            // outDir: 'dist', // 指定打包输出路径，uni中不生效
            // assetsDir: 'assets', // 指定静态资源存放路径，uni中不生效
            cssCodeSplit: true, // css代码拆分,禁用则所有样式保存在一个css里面
            sourcemap: false, // 是否构建source map 文件
            manifest: true, // 包含了没有被 hash 的资源文件名和 hash 后版本的映射
            terserOptions: {
                // 生产环境移除console
                compress: {
                    drop_console: false,
                    drop_debugger: true,
                },
            },
            rollupOptions: {
                output: {
                    // 最小化拆分包
                    // manualChunks: (id) => {
                    //     // console.log('manualChunks.id:', id);
                    //     if (id.includes('node_modules')) {
                    //         if(id.includes('/')) {
                    //             return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    //         } else {
                    //             return id.toString().split('node_modules\\')[1].split('\\')[0].toString();
                    //         }
                    //     }
                    // },
                    // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
                    // entryFileNames: 'assets/js/[name].[hash].js',
                    // 用于命名代码拆分时创建的共享块的输出命名
                    // chunkFileNames: 'assets/js/[name].[hash].js',
                    // 用于输出静态资源的命名，[ext]表示文件扩展名
                    assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
                    // 拆分js到模块文件夹
                    // chunkFileNames: (chunkInfo) => {
                        // const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
                        // const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
                    //     return `assets/js/[name].[hash].js`;
                    // },
                },
            },
        },
        // 预览
        // preview: {
        //     host: '0.0.0.0',
        //     port: 6000,
        //     cors: true, // 允许跨域
        // },
        // 本地代理
        server: {
            host: '0.0.0.0',
            port: 8011, // 设置服务启动端口号
            open: false, // 设置服务启动时是否自动打开浏览器
            cors: true, // 允许跨域
            https: false, // 开启https协议
            // 设置代理，根据项目实际情况配置
            proxy: {
                '/spay/': {
                    target: env[`${'VITE_' + BANK_CODE.toUpperCase() + '_APIDOMAIN'}`],
                    changeOrigin: true,
                    secure: false,
                },
                '/sppay-xiaowei-app-web/': {
                    target: env[`${'VITE_' + BANK_CODE.toUpperCase() + '_APIDOMAIN'}`],
                    changeOrigin: true,
                    secure: false,
                }
            }
        },
    }
});
