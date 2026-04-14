import pagesJson from '../pages.json';

const CONFIG = {
    includes: ['path', 'aliasPath', 'name'],
};

export default class TransformPages {
    CONFIG: any;
    routers: any[];
    constructor(config?) {
        config = {
            ...CONFIG,
            ...config,
        };
        this.CONFIG = config;
        this.routers = this.getPagesRoutes().concat(this.getNotMpRoutes());
    }
    /**
     * 通过读取pages.json文件 生成直接可用的routes
     */
    getPagesRoutes(pages = pagesJson.pages, rootPath = null) {
        const routes: any[] = [];
        for (let i = 0; i < pages.length; i++) {
            const item = pages[i];
            const route: any = {};
            for (let j = 0; j < this.CONFIG.includes.length; j++) {
                const key = this.CONFIG.includes[j];
                let value = item[key];
                if (key === 'path') {
                    value = rootPath ? `/${rootPath}/${value}` : `/${value}`;
                }
                if (key === 'aliasPath' && i == 0 && rootPath == null) {
                    route[key] = route[key] || '/';
                } else if (value !== undefined) {
                    route[key] = value;
                }
            }
            route.title = item?.style?.navigationBarTitleText;
            routes.push(route);
        }
        return routes;
    }
    /**
     * 解析小程序分包路径
     */
    getNotMpRoutes() {
        const subPackages: any = pagesJson?.subPackages;
        let routes = [];
        if (subPackages == null || subPackages.length == 0) {
            return [];
        }
        for (let i = 0; i < subPackages.length; i++) {
            const subPages = subPackages[i].pages;
            const root = subPackages[i].root;
            const subRoutes: any = this.getPagesRoutes(subPages, root);
            routes = routes.concat(subRoutes);
        }
        return routes;
    }
}
