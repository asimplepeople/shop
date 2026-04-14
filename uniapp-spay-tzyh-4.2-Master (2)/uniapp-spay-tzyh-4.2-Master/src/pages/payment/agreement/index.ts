// #ifdef CDRCB
import cdrcb from './cdrcb';
// #endif
// #ifdef STANDARD || QSBANK
import standard from './standard';
// #endif
// #
export default {
    // #ifdef CDRCB
    cdrcb,
    // #endif
    // #ifdef STANDARD
    standard,
    // #endif
    // #ifdef QSBANK
    qsbank: standard,
    // #endif
};
