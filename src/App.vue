<script setup lang="ts">
import { computed, ref } from 'vue'
import { DocumentDiffLayout } from '@/components/DocumentDiffLayout'
import { DocumentNav } from '@/components/DocumentNav'
import type { DocumentNavItem } from '@/components/DocumentNav'
import { VersionPicker } from '@/components/VersionPicker'
import { documentVersions } from '@/data/document'
import type { SectionNode } from '@/types/document'

const firstVersion = documentVersions.at(0)
const lastVersion = documentVersions.at(-1)

const title = lastVersion?.title ?? ''
const fromVersion = ref(firstVersion?.version ?? 0)
const toVersion = ref(lastVersion?.version ?? 0)

const findVersion = (version: number) =>
  documentVersions.find((documentVersion) => documentVersion.version === version)

const toNavItem = (section: SectionNode): DocumentNavItem => ({
  id: section.id,
  title: section.title,
})

const navItems = computed(() => findVersion(toVersion.value)?.children.map(toNavItem) ?? [])
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
