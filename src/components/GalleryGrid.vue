<script setup lang="ts">
import { ref } from 'vue';

interface GalleryImage {
  src: string;
  alt: string;
}

const images: GalleryImage[] = [
  { src: '/assets/gallery/gallery-3.png', alt: 'Stovelabs DJ Set' },
  { src: '/assets/gallery/gallery-2.png', alt: 'Bartending' },
  { src: '/assets/gallery/gallery-1.png', alt: 'Bestie & I' },
  { src: '/assets/gallery/hongleongbank.jpg', alt: 'Hong Leong Bank Annual Dinner Show' },
  { src: '/assets/gallery/pubg.png', alt: 'PUBG ad' },
  { src: '/assets/gallery/icebreaker.jpg', alt: 'Ice Breaker' },
  { src: '/assets/gallery/dynamo.jpg', alt: 'Dynamo vs SFI' },
  { src: '/assets/gallery/fiftyfourc.JPG', alt: 'Fiftyfourc Run Club' },
  { src: '/assets/gallery/klscm.png', alt: 'KLSCM 2025' },
  { src: '/assets/gallery/coley.jpg', alt: 'Coley Bar Takeover' },
];

const lightboxImage = ref<GalleryImage | null>(null);

function openLightbox(image: GalleryImage) {
  lightboxImage.value = image;
}

function closeLightbox() {
  lightboxImage.value = null;
}
</script>

<template>
  <div class="gallery-grid">
    <div
      v-for="image in images"
      :key="image.src"
      class="gallery-item"
      @click="openLightbox(image)"
    >
      <img :src="image.src" :alt="image.alt">
    </div>
  </div>

  <div v-if="lightboxImage" class="lightbox" @click.self="closeLightbox">
    <div class="lightbox-content">
      <span class="lightbox-close" @click="closeLightbox">&times;</span>
      <img :src="lightboxImage.src" :alt="lightboxImage.alt">
    </div>
  </div>
</template>
