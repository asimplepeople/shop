import Compressor from 'compressorjs';

/**
 * 图片转base64
 * @param { File } file 文件对象
 */
export function imgChangeBase64(file, filePath) {
    return new Promise((resolve, reject) => {
        if (!file) reject();
        //兼容H5的图片转base64方法
        // #ifdef H5
        new Compressor(file, {
            quality: 0.3,
            success(compressFile) {
                console.log('compressFile', compressFile);
                if (compressFile) {
                    const reader = new FileReader();
                    reader.readAsDataURL(compressFile);
                    reader.onload = function () {
                        resolve(this.result);
                    };
                    reader.onerror = function (err) {
                        console.log('Error: ', err);
                        reject(err);
                    };
                }
            },
            error(err) {
                uni.showToast({
                    icon: 'none',
                    title: err.message,
                });
                resolve(err.message);
            },
        });
        // #endif

        //兼容小程序图片转base64方法
        // #ifdef MP-WEIXIN || MP-ALIPAY
        uni.getFileSystemManager().readFile({
            filePath,
            encoding: 'base64',
            success: (res) => {
                resolve('data:image/jpeg;base64,' + res.data);
            },
        });
        // #endif
    });
}
