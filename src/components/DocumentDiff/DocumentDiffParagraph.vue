<script setup lang="ts">
import { Typography } from '@okkly/vue'
import type { ParagraphDiff } from '@/types/diff'
import DocumentDiffMark from './DocumentDiffMark.vue'

defineProps<{
  paragraph: ParagraphDiff
}>()
</script>

<template>
  <DocumentDiffMark :status="paragraph.diffStatus">
    <Typography>
      <!-- Safe: `diffDocument` sanitizes paragraph HTML before it gets here. -->
      <span v-html="paragraph.text" />
    </Typography>
  </DocumentDiffMark>
</template>
