<template>
  <i18n path="website.footer.text" tag="footer">
    <template #linkToMe>
      <a href="https://tim.codes" rel="noreferrer" target="_blank">
        {{$t('website.footer.linkToMe')}}
      </a>
    </template>

    <template #linkToProject>
      <a href="https://github.com/RISCfuture/learnmorse.codes" rel="noreferrer" target="_blank">
        {{$t('website.footer.linkToProject')}}
      </a>
    </template>
  </i18n>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /**
   * The website footer at the bottom of the page.
   */

  @Component
  export default class CopyrightInfo extends Vue {
  }
</script>

<style lang="scss" scoped>
  @use 'src/assets/styles/colors';

  a {
    @include colors.theme using($theme) {
      color: lighten(colors.get($theme, 'link-color'), 20%);
    }
  }
</style>
