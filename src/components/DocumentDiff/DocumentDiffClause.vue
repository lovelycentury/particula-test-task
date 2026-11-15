<script setup lang="ts">
import { Badge, Box, Typography } from '@okkly/vue'
import type { ClauseDiff } from '@/types/diff'
import { headingTag } from '@/utils/headingTag'
import DocumentDiffField from './DocumentDiffField.vue'
import DocumentDiffMark from './DocumentDiffMark.vue'
import DocumentDiffParagraph from './DocumentDiffParagraph.vue'

defineProps<{
  clause: ClauseDiff
  /** Heading level of the clause title. */
  level: number
}>()
</script>

<template>
  <Box
    as="article"
    class="document-diff-clause"
    :class="{ 'document-diff-clause--draft': clause.status === 'draft' }"
    display="flex"
    flex-direction="column"
    :gap="3"
  >
    <Box display="flex" align-items="center" :gap="3">
      <DocumentDiffMark :status="clause.diffStatus">
        <Typography variant="label-md" :as="headingTag(level)">{{ clause.title }}</Typography>
      </DocumentDiffMark>
      <Badge v-if="clause.status === 'draft'" color="warning" badge-content="Draft" />
    </Box>

    <template v-for="child in clause.children" :key="child.id">
      <DocumentDiffParagraph v-if="child.type === 'paragraph'" :paragraph="child" />
      <DocumentDiffField v-else :field="child" />
    </template>
  </Box>
</template>

<style scoped>
.document-diff-clause--draft {
  margin-inline: calc(-1 * var(--okkly-space-4));
  padding: var(--okkly-space-3) var(--okkly-space-4);
  border-radius: var(--okkly-radius-md);
  background-color: color-mix(in srgb, var(--okkly-feedback-warning) 8%, transparent);
}
</style>
