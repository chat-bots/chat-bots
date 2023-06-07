/**
 * document: https://commitlint.js.org/#/reference-configuration
 *
 * https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type
 * feat：新功能
 * fix：修补bug
 * docs：文档
 * style：格式（不影响代码运行的变动）
 * refactor：重构（即不是新增功能，也不是修改bug的代码变动）
 * perf：性能优化
 * test：增加测试
 * build：构建过程或辅助工具的变动
 * chore：其他改动
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
}
