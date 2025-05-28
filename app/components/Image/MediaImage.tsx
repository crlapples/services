// src/components/MediaImage.tsx
import { Image } from 'lib/image-types';

export const getImageUrl = (
  media?: Image,
  width: number = 640,
  height: number = 320
): string => {
  if (media?.url) {
    // If using Firebase Storage, URLs are direct; add resizing if needed
    // Example with Cloudinary or Imgix (optional):
    // return `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},h_${height},c_fill/${media.url}`;
    return media.url;
  }
  return `https://fakeimg.pl/${width}x${height}/?text=Image`;
};

export default function MediaImage({
  media,
  width = 640,
  height = 320,
}: {
  media?: Image;
  width?: number;
  height?: number;
}) {
  const imageUrl = getImageUrl(media, width, height);
  return (
    <div className="flex items-center justify-center">
      <div className="overflow-hidden cursor-pointer relative group">
        <img
          className="object-cover w-full group-hover:brightness-75 transition duration-300 ease-in-out"
          src={imageUrl}
          alt={media?.alt ?? ''}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}