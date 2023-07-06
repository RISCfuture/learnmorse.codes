<template>
  <div id="app">
    <home />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Home from '@/views/Home.vue'

  /**
   * Root view for the application.
   */

  @Component({
    components: { Home }
  })
  export default class App extends Vue {
  }
</script>

<style lang="scss">
  #app {
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
</style>
