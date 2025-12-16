import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel";
import { Banner } from "@/types/types";
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link";

const ImageSlider = ({banners}:{banners: Banner[]}) => {
    return (
        <Carousel opts={{loop: true}} plugins={[Autoplay({delay: 3000})]}>
            <CarouselContent className="-ml-4">
                {banners.map((banner) => {
                    return (
                        <CarouselItem key={banner.id} className="pl-4 basis-1/1 md:basis-1/2 lg:basis-1/3">
                            <Link href={banner.linkUrl}>
                                <div className="relative w-full h-48 md:h-56 lg:h-72 transition-transform hover:scale-105">
                                    <Image 
                                        src={banner.imageUrl} 
                                        fill 
                                        alt={banner.title}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        loading="eager"
                                    />
                                </div>
                            </Link>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
        </Carousel>
    )
}

export { ImageSlider };