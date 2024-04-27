module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    plugins: [
        'vue'
    ],
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'vue/no-unused-components': 'warn'
    }
};
