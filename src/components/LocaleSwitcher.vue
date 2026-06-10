<template>
  <div ref="root" class="locale-switcher">
    <button
      type="button"
      class="toggle"
      :aria-label="t('website.localeSwitcher.label')"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5" />
        <ellipse
          cx="12"
          cy="12"
          rx="4"
          ry="9"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path d="M3.5 9h17M3.5 15h17" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </button>

    <ul v-if="open" class="menu" role="menu">
      <li v-for="locale in available" :key="locale.value" role="none">
        <button
          type="button"
          role="menuitemradio"
          :aria-checked="locale.value === current"
          :lang="locale.value"
          @click="choose(locale.value)"
        >
          {{ locale.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/i18n/useLocale'

/**
 * An unobtrusive floating control, fixed in a corner of the viewport, that lets
 * the user switch the application's display language.
 */

const { t } = useI18n()
const { current, available, setLocale } = useLocale()

const root = ref<HTMLElement | null>(null)
const open = ref(false)

function choose(code: string) {
  open.value = false
  void setLocale(code)
}

onClickOutside(root, () => (open.value = false))
onKeyStroke('Escape', () => (open.value = false))
</script>

<style lang="scss" scoped>
@use '@/assets/styles/colors';

.locale-switcher {
  position: fixed;
  top: env(safe-area-inset-top, 0);
  right: env(safe-area-inset-right, 0);
  z-index: 1000;
  margin: 12px;
}

.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.15s ease;

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  @include colors.theme using ($theme) {
    color: colors.get($theme, 'muted-color');
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

.menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: max-content;
  margin: 4px 0 0;
  padding: 4px;
  list-style: none;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0 0 0 / 25%);

  @include colors.theme using ($theme) {
    background: colors.get($theme, 'background');
    border: 1px solid colors.get($theme, 'border-color');
  }

  button {
    display: block;
    width: 100%;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    background: transparent;
    font-size: 16px;
    text-align: start;
    white-space: nowrap;
    cursor: pointer;

    @include colors.theme using ($theme) {
      color: colors.get($theme, 'text-color');
    }

    &:hover,
    &:focus-visible {
      @include colors.theme using ($theme) {
        background: colors.get($theme, 'button-background-color');
      }
    }

    &[aria-checked='true'] {
      font-weight: 700;
    }
  }
}
</style>
