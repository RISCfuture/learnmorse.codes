import Vue from 'vue'

// Renders spaces as non-breaking spaces so they don't mess up the layout
Vue.filter('symbol', (char: string) => (char === ' ' ? ' ' : char))
