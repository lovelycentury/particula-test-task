<script setup lang="ts">
import { Typography } from '@okkly/vue'
import type { ParagraphDiff } from '@/types/diff'
import DocumentDiffChange from './DocumentDiffChange.vue'
import DocumentDiffMark from './DocumentDiffMark.vue'

defineProps<{
  paragraph: ParagraphDiff
}>()
</script>

<template>
  <DocumentDiffMark :status="paragraph.diffStatus">
    <Typography>
      <DocumentDiffChange :old="paragraph.previous?.text" :current="paragraph.text" html block />
    </Typography>
  </DocumentDiffMark>
</template>
