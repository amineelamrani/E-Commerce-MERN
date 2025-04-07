import BestSellersSection from "@/components/BestSellersSection";
import LatestCollectionSection from "@/components/LatestCollectionSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Headset, RefreshCcwDot } from "lucide-react";
import HighlightItem from "@/components/HighlightItem";
import SubscribeSection from "@/components/SubscribeSection";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Home() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [fetchedLatest, setFetchedLatest] = useState(null);
  const [fetchedBestSeller, setFetchedBestSeller] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async (apiRoute, setData, index) => {
      try {
        const res = await fetch(apiRoute, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data && data.status === "success") {
          // setFetchedLatest(data.result);
          setData(data.result);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchData("/api/v1/products/latest", setFetchedLatest);
    fetchData("/api/v1/products/bestseller", setFetchedBestSeller);
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
          className="w-full md:w-3/4 max-h-3/4 relative border"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="h-full w-full">
            {fetchedBestSeller.map((product, index) => (
              <CarouselItem
                key={index}
                className="h-full flex flex-col md:flex-row w-full items-center justify-between"
              >
                <div className="w-full md:w-3/5 h-96 md:h-full flex flex-col items-center justify-center text-center py-5 px-2 md:py-1 md:px-1">
                  <h1 className="italic font-bold text-center">
                    OUR BESTSELLERS
                  </h1>
                  <h1 className="text-2xl text-wrap font-bold py-5 text-center">
                    {product.title}
                  </h1>
                  <h1 className="text-sm italic font-serif">
                    Swip Left or right &lt;-&gt;
                  </h1>
                </div>
                <div className="h-full w-full md:w-2/5">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-full h-full"
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
