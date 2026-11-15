<script setup lang="ts">
import { Box, Typography } from '@okkly/vue'
import type { DocumentNavItem } from './DocumentNav.types'

defineProps<{
  item: DocumentNavItem
  active: boolean
}>()
</script>

<template>
  <Box
    as="a"
    :href="`#${item.id}`"
    class="document-nav-link"
    :class="{ 'document-nav-link--active': active }"
    :aria-current="active ? 'location' : undefined"
    display="flex"
    align-items="center"
    justify-content="space-between"
    :gap="2"
    :px="2"
    :py="2"
    :border-radius="2"
  >
    <Box display="flex" align-items="center" :gap="2" min-width="0">
      <Typography no-wrap>{{ item.title }}</Typography>
      <span v-if="item.marked" class="document-nav-link__marker" aria-label="Needs attention" />
    </Box>
    <Typography v-if="item.changeCount" variant="label-sm" color="muted">
      {{ item.changeCount }}
    </Typography>
  </Box>
</template>

<style scoped>
.document-nav-link {
  color: var(--okkly-text-primary);
  text-decoration: none;
  transition: background-color var(--okkly-duration-sm);
}

.document-nav-link:hover,
.document-nav-link--active {
  background-color: var(--okkly-bg-surface);
}

.document-nav-link:focus-visible {
  outline: var(--okkly-space-0-5) solid var(--okkly-accent-primary);
}

.document-nav-link__marker {
  flex-shrink: 0;
  width: var(--okkly-space-1-5);
  height: var(--okkly-space-1-5);
  border-radius: var(--okkly-radius-full);
  background-color: var(--okkly-feedback-warning);
}
</style>
