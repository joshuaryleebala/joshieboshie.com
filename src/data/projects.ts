import type { ImageMetadata } from 'astro';
import uai from '../assets/projects/UAI.png';
import seo from '../assets/projects/seo.png';
import acs from '../assets/projects/ACS.png';
import roFesta from '../assets/projects/ROfesta.png';
import icebreaker from '../assets/projects/Icebreaker.png';

export interface ProjectSource {
  id: string;
  tags: string[];
  image: ImageMetadata;
  alt: string;
  tagLabel: string;
  title: string;
  description: string;
}

export const projects: ProjectSource[] = [
  {
    id: 'ua',
    tags: ['digital'],
    image: uai,
    alt: 'User Acquisition Campaign',
    tagLabel: 'Digital Marketing',
    title: 'User Acquisition Campaign',
    description:
      'Planned and executed a user acquisition campaign that exceeded target of new user registrations within 10 days while reducing cost per acquisition by 70%. Optimized audience targeting, campaign messaging, and key visuals to improve conversion rate, traffic quality, and overall acquisition efficiency while maximizing return on ad spend.',
  },
  {
    id: 'seo',
    tags: ['digital'],
    image: seo,
    alt: 'SEO',
    tagLabel: 'Digital Marketing',
    title: 'SEO Strategy',
    description:
      'Developed and executed an SEO strategy that improved keyword rankings from beyond position 20 to the first page of Google within 6 months. Optimized on page SEO elements including metadata, technical SEO fixes, and site structure to increase search visibility and drive higher intent organic traffic.',
  },
  {
    id: 'acs',
    tags: ['offline'],
    image: acs,
    alt: 'OneOne Booth at ACS Edu Tour Season 4 Grand Finals',
    tagLabel: 'Offline Events',
    title: 'ACS Edu Tour Season 4',
    description:
      'Executed a nationwide on ground activation effort across multiple states in Malaysia, culminating in a large scale grand finals event at Berjaya Times Square. Managed event logistics, and on site execution to drive brand awareness, audience engagement, and community growth through experiential marketing.',
  },
  {
    id: 'ro-festa',
    tags: ['offline', 'branding'],
    image: roFesta,
    alt: 'Booth at RO Festa 2025',
    tagLabel: 'Offline Campaigns',
    title: 'Ragnarok Festa 2025, Bangkok',
    description:
      'Led cross functional coordination for regional marketing campaigns as the presenting sponsor of a major global gaming event in Bangkok. Managed booth strategy, stakeholder alignment, and on site execution for the largest brand presence at the event, driving brand visibility, partnership value, and user acquisition.',
  },
  {
    id: 'icebreaker',
    tags: ['personal'],
    image: icebreaker,
    alt: 'Child at Heart Ice Breaker Poster',
    tagLabel: 'Personal Projects',
    title: 'Child at Heart Ice Breaker',
    description:
      'Conceptualized and executed a sold out DJ event in Melaka using guerrilla marketing strategies with zero paid advertising spend. Also performed as the headline DJ, creating a cohesive brand and live experience.',
  },
];
