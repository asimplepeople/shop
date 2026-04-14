const { defineConfig } = require('eslint-define-config'); // 配置提示插件

module.exports = defineConfig({
    root: true,
    globals: {
        uni: true,
        wx: true,
        getCurrentPages: true,
    },
    // 一个环境定义了一组预定义的全局变量
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    // ESLint 默认使用 Espree 作为其解析器，你可以在配置文件中指定一个不同的解析器，只要该解析器符合下列要求：
    // 1.它必须是一个 Node 模块，可以从它出现的配置文件中加载。通常，这意味着应该使用 npm 单独安装解析器包。
    // 2.它必须符合 parser interface。
    parser: 'vue-eslint-parser',
    // ESLint 允许你指定你想要支持的 JavaScript 语言选项。默认情况下，ESLint 支持 ECMAScript 5 语法。你可以覆盖该设置，以启用对 ECMAScript 其它版本和 JSX 的支持。
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        jsxPragma: 'React',
        ecmaFeatures: {
            jsx: true,
        },
    },
    // ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它
    plugins: ['vue', '@typescript-eslint', 'prettier'],
    // 一个配置文件可以被基础配置中的已启用的规则继承
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    // ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-var-requires': 0,
        'for-direction': 'error', // 禁止 for 循环出现方向错误的循环，比如 for (i = 0; i < 10; i--)
        'no-await-in-loop': 'off', // 禁止将 await 写在循环里
        'no-compare-neg-zero': 'error', // 禁止与负零进行比较
        'no-empty-character-class': 'error', // 禁止在正则表达式中使用空的字符集 []
        'no-extra-parens': ['error', 'functions'], // 禁止函数表达式中出现多余的括号
        'no-extra-semi': 'error', // 禁止出现多余的分号
        'no-func-assign': 'error', // 禁止将一个函数声明重新赋值
        'no-inner-declarations': ['error', 'both'], // 禁止在 if 代码块内出现函数声明
        'no-regex-spaces': 'error', // 禁止在正则表达式中出现连续的空格
        'no-sparse-arrays': 'error', // 禁止在数组中出现连续的逗号
        'no-unreachable': 'error', // 禁止在 return, throw, break 或 continue 之后还有代码
        'no-template-curly-in-string': 'error', // 禁止出现难以理解的多行表达式
        'use-isnan': 'error', // 必须使用 isNaN(foo)
        // 'complexity': ['error',{'max': 20}], // 禁止函数的循环复杂度超过 20
        'dot-location': ['error', 'property'], // 链式调用的时候，点号必须放在第二行开头处，禁止放在第一行结尾处
        'no-alert': 'error', //禁止使用alert
        'no-empty-function': [
            'error',
            {
                allow: ['functions', 'arrowFunctions'],
            },
        ], // 不允许有空函数，除非是将一个空函数设置为某个项的默认值
        'no-extend-native': 'error', // 禁止修改原生对象
        'no-global-assign': 'error', // 禁止对全局变量赋值
        'no-return-assign': ['error', 'always'], // 禁止在 return 语句里赋值
        'keyword-spacing': [
            'error',
            {
                before: true,
                after: true,
            },
        ], // 关键字前后必须有空格

        'key-spacing': [
            0,
            {
                beforeColon: false,
                afterColon: true,
            },
        ], //对象字面量中冒号的前后空格
        'max-depth': ['error', 5], // 代码块嵌套的深度禁止超过 5 层
        'max-params': ['error', 6], // 函数的参数禁止超过 6 个
        // 'newline-per-chained-call': 'error', //链式调用必须换行
        'no-multiple-empty-lines': [
            'error',
            {
                max: 3,
                maxEOF: 1,
                maxBOF: 1,
            },
        ], // 禁止出现超过三行的连续空行
        'no-whitespace-before-property': 'error', // 禁止属性前有空格
        'nonblock-statement-body-position': [
            'error',
            'beside',
            {
                overrides: {
                    while: 'below',
                },
            },
        ], // 禁止 if 后面不加大括号而写两行代码
        'object-curly-newline': [
            'error',
            {
                multiline: true,
                consistent: true,
            },
        ], // 大括号内的首尾必须有换行
        'object-property-newline': 'error', // 对象字面量内的属性每行必须只有一个

        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                ignoredNodes: ['ConditionalExpression'],
            },
        ],
        quotes: [2, 'single'], // 单引号
        // 'no-console': ['error', { allow: ['info', 'error'] }],//不允许console,除了console.info和console.error
        'no-debugger': 0, // 不禁用debugger
        'no-var': 0, // 对var警告
        semi: 1, // 不强制使用分号
        'no-irregular-whitespace': 0, // 不规则的空白不允许
        'no-trailing-spaces': 2, // 一行结束后面有空格就发出警告
        'eol-last': 0, // 文件以单一的换行符结束
        'no-unused-vars': [
            2,
            {
                vars: 'all',
                args: 'after-used',
            },
        ], // 不能有声明后未被使用的变量或参数
        'no-underscore-dangle': 0, // 标识符不能以_开头或结尾
        'no-lone-blocks': 0, // 禁止不必要的嵌套块
        'no-class-assign': 2, // 禁止给类赋值
        'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
        'no-const-assign': 2, // 禁止修改const声明的变量
        'no-delete-var': 2, // 不能对var声明的变量使用delete操作符
        'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复
        'no-duplicate-case': 2, // switch中的case标签不能重复
        'no-useless-catch': 0, //允许try catch
        'no-dupe-args': 2, // 函数参数不能重复
        'no-empty': 2, // 块语句中的内容不能为空
        'no-invalid-this': 0, // 禁止无效的this，只能用在构造器，类，对象字面量
        'no-redeclare': 2, // 禁止重复声明变量
        'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
        'no-this-before-super': 0, // 在调用super()之前不能使用this或super
        'no-undef': 2, // 不能有未定义的变量，跳过环境变量
        'no-use-before-define': 2, // 未定义前不能使用
        camelcase: 0, // 强制驼峰法命名

        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'never',
                    component: 'always',
                },
                svg: 'always',
                math: 'always',
            },
        ],
    },
    settings: {},
});
