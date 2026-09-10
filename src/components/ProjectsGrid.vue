<script setup lang="ts">
import { ref, computed } from 'vue';

interface Project {
  id: string;
  tags: string[];
  image: string;
  alt: string;
  tagLabel: string;
  title: string;
  description: string;
}

const projects: Project[] = [
  {
    id: 'ua',
    tags: ['digital'],
    image: '/assets/projects/UAI.png',
    alt: 'User Acquisition Campaign',
    tagLabel: 'Digital Marketing',
    title: 'User Acquisition Campaign',
    description:
      'Planned and executed a user acquisition campaign that exceeded target of new user registrations within 10 days while reducing cost per acquisition by 70%. Optimized audience targeting, campaign messaging, and key visuals to improve conversion rate, traffic quality, and overall acquisition efficiency while maximizing return on ad spend.',
  },
  {
    id: 'seo',
    tags: ['digital'],
    image: '/assets/projects/seo.png',
    alt: 'SEO',
    tagLabel: 'Digital Marketing',
    title: 'SEO Strategy',
    description:
      'Developed and executed an SEO strategy that improved keyword rankings from beyond position 20 to the first page of Google within 6 months. Optimized on page SEO elements including metadata, technical SEO fixes, and site structure to increase search visibility and drive higher intent organic traffic.',
  },
  {
    id: 'acs',
    tags: ['offline'],
    image: '/assets/projects/ACS.png',
    alt: 'OneOne Booth at ACS Edu Tour Season 4 Grand Finals',
    tagLabel: 'Offline Events',
    title: 'ACS Edu Tour Season 4',
    description:
      'Executed a nationwide on ground activation effort across multiple states in Malaysia, culminating in a large scale grand finals event at Berjaya Times Square. Managed event logistics, and on site execution to drive brand awareness, audience engagement, and community growth through experiential marketing.',
  },
  {
    id: 'ro-festa',
    tags: ['offline', 'branding'],
    image: '/assets/projects/ROfesta.png',
    alt: 'Booth at RO Festa 2025',
    tagLabel: 'Offline Campaigns',
    title: 'Ragnarok Festa 2025, Bangkok',
    description:
      'Led cross functional coordination for regional marketing campaigns as the presenting sponsor of a major global gaming event in Bangkok. Managed booth strategy, stakeholder alignment, and on site execution for the largest brand presence at the event, driving brand visibility, partnership value, and user acquisition.',
  },
  {
    id: 'icebreaker',
    tags: ['personal'],
    image: '/assets/projects/Icebreaker.png',
    alt: 'Child at Heart Ice Breaker Poster',
    tagLabel: 'Personal Projects',
    title: 'Child at Heart Ice Breaker',
    description:
      'Conceptualized and executed a sold out DJ event in Melaka using guerrilla marketing strategies with zero paid advertising spend. Also performed as the headline DJ, creating a cohesive brand and live experience.',
  },
];

const filters = [
  { value: 'all', label: 'All Projects' },
  { value: 'digital', label: 'Digital Marketing' },
  { value: 'offline', label: 'Offline Events' },
  { value: 'personal', label: 'Personal Projects' },
];

const activeFilter = ref('all');

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects;
  return projects.filter((project) => project.tags.includes(activeFilter.value));
});
</script>

<template>
  <div class="project-filters">
    <button
      v-for="filter in filters"
      :key="filter.value"
      class="filter-btn"
      :class="{ active: activeFilter === filter.value }"
      @click="activeFilter = filter.value"
    >
      {{ filter.label }}
    </button>
  </div>

  <TransitionGroup name="fade" tag="div" class="projects-grid">
    <div v-for="project in filteredProjects" :key="project.id" class="project-card">
      <div class="project-image">
        <img :src="project.image" :alt="project.alt">
      </div>
      <div class="project-content">
        <div class="project-tags">
          <span class="tag">{{ project.tagLabel }}</span>
        </div>
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </div>
  </TransitionGroup>
</template>
