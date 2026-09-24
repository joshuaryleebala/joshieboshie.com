<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import type { ResponsiveImage } from '../lib/images';

interface GalleryImage {
  alt: string;
  thumb: ResponsiveImage;
  full: ResponsiveImage;
}

const props = defineProps<{ images: GalleryImage[] }>();

const activeIndex = ref<number | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let lastFocused: HTMLElement | null = null;

const activeImage = computed(() => (activeIndex.value === null ? null : props.images[activeIndex.value]));

function openLightbox(index: number) {
  lastFocused = document.activeElement as HTMLElement | null;
  activeIndex.value = index;
}

function closeLightbox() {
  activeIndex.value = null;
}

function step(delta: number) {
  if (activeIndex.value === null) return;
  const count = props.images.length;
  activeIndex.value = (activeIndex.value + delta + count) % count;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeLightbox();
  else if (event.key === 'ArrowRight') step(1);
  else if (event.key === 'ArrowLeft') step(-1);
}

watch(activeIndex, async (index, previous) => {
  const opened = index !== null && previous === null;
  const closed = index === null && previous !== null;

  if (opened) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeydown);
    await nextTick();
    closeButton.value?.focus();
  } else if (closed) {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKeydown);
    lastFocused?.focus();
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <ul class="gallery-grid">
    <li v-for="(image, index) in images" :key="image.thumb.src">
      <button type="button" class="gallery-item" @click="openLightbox(index)">
        <img
          :src="image.thumb.src"
          :srcset="image.thumb.srcset"
          :sizes="image.thumb.sizes"
          :width="image.thumb.width"
          :height="image.thumb.height"
          :alt="image.alt"
          :loading="index < 3 ? 'eager' : 'lazy'"
          decoding="async"
        >
        <span class="gallery-caption" aria-hidden="true">{{ image.alt }}</span>
      </button>
    </li>
  </ul>

  <Transition name="fade">
    <div
      v-if="activeImage"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="activeImage.alt"
      @click.self="closeLightbox"
    >
      <button ref="closeButton" type="button" class="lightbox-btn lightbox-close" aria-label="Close" @click="closeLightbox">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photo" @click="step(-1)">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button type="button" class="lightbox-btn lightbox-next" aria-label="Next photo" @click="step(1)">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <figure class="lightbox-content">
        <img
          :key="activeImage.full.src"
          :src="activeImage.full.src"
          :srcset="activeImage.full.srcset"
          :sizes="activeImage.full.sizes"
          :width="activeImage.full.width"
          :height="activeImage.full.height"
          :alt="activeImage.alt"
        >
        <figcaption>
          {{ activeImage.alt }}
          <span class="lightbox-count">{{ (activeIndex ?? 0) + 1 }} / {{ images.length }}</span>
        </figcaption>
      </figure>
    </div>
  </Transition>
</template>
