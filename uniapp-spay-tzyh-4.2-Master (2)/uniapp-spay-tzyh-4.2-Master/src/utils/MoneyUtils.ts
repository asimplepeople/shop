import { Numeral } from './NumeralUtils';

/**
 * 金额类工具
 * @param {string|number} money  金额
 * @param {number} digit  保留小数位
 **/
export class Money {
    //金额保留小数位，默认保留两位小数
    static decimalFormat(money, digit = 2) {
        let result = '';
        if (money || money == 0) {
            const moneyStr = (money + '').replace(/\s*/g, '');
            const moneyArr = moneyStr.split('.');
            let decimal = '';
            for (let i = 0; i < digit; i++) {
                if (moneyArr[1] && moneyArr[1][i]) {
                    decimal += moneyArr[1][i];
                } else {
                    decimal = decimal + '0';
                }
            }
            result = digit == 0 ? moneyArr[0] : moneyArr[0] + '.' + decimal;
        }
        return result;
    }
    //金额格式化为千分位，默认保留两位小数
    static thousandFormat(money, digit = 2) {
        if (money === '' || money === undefined || money === null) return '';
        const result = this.decimalFormat(money, digit);
        const doMoney = (str) => {
            return str.replace(/(-?\d+)(\d{3})/g, function (res, ...param) {
                return doMoney(param[0]) + ',' + param[1];
            });
        };
        return result.replace(/\d+/, (str) => {
            return doMoney(str);
        });
    }
    //移除千分位
    static removeThousandFormat(money, digit = 2) {
        if (money === '' || money === undefined || money === null) return '';
        const result = (money || '').replace(/[^\d\.-]/g, '');
        return this.decimalFormat(result, digit);
    }
    //元转为分
    static yuanChangeFen(money) {
        if (money === '' || money === undefined || money === null) return '';
        return Math.round(Numeral.mul(money, 100, null));
    }

    //分转为元
    static fenChangeYuan(money, digit = 2) {
        if (money === '' || money === undefined || money === null) return '';
        return typeof digit === 'number' ? Numeral.div(Math.round(money), 100, digit).toFixed(digit) : Numeral.div(Math.round(money), 100, null);
    }
}
