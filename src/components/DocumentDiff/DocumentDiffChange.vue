<script setup lang="ts">
defineProps<{
  /** Old value; when set, it is shown struck through before the current one. */
  old?: string
  current: string
  /** Values are sanitized HTML (paragraph text) rather than plain text. */
  html?: boolean
  /** Puts the old value above the current one instead of next to it. */
  block?: boolean
}>()
</script>

<!-- Safe: `diffDocument` sanitizes paragraph HTML before it gets here. -->
<template>
  <template v-if="old !== undefined">
    <del
      v-if="html"
      class="document-diff-change document-diff-change--old"
      :class="{ 'document-diff-change--block': block }"
      v-html="old"
    />
    <del
      v-else
      class="document-diff-change document-diff-change--old"
      :class="{ 'document-diff-change--block': block }"
      >{{ old }}</del
    >
    <ins
      v-if="html"
      class="document-diff-change document-diff-change--new"
      :class="{ 'document-diff-change--block': block }"
      v-html="current"
    />
    <ins
      v-else
      class="document-diff-change document-diff-change--new"
      :class="{ 'document-diff-change--block': block }"
      >{{ current }}</ins
    >
  </template>
  <span v-else-if="html" v-html="current" />
  <template v-else>{{ current }}</template>
</template>

<style scoped>
.document-diff-change--old {
  color: var(--okkly-feedback-danger);
  text-decoration: line-through;
}

.document-diff-change--old:not(.document-diff-change--block) {
  margin-right: var(--okkly-space-1-5);
}

.document-diff-change--new {
  color: var(--okkly-feedback-success);
  text-decoration: underline;
}

.document-diff-change--block {
  display: block;
}

.document-diff-change--old.document-diff-change--block {
  margin-bottom: var(--okkly-space-3);
}
</style>
