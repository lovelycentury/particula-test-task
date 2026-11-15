<script setup lang="ts">
import { Box, Typography } from '@okkly/vue'
import type { SectionDiff } from '@/types/diff'
import { headingTag } from '@/utils/headingTag'
import DocumentDiffChange from './DocumentDiffChange.vue'
import DocumentDiffClause from './DocumentDiffClause.vue'
import DocumentDiffMark from './DocumentDiffMark.vue'

defineProps<{
  section: SectionDiff
  /** Heading level of this section; nested sections and clauses go one deeper. */
  level: number
}>()

/** Level of top-level sections, which get the larger heading. */
const TOP_SECTION_LEVEL = 2
</script>

<template>
  <Box
    :id="section.id"
    as="section"
    class="document-diff-section"
    display="flex"
    flex-direction="column"
    :gap="6"
  >
    <Box display="flex" align-items="baseline" :gap="3">
      <DocumentDiffMark :status="section.diffStatus">
        <Typography :variant="level === TOP_SECTION_LEVEL ? 'h3' : 'h4'" :as="headingTag(level)">
          <DocumentDiffChange :old="section.previous?.title" :current="section.title" />
        </Typography>
      </DocumentDiffMark>
      <Typography v-if="section.diffStatus === 'added'" variant="caption" color="muted">
        new section
      </Typography>
    </Box>

    <template v-for="child in section.children" :key="child.id">
      <DocumentDiffSection v-if="child.type === 'section'" :section="child" :level="level + 1" />
      <DocumentDiffClause v-else :clause="child" :level="level + 1" />
    </template>
  </Box>
</template>

<style scoped>
.document-diff-section {
  scroll-margin-top: var(--okkly-space-6);
}
</style>
