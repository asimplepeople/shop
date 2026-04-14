/**
 * 日期格式化工具函数
 *
 * @param {Date | Number} date     -- 日期对象
 * @param {String} format   -- 格式化模型，比如：YYYY-MM-DD hh:mm:ss
 * @example
 * dateformat(273499200000, "YYYY-MM-DD hh:mm:ss")
 */
export function dateformat(date, format = 'YYYY-MM-DD hh:mm:ss') {
    let result = format;
    const targetDate = new Date(Number(date));
    const currentDate = {
        'M+': targetDate.getMonth() + 1,
        'D+': targetDate.getDate(),
        'h+': targetDate.getHours(),
        'm+': targetDate.getMinutes(),
        's+': targetDate.getSeconds(),
        'q+': Math.floor((targetDate.getMonth() + 3) / 3),
        'S+': targetDate.getMilliseconds(),
    };
    if (/(y+)/i.test(result)) {
        result = result.replace(RegExp.$1, (targetDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in currentDate) {
        if (new RegExp('(' + k + ')').test(result)) {
            const length = ('' + currentDate[k]).length;
            result = result.replace(RegExp.$1, RegExp.$1.length === 1 ? currentDate[k] : ('00' + currentDate[k]).substr(length));
        }
    }
    return result;
}
