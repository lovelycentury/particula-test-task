<script setup lang="ts">
import { Typography } from '@okkly/vue'
import type { FieldDiff } from '@/types/diff'
import DocumentDiffMark from './DocumentDiffMark.vue'

defineProps<{
  field: FieldDiff
}>()
</script>

<template>
  <DocumentDiffMark :status="field.diffStatus">
    <Typography>{{ field.label }}: {{ field.value }}</Typography>
  </DocumentDiffMark>
</template>
