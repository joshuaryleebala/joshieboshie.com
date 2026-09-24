import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface ResponsiveImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
}

// Build a WebP srcset at build time so Vue islands can render optimized <img> tags.
export async function responsiveImage(
  source: ImageMetadata,
  widths: number[],
  sizes: string,
): Promise<ResponsiveImage> {
  const usable = widths.filter((w) => w <= source.width);
  const img = await getImage({
    src: source,
    widths: usable.length ? usable : [source.width],
    sizes,
    format: 'webp',
  });

  return {
    src: img.src,
    srcset: img.srcSet.attribute,
    sizes,
    width: source.width,
    height: source.height,
  };
}
