<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ResponsiveImage } from '../lib/images';

interface Project {
  id: string;
  tags: string[];
  image: ResponsiveImage;
  alt: string;
  tagLabel: string;
  title: string;
  description: string;
}

const props = defineProps<{ projects: Project[] }>();

const filters = [
  { value: 'all', label: 'All Projects' },
  { value: 'digital', label: 'Digital Marketing' },
  { value: 'offline', label: 'Offline Events' },
  { value: 'personal', label: 'Personal Projects' },
];

const activeFilter = ref('all');

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return props.projects;
  return props.projects.filter((project) => project.tags.includes(activeFilter.value));
});
</script>

<template>
  <div class="project-filters" role="group" aria-label="Filter projects">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      class="filter-btn"
      :class="{ active: activeFilter === filter.value }"
      :aria-pressed="activeFilter === filter.value"
      @click="activeFilter = filter.value"
    >
      {{ filter.label }}
    </button>
  </div>

  <TransitionGroup name="fade" tag="div" class="projects-grid">
    <article v-for="(project, index) in filteredProjects" :key="project.id" class="project-card">
      <div class="project-image">
        <img
          :src="project.image.src"
          :srcset="project.image.srcset"
          :sizes="project.image.sizes"
          :width="project.image.width"
          :height="project.image.height"
          :alt="project.alt"
          :loading="index < 3 ? 'eager' : 'lazy'"
          decoding="async"
        >
      </div>
      <div class="project-content">
        <div class="project-tags">
          <span class="tag">{{ project.tagLabel }}</span>
        </div>
        <h2>{{ project.title }}</h2>
        <p>{{ project.description }}</p>
      </div>
    </article>
  </TransitionGroup>
</template>
