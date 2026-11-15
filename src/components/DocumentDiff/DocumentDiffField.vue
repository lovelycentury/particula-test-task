<script setup lang="ts">
import { Typography } from '@okkly/vue'
import type { FieldDiff } from '@/types/diff'
import DocumentDiffChange from './DocumentDiffChange.vue'
import DocumentDiffMark from './DocumentDiffMark.vue'

defineProps<{
  field: FieldDiff
}>()
</script>

<template>
  <DocumentDiffMark :status="field.diffStatus">
    <Typography>
      <DocumentDiffChange :old="field.previous?.label" :current="field.label" />:
      <DocumentDiffChange :old="field.previous?.value" :current="field.value" />
    </Typography>
  </DocumentDiffMark>
</template>
