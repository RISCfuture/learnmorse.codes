<template>
  <i18n-t keypath="website.footer.text" tag="footer">
    <template #linkToMe>
      <a href="https://tim.codes" rel="noopener noreferrer" target="_blank">
        {{ t('website.footer.linkToMe') }}
      </a>
    </template>

    <template #linkToProject>
      <a
        href="https://github.com/RISCfuture/learnmorse.codes"
        rel="noopener noreferrer"
        target="_blank"
      >
        {{ t('website.footer.linkToProject') }}
      </a>
    </template>
  </i18n-t>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * The website footer at the bottom of the page.
 */

const { t } = useI18n()
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/colors';

a {
  @include colors.theme using($theme) {
    color: color.adjust(colors.get($theme, 'link-color'), $lightness: -20%);
  }
}
</style>
