<script setup lang="ts">
import { computed, ref } from 'vue'
import { DocumentDiffLayout } from '@/components/DocumentDiffLayout'
import { DocumentNav } from '@/components/DocumentNav'
import { VersionPicker } from '@/components/VersionPicker'
import { documentVersions } from '@/data/document'
import { buildNavItems } from '@/utils/buildNavItems'
import { diffDocument } from '@/utils/diffDocument'

const firstVersion = documentVersions.at(0)
const lastVersion = documentVersions.at(-1)

const title = lastVersion?.title ?? ''
const fromVersion = ref(firstVersion?.version ?? 0)
const toVersion = ref(lastVersion?.version ?? 0)

const findVersion = (version: number) =>
  documentVersions.find((documentVersion) => documentVersion.version === version)

const diff = computed(() => {
  const from = findVersion(fromVersion.value)
  const to = findVersion(toVersion.value)

  if (!from || !to) return undefined

  return diffDocument(from, to)
})

const navItems = computed(() => {
  if (!diff.value) return []

  return buildNavItems(diff.value)
})
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

    <template #sidebar>
      <DocumentNav :items="navItems" />
    </template>
  </DocumentDiffLayout>
</template>
