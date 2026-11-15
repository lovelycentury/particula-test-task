<script setup lang="ts">
import { Typography } from '@okkly/vue'
import type { FieldDiff } from '@/types/diff'

defineProps<{
  field: FieldDiff
}>()
</script>

<template>
  <Typography>{{ field.label }}: {{ field.value }}</Typography>
</template>
