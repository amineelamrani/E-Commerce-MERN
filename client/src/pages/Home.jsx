import BestSellersSection from "@/components/BestSellersSection";
import LatestCollectionSection from "@/components/LatestCollectionSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useContext, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Headset,
  RefreshCcwDot,
  GalleryHorizontal,
} from "lucide-react";
import HighlightItem from "@/components/HighlightItem";
import SubscribeSection from "@/components/SubscribeSection";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import UserContext from "@/context/UserContext";
import { useNavigate } from "react-router";

export default function Home() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const { fetchedLatest, fetchedBestSeller, error } = useContext(UserContext);
  let navigate = useNavigate();

  useEffect(() => {
    document.title =
      "Home | FOREVER Store | The best store with the best quality price ration";
  }, []);

  if (error) {
    toast.error("An error has occured! Please refresh the page", {
      duration: 3000,
    });
  }

  return (
    <div className="w-full h-full flex items-center flex-col gap-14">
      <Toaster
        position="top-right"
        expand={true}
        richColors
        visibleToasts={1}
      />

      {fetchedBestSeller !== null && (
        <Carousel
          plugins={[plugin.current]}
          className="w-full  relative border"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="h-full w-full">
            {fetchedBestSeller.map((product, index) => (
              <CarouselItem
                key={index}
                className="h-full flex flex-col md:flex-row w-full items-center justify-between"
              >
                <div className="w-full md:w-3/5  md:h-full flex flex-col items-center justify-center text-center py-3 px-2 md:py-1 md:px-1">
                  <h1 className="italic font-bold text-center">
                    OUR BESTSELLERS
                  </h1>
                  <h1 className="text-2xl text-wrap font-bold py-5 text-center">
                    {product.title}
                  </h1>
                  <h1 className="text-sm italic font-serif">
                    Swip Left or right
                  </h1>
                  <GalleryHorizontal />
                </div>
                <div className="h-full w-full md:w-2/5 flex justify-center md:justify-end overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="h-full md:max-h-125 w-full md:w-fit hover:cursor-pointer hover:scale-110  overflow-hidden transition delay-150 duration-300 ease-in-out"
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      <LatestCollectionSection data={fetchedLatest} />
      <BestSellersSection data={fetchedBestSeller} />

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
