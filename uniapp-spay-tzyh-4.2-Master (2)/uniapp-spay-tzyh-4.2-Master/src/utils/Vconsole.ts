// #ifdef H5
import Vconsole from 'vconsole';
// #endif

let time = 0;

/**
 * 连续点击15次打开控制台
 */
export const openVconsole = () => {
    // #ifdef H5
    if (time > 15) return;
    if (time === 15) {
        new Vconsole();
    }
    time++;
    // #endif
};
