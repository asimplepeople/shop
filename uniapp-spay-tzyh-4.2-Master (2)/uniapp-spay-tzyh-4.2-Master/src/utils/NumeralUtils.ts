/**
 * 数字运算,解决js浮点数运算问题
 * @param { string } a 参数1
 * @param { string } b 参数2
 */

export class Numeral {
    /**
     * 浮点数加法
     */
    static add(arg1, arg2, digit: any) {
        (arg1 = arg1.toString()), (arg2 = arg2.toString());
        var arg1Arr = arg1.split('.'),
            arg2Arr = arg2.split('.'),
            d1 = arg1Arr.length == 2 ? arg1Arr[1] : '',
            d2 = arg2Arr.length == 2 ? arg2Arr[1] : '';
        var maxLen = Math.max(d1.length, d2.length);
        var m = Math.pow(10, maxLen);
        var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
        return typeof digit === 'number' ? Number(result.toFixed(digit)) : result;
    }
    /**
     * 减法
     */
    static sub(arg1, arg2, digit: any) {
        return typeof digit === 'number' ? this.add(arg1, -arg2, digit) : this.add(arg1, -arg2, null);
    }
    /**
     * 乘法
     */
    static mul(arg1, arg2, digit: any) {
        var r1 = arg1.toString(),
            r2 = arg2.toString(),
            m,
            resultVal;
        m = (r1.split('.')[1] ? r1.split('.')[1].length : 0) + (r2.split('.')[1] ? r2.split('.')[1].length : 0);
        resultVal = (Number(r1.replace('.', '')) * Number(r2.replace('.', ''))) / Math.pow(10, m);
        return typeof digit !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(digit));
    }
    /**
     * 浮点数除法
     */
    static div(arg1, arg2, digit: any) {
        var r1 = arg1.toString(),
            r2 = arg2.toString(),
            m,
            resultVal;
        m = (r2.split('.')[1] ? r2.split('.')[1].length : 0) - (r1.split('.')[1] ? r1.split('.')[1].length : 0);
        resultVal = (Number(r1.replace('.', '')) / Number(r2.replace('.', ''))) * Math.pow(10, m);
        return typeof digit !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(digit));
    }
}
