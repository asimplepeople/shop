export default class Log {
    static log = uni.getRealtimeLogManager ? uni.getRealtimeLogManager() : null;
    static setFilterMsg(msg) {
        // 从基础库2.7.3开始支持
        if (!this.log || !this.log.setFilterMsg) return;
        if (typeof msg !== 'string') return;
        this.log.setFilterMsg(msg);
    }
    static addFilterMsg(msg) {
        // 从基础库2.8.1开始支持
        if (!this.log || !this.log.addFilterMsg) return;
        if (typeof msg !== 'string') return;
        this.log.addFilterMsg(msg);
    }
    static info(data) {
        if (!this.log) return;
        this.log.info(data);
    }
    static warn(data) {
        if (!this.log) return;
        this.log.warn(data);
    }
    static error(error) {
        if (!this.log) return;
        this.log.error(error);
    }
}
