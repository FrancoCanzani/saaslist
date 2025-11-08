"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ProductMediaCarouselProps {
  demoUrl?: string;
  images?: string[];
  productName: string;
}

function extractYouTubeEmbedUrl(url: string): string {
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtube.com/embed/")) {
    return url;
  }
  return url;
}

export function ProductMediaCarousel({
  demoUrl,
  images,
  productName,
}: ProductMediaCarouselProps) {
  const hasMedia = demoUrl || (images && images.length > 0);

  if (!hasMedia) {
    return null;
  }

  const mediaItems: Array<{ type: "video" | "image"; url: string }> = [];

  if (demoUrl) {
    mediaItems.push({ type: "video", url: demoUrl });
  }

  if (images && images.length > 0) {
    images.forEach((imageUrl) => {
      mediaItems.push({ type: "image", url: imageUrl });
    });
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {mediaItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-video rounded overflow-hidden">
                {item.type === "video" ? (
                  <iframe
                    src={extractYouTubeEmbedUrl(item.url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${productName} demo video`}
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={`${productName} screenshot ${index}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority={index === 0}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {mediaItems.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </div>
  );
}
