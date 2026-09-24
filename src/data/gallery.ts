import type { ImageMetadata } from 'astro';
import gallery3 from '../assets/gallery/gallery-3.png';
import gallery2 from '../assets/gallery/gallery-2.png';
import gallery1 from '../assets/gallery/gallery-1.png';
import hongLeongBank from '../assets/gallery/hongleongbank.jpg';
import pubg from '../assets/gallery/pubg.png';
import icebreaker from '../assets/gallery/icebreaker.jpg';
import dynamo from '../assets/gallery/dynamo.jpg';
import fiftyfourc from '../assets/gallery/fiftyfourc.jpg';
import klscm from '../assets/gallery/klscm.png';
import coley from '../assets/gallery/coley.jpg';

export interface GallerySource {
  image: ImageMetadata;
  alt: string;
}

export const gallery: GallerySource[] = [
  { image: gallery3, alt: 'Stovelabs DJ Set' },
  { image: gallery2, alt: 'Bartending' },
  { image: gallery1, alt: 'Bestie & I' },
  { image: hongLeongBank, alt: 'Hong Leong Bank Annual Dinner Show' },
  { image: pubg, alt: 'PUBG ad' },
  { image: icebreaker, alt: 'Ice Breaker' },
  { image: dynamo, alt: 'Dynamo vs SFI' },
  { image: fiftyfourc, alt: 'Fiftyfourc Run Club' },
  { image: klscm, alt: 'KLSCM 2025' },
  { image: coley, alt: 'Coley Bar Takeover' },
];
