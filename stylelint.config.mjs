export default {
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-recess-order',
    ],

    customSyntax: 'postcss-scss',

    rules: {
        // Разрешить @use, @forward и другие SCSS-директивы
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,

        // По желанию
        'selector-class-pattern': null,
        'no-descending-specificity': null,
        'color-function-notation': 'modern',
    },

    ignoreFiles: [
        '**/dist/**',
        '**/node_modules/**',
    ],
};
