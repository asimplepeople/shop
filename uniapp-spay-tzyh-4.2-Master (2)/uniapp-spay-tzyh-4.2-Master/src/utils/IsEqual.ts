import { getkeys, hasProperty, toString } from './GlobalUtils';

/**
 * 判断传入的两个参数是否相等（值和类型都相等），比较参数支持基本数据类型、json对象和数组，支持深比较
 *
 * json对象的判断逻辑，只要传入的key和value都相等及相等，不考虑顺序
 *
 * 数组的判断逻辑，顺序和值都要相等及相等
 *
 * @param {object} target
 * @param {object} other
 * @returns {boolean}
 *
 * @example
 * const a = {a: 1}
 * const b = {b: 1}
 * const c = {a: 1}
 * isEqual(a, b) // false
 * isEqual(a, c) // true
 */
const isEqual = (target, other) => {
    // SameValue algorithm
    const targetStack: Array<Object> = [];
    const otherStack: Array<Object> = [];
    //对原始类型数据进行比较,
    // 排除掉0和-0的相等性：
    if (target === other) {
        return target !== 0 || 1 / other === 1 / other;
    }
    //判断null和undefined，null==undefined->true
    if (target == null || other == null) {
        return target === other;
    }

    const className = toString(target);
    if (className !== toString(other)) {
        return false;
    }
    switch (className) {
        //统一转换为字符串后进行严格相等的判断：
        case '[object RegExp]':
        case '[object String]':
            return '' + target === '' + other;
        //应该把NaN看做相等，把0和-0看成不等
        case '[object Number]':
            if (+target !== +target) return +other !== +other;
            return +target === 0 ? 1 / +target === 1 / other : +target === +other;
        //直接判断
        case '[object Date]':
        case '[object Boolean]':
            return +target === +other;
    }

    //对数组和对象进行判断
    const areArrays = className === '[object Array]';
    if (!areArrays) {
        if (typeof target != 'object' || typeof other != 'object') return false;

        const aCtor = target.constructor,
            bCtor = other.constructor;
        if (aCtor !== bCtor && !(typeof aCtor === 'function' && aCtor instanceof aCtor && typeof bCtor === 'function' && bCtor instanceof bCtor) && 'constructor' in target && 'constructor' in other) {
            return false;
        }
    }
    let length = targetStack.length;
    while (length--) {
        if (targetStack[length] === target) return otherStack[length] === other;
    }

    targetStack.push(target);
    otherStack.push(other);
    let size, result;
    if (areArrays) {
        size = target.length;
        result = size === other.length;
        if (result) {
            while (size--) {
                if (!(result = isEqual(target[size], other[size]))) {
                    break;
                }
            }
        }
    } else {
        const keys = getkeys(target);
        let key;
        size = keys.length;
        result = getkeys(other).length === size;
        if (result) {
            while (size--) {
                key = keys[size];
                if (!(result = hasProperty(other, key) && isEqual(target[key], other[key]))) {
                    break;
                }
            }
        }
    }
    targetStack.pop();
    otherStack.pop();
    return result;
};

export default isEqual;
