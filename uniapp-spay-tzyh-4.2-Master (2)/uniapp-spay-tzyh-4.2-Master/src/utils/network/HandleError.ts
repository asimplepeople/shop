/**
 * 处理ajax请求异常的函数
 *
 * 两个参数不包含正常状态，一般在请求的异常回调中调用此函数
 *
 * @param {String} httpCode   - http异常状态码
 * @param {String} retmsg     -  内部业务异常信息
 * @param {String} [isTimeout]  -  内部业务异常代码，后续可能会用到这个参数去处理部分不友好的异常提示
 */
const HandleError = (httpCode, retmsg, isTimeout) => {
    const innerError = isTimeout ? '请求超时' : retmsg;
    let httpError = '';
    switch (httpCode.slice(0, 1)) {
        case '4':
            httpError = '客户端异常，请稍后再试';
            break;
        case '5':
            httpError = '服务器繁忙，请稍后再试';
            break;
        default:
            httpError = '请求数据异常';
            break;
    }

    // 此处用setTimeout是为了防止和uni.showLoading冲突，导致提示闪现，具体可查询相关api的原理
    setTimeout(() => {
        //
        uni.showToast({
            mask: true,
            icon: 'none',
            title: innerError || httpError,
            duration: 2000,
        });
    }, 600);
};

export default HandleError;
