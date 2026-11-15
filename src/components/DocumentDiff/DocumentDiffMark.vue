<script setup lang="ts">
import { Box } from '@okkly/vue'
import type { DiffStatus } from '@/types/diff'

defineProps<{
  status: DiffStatus
}>()
</script>

<template>
  <!-- Marks one line of the document (a title or a leaf) with a bar on the left. -->
  <Box class="document-diff-mark" :class="`document-diff-mark--${status}`">
    <slot />
  </Box>
</template>

<style scoped>
.document-diff-mark {
  position: relative;
}

.document-diff-mark:not(.document-diff-mark--unchanged)::before {
  content: '';
  position: absolute;
  inset-block: 0;
  left: calc(-1 * var(--okkly-space-4));
  width: var(--okkly-space-0-5);
  border-radius: var(--okkly-radius-full);
  background-color: var(--document-diff-mark-color);
}

.document-diff-mark--added {
  --document-diff-mark-color: var(--okkly-feedback-success);
  color: var(--okkly-feedback-success);
  text-decoration: underline;
}

.document-diff-mark--removed {
  --document-diff-mark-color: var(--okkly-feedback-danger);
  color: var(--okkly-feedback-danger);
  text-decoration: line-through;
}

.document-diff-mark--changed {
  --document-diff-mark-color: var(--okkly-feedback-warning);
}
</style>
