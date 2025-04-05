import BestSellersSection from "@/components/BestSellersSection";
import LatestCollectionSection from "@/components/LatestCollectionSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { BadgeCheck, Headset, RefreshCcwDot } from "lucide-react";
import HighlightItem from "@/components/HighlightItem";
import SubscribeSection from "@/components/SubscribeSection";

export default function Home() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div className="w-full h-full flex flex-col gap-14">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-h-3/4 min-h-96 relative border"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="h-full min-h-96 flex w-full items-center justify-center"
            >
              <div className="p-1 h-full">{index + 1}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>
      <LatestCollectionSection />
      <BestSellersSection />

      <div className="flex flex-wrap justify-between items-center w-full">
        <HighlightItem
          Icon={RefreshCcwDot}
          title="Easy Exchange Policy"
          desc="We offer hassle free exchange policy"
        />
        <HighlightItem
          Icon={BadgeCheck}
          title="7 Days Return Policy"
          desc="We provide 7 days free return policy"
        />
        <HighlightItem
          Icon={Headset}
          title="Best customer support"
          desc="we provide 24/7 customer support"
        />
      </div>

      <SubscribeSection />
    </div>
  );
}
