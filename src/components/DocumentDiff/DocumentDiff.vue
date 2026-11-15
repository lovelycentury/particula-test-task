<script setup lang="ts">
import { Box } from '@okkly/vue'
import type { DocumentDiff } from '@/types/diff'
import DocumentDiffSection from './DocumentDiffSection.vue'

defineProps<{
  diff: DocumentDiff
}>()
</script>

<template>
  <!-- The page title is `h1`, so top-level sections start at `h2`. -->
  <Box display="flex" flex-direction="column" :gap="12">
    <DocumentDiffSection
      v-for="section in diff.sections"
      :key="section.id"
      :section="section"
      :level="2"
    />
  </Box>
</template>
