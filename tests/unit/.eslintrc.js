module.exports = {
  plugins: ['chai-expect', 'chai-friendly', 'mocha'],
  extends: [
    'plugin:chai-expect/recommended',
    'plugin:chai-friendly/recommended',
    'plugin:mocha/recommended'
  ],
  env: {
    mocha: true
  },
  rules: {
    strict: 'off',
    'mocha/no-mocha-arrows': 'off'
  }
}
