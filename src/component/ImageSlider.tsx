import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/ui/carousel";
import { Banner } from "@/types/types";

const ImageSlider = ({banners}:{banners: Banner[]}) => {
    return (
        <Carousel>
            <CarouselContent className="-ml-4">
                {banners.map((banner) => {
                    return (
                        <CarouselItem key={banner.id} className="pl-4 basis-1/3">
                            <div className="relative w-full h-72">
                                <Image src={banner.imageUrl} fill alt={banner.title}/>
                            </div>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
        </Carousel>
    )
}

export { ImageSlider };