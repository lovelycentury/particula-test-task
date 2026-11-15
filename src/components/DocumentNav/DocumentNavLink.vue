<script setup lang="ts">
import { Box, Typography } from '@okkly/vue'
import type { DocumentNavItem } from './DocumentNav.types'

const props = defineProps<{
  item: DocumentNavItem
  active: boolean
}>()

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scrollToSection = (event: MouseEvent) => {
  const section = document.getElementById(props.item.id)
  if (!section) return

  event.preventDefault()
  section.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  history.pushState(null, '', `#${props.item.id}`)
}
</script>

<template>
  <Box
    as="a"
    :href="`#${item.id}`"
    @click="scrollToSection"
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
    <Typography no-wrap>{{ item.title }}</Typography>
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
</style>
