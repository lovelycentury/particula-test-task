<script setup lang="ts">
import { Typography } from '@okkly/vue'
import type { ParagraphDiff } from '@/types/diff'

defineProps<{
  paragraph: ParagraphDiff
}>()
</script>

<template>
  <Typography>
    <!-- Safe: `diffDocument` sanitizes paragraph HTML before it gets here. -->
    <span v-html="paragraph.text" />
  </Typography>
</template>
