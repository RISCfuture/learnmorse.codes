module.exports = {
  plugins: ['chai-expect', 'chai-friendly', 'mocha'],
  env: {
    mocha: true
  },
  rules: {
    strict: 'off',
    'mocha/no-mocha-arrows': 'off',
    'mocha/max-top-level-suites': 'off'
  },
  extends: [
    'plugin:chai-expect/recommended',
    'plugin:chai-friendly/recommended',
    'plugin:mocha/recommended'
  ]
}
