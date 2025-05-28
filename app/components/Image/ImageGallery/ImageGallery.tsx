// src/components/ImageGallery.tsx
import { Image } from 'lib/image-types';
import ImageGalleryClient from './ImageGallery.client';
import { getImageUrl } from '.././MediaImage';

export default function ImageGallery({ mediaItems }: { mediaItems: Image[] }) {
  return (
    <ImageGalleryClient
      width={600}
      height={400}
      items={mediaItems.map((item) => ({
        src: getImageUrl(item, 600, 400),
        alt: item.alt ?? '',
      }))}
    />
  );
}