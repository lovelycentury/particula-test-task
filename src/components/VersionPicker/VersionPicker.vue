<script setup lang="ts">
import { computed } from 'vue'
import { Box, Select, Typography } from '@okkly/vue'
import type { SelectOption } from '@okkly/vue'
import type { DocumentVersion } from '@/types/document'
import { formatVersionLabel } from '@/utils/formatVersionLabel'

const props = defineProps<{
  /** All versions, oldest first. */
  versions: DocumentVersion[]
}>()

/** Version number the diff starts from. */
const from = defineModel<number>('from', { required: true })
/** Version number the diff ends at. */
const to = defineModel<number>('to', { required: true })

const toOption = (version: DocumentVersion): SelectOption<number> => ({
  value: version.version,
  label: formatVersionLabel(version),
})

const options = computed(() => props.versions.map(toOption))

const isVersionNumber = (value: unknown): value is number => typeof value === 'number'

const updateFrom = (value: unknown) => {
  if (!isVersionNumber(value)) return

  from.value = value
}

const updateTo = (value: unknown) => {
  if (!isVersionNumber(value)) return

  to.value = value
}
</script>

<template>
  <Box display="flex" align-items="center" :gap="3">
    <Typography color="muted">Compare</Typography>
    <Select
      class="version-picker__select"
      :model-value="from"
      :options="options"
      disable-clearable
      aria-label="Base version"
      @update:model-value="updateFrom"
      size="small"
    />
    <Typography color="muted">with</Typography>
    <Select
      class="version-picker__select"
      :model-value="to"
      :options="options"
      disable-clearable
      aria-label="Compared version"
      @update:model-value="updateTo"
      size="small"
    />
  </Box>
</template>

<style scoped>
.version-picker__select {
  width: calc(56 * var(--okkly-space-unit));
}
</style>
