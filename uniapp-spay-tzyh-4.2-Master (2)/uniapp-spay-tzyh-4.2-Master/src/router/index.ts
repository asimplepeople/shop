import uniCrazyRouter from 'uni-crazy-router';

// eslint-disable-next-line no-unused-vars
uniCrazyRouter.beforeEach(async (to, from, next) => {
    // 逻辑代码
    next();
});

// eslint-disable-next-line no-unused-vars
uniCrazyRouter.afterEach((to, from) => {
    // 逻辑代码
});

// eslint-disable-next-line no-unused-vars
uniCrazyRouter.onError((to, from) => {
    // 逻辑代码
});

export default uniCrazyRouter;
