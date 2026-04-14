module.exports = {
    tabWidth: 4,
    printWidth: 120,
    trailingComma: 'es5',
    bracketSpacing: true,
    overrides: [
        {
            files: ['*.ts', '*.vue', '*.less', '*.js'],
            options: {
                tabWidth: 4,
            },
        },
    ],
    endOfLine: 'crlf',
    semi: true,
    singleQuote: true,
};
