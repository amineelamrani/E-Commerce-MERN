import FiveStartFeedback from "@/components/FiveStartFeedback";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

export default function Product() {
  let { productID } = useParams();
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [highlightedImage, setHighlightedImage] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      const res = await fetch(`/api/v1/products/${productID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data && data.status === "success") {
        setFetchedProduct(data.result);
        setHighlightedImage(data.result.images[0]);
      }
    };

    fetchProductData();
  }, []);

  const handleImageClick = (e) => {
    setHighlightedImage(e.target.currentSrc);
  };

  return (
    <div className="">
      {fetchedProduct !== null && (
        <div>
          <div className="py-14 flex flex-row w-full items-start gap-10">
            <div className="w-1/2 flex flex-row items-start gap-2">
              <div className="flex flex-col gap-1">
                {fetchedProduct.images.map((image, index) => (
                  <img
                    src={image}
                    className="w-24 hover:cursor-pointer"
                    alt=""
                    key={index}
                    onClick={handleImageClick}
                  />
                ))}
              </div>
              <img src={highlightedImage} alt="" />
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <h1 className="text-3xl font-bold">{fetchedProduct.title}</h1>
              <div className="flex items-center gap-2 text-sm">
                <FiveStartFeedback rating={fetchedProduct.reviewsMedian} />
                <p>({fetchedProduct.reviewsNumber})</p>
              </div>
              <h3 className="text-3xl font-bold">${fetchedProduct.price}</h3>
              <p className="text-slate-600">{fetchedProduct.description}</p>
              <div className="flex flex-col">
                <h4>Select Size</h4>
                <ToggleGroup
                  type="single"
                  className="gap-2 rounded-none"
                  onValueChange={(e) => console.log(e)}
                >
                  {fetchedProduct.sizes.map((size, index) => (
                    <ToggleGroupItem
                      value={size}
                      className="bg-slate-200 rounded-sm py-2"
                      aria-label="Toggle bold"
                      key={index}
                    >
                      {size}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <Button className="w-38">ADD TO CART</Button>
              <div className="w-full border-t py-5 text-xs font-mono text-slate-500 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
              </div>
            </div>
          </div>
          <div>
            <h2>
              Make here as Tabs one for the description + the other for the
              reviews
            </h2>
            <h2>
              And then see how to add the related products (choose in front end
              or backend)
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
