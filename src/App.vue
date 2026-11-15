<script setup lang="ts">
import { ref } from 'vue'
import { DocumentDiffLayout } from '@/components/DocumentDiffLayout'
import { VersionPicker } from '@/components/VersionPicker'
import { documentVersions } from '@/data/document'

const firstVersion = documentVersions.at(0)
const lastVersion = documentVersions.at(-1)

const title = lastVersion?.title ?? ''
const fromVersion = ref(firstVersion?.version ?? 0)
const toVersion = ref(lastVersion?.version ?? 0)
</script>

<template>
  <DocumentDiffLayout :title="title">
    <template #controls>
      <VersionPicker
        v-model:from="fromVersion"
        v-model:to="toVersion"
        :versions="documentVersions"
      />
    </template>
  </DocumentDiffLayout>
</template>
