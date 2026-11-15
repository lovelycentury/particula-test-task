<script setup lang="ts">
import { Box } from '@okkly/vue'
import type { DocumentNavItem } from './DocumentNav.types'
import DocumentNavLink from './DocumentNavLink.vue'

defineProps<{
  items: DocumentNavItem[]
  /** Id of the section currently in view. */
  activeId?: string
}>()
</script>

<template>
  <Box as="ul" class="document-nav" display="flex" flex-direction="column" :gap="0.5">
    <li v-for="item in items" :key="item.id">
      <DocumentNavLink :item="item" :active="item.id === activeId" />
    </li>
  </Box>
</template>

<style scoped>
.document-nav {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
