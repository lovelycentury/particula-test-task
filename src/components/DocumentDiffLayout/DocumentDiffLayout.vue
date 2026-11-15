<script setup lang="ts">
import { Box, Typography } from '@okkly/vue'

defineProps<{
  /** Document title shown in the header. */
  title: string
}>()

defineSlots<{
  /** Header controls on the right, e.g. the version pickers. */
  controls?: () => unknown
  /** Section navigation in the left column. */
  sidebar?: () => unknown
  /** Document body. */
  default?: () => unknown
}>()
</script>

<template>
  <Box
    class="document-diff-layout"
    display="flex"
    flex-direction="column"
    min-height="100vh"
    bgcolor="bg.canvas"
    color="text.primary"
  >
    <Box
      as="header"
      class="document-diff-layout__header"
      display="flex"
      align-items="center"
      justify-content="space-between"
      :gap="4"
      :px="6"
      :py="4"
    >
      <Typography variant="h4" as="h1" no-wrap>{{ title }}</Typography>
      <Box display="flex" align-items="center" :gap="2">
        <slot name="controls" />
      </Box>
    </Box>

    <Box display="flex" :flex-grow="1">
      <Box
        as="nav"
        class="document-diff-layout__sidebar"
        :display="{ base: 'none', md: 'block' }"
        :width="300"
        :flex-shrink="0"
      >
        <Box class="document-diff-layout__sidebar-content" :px="6" :py="6">
          <slot name="sidebar" />
        </Box>
      </Box>

      <Box as="main" :flex-grow="1" min-width="0" :px="6" :py="8">
        <Box :max-width="880" mx="auto">
          <slot />
        </Box>
      </Box>
    </Box>
  </Box>
</template>

<style scoped>
.document-diff-layout__header {
  border-bottom: var(--okkly-space-px) solid var(--okkly-border-subtle);
}

.document-diff-layout__sidebar {
  border-right: var(--okkly-space-px) solid var(--okkly-border-subtle);
}

.document-diff-layout__sidebar-content {
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}
</style>
