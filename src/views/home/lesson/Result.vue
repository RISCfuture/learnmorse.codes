<template>
  <div>
    <p id="score" :class="{ pass, perfect }" data-testid="score">
      {{ score }}
    </p>
    <p v-if="pass && credit" data-testid="extraCredit">
      {{ extraCreditString }}
    </p>

    <diff-view v-if="showDiff" :diff="diff" />
    <tip v-else-if="showTip" />
    <platitude v-else :pass="pass" />

    <div id="confetti-source" ref="confettiSource" />
  </div>
</template>

<script setup lang="ts">
import Tip from '@/views/home/lesson/result/Tip.vue'
import Platitude from '@/views/home/lesson/result/Platitude.vue'
import DiffView from '@/components/diff/Diff.vue'
import { type Diff, extraCredit, isPass } from '@/util/test/scoring'
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { clamp, random } from 'lodash-es'
import { confetti } from 'dom-confetti'

/**
 * Displays the user's results following a test, including a tip or a platitude.
 * Spouts confetti for a 100% score.
 *
 * For tests as part of a {@link Practice} (and not a {@link Lesson}), also displays the
 * {@link Diff}.
 */

const { n, t } = useI18n()

const props = withDefaults(
  defineProps<{
    penalty: number
    diff: Diff
    showDiff: boolean
  }>(),
  {
    showDiff: false
  }
)

const showTip = ref(false)
const confettiSource = ref<HTMLDivElement | null>(null)

const score = computed(() => {
  const clampedScore = clamp(props.penalty, 0.0, 1.0)
  return n(1 - clampedScore, 'percent')
})

const pass = computed(() => isPass(props.penalty))
const perfect = computed(() => props.penalty <= 0.0)
const credit = computed(() => extraCredit(props.diff))
const extraCreditString = computed(() =>
  t('lesson.copy.extraCredit', { points: n(credit.value, 'integer') }, credit.value)
)

function refresh() {
  showTip.value = random(10) === 0
  if (perfect.value && confettiSource.value) confetti(confettiSource.value)
}

watchEffect(() => refresh())
</script>
