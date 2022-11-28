/*
Copyright 2022 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

module.exports = {
  env: {
    'browser': true,
    'node': true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'vue/require-v-for-key': 0,
    'vue/require-default-prop': 0,
    'vue/no-v-html': 0,
    'vue/valid-v-for': 0,
    'vue/max-attributes-per-line': 0,
    'vue/html-indent': ['error', 4],
    'vue/script-indent': ['error', 4, {
      baseIndent: 1,
    }],
    'vue/no-unused-vars': 0,
    'vue/html-self-closing': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-reserved-component-names': 0,
  },
};
