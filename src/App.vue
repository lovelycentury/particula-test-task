<script setup lang="ts">
import { DocumentDiffLayout } from '@/components/DocumentDiffLayout'
import { documentVersions } from '@/data/document'

const title = documentVersions.at(-1)?.title ?? ''
</script>

<template>
  <DocumentDiffLayout :title="title" />
</template>
