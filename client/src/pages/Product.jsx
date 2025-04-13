import FiveStartFeedback from "@/components/FiveStartFeedback";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewComponent from "@/components/ReviewComponent";
import RelatedProductsSection from "@/components/RelatedProductsSection";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import UserContext from "@/context/UserContext";

export default function Product() {
  let { productID } = useParams();
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetchedReviews, setFetchedReviews] = useState(null);
  const [highlightedImage, setHighlightedImage] = useState(null);
  const [size, setSize] = useState("");
  const { setBasket } = useContext(UserContext);

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
  }, [productID]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productID]);

  useEffect(() => {
    const fetchReviewsData = async () => {
      const res = await fetch(`/api/v1/products/${productID}/reviews`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data && data.status === "success") {
        setFetchedReviews(data.result);
      }
    };

    fetchReviewsData();
  }, []);

  const handleImageClick = (e) => {
    setHighlightedImage(e.target.currentSrc);
  };

  const handleAddCart = () => {
    if (size.length === 0) {
      toast.error("Please choose the size", {
        duration: 3000,
      });
    } else {
      toast.success("Product added to the basket", {
        duration: 1500,
      });
      const storedItems = localStorage.eCommerceForever;
      if (storedItems === undefined) {
        localStorage.eCommerceForever = JSON.stringify([
          {
            id: fetchedProduct._id,
            title: fetchedProduct.title,
            size: size,
            image: fetchedProduct.images[0],
            price: fetchedProduct.price,
            quantity: 1,
          },
        ]);
      } else {
        const storedArrays = JSON.parse(storedItems);

        for (let i = 0; i < storedArrays.length; i++) {
          if (
            storedArrays[i].title === fetchedProduct.title &&
            storedArrays[i].size === size &&
            storedArrays[i].id === fetchedProduct._id
          ) {
            let quant = storedArrays[i].quantity;
            quant++;

            storedArrays[i] = {
              id: fetchedProduct._id,
              title: fetchedProduct.title,
              size: size,
              image: fetchedProduct.images[0],
              price: fetchedProduct.price,
              quantity: quant,
            };
            localStorage.eCommerceForever = JSON.stringify(storedArrays);
            setBasket((basket) => !basket);
            return;
          }
        }

        // if (storedArrays.some((item) => item.title === fetchedProduct.title)) {
        //   if (storedArrays.some((item) => item.size === size)) {
        //     storedArrays[index].quantity++;
        //     return;
        //   }
        // }

        storedArrays.push({
          id: fetchedProduct._id,
          title: fetchedProduct.title,
          size: size,
          image: fetchedProduct.images[0],
          price: fetchedProduct.price,
          quantity: 1,
        });
        localStorage.eCommerceForever = JSON.stringify(storedArrays);
      }
      setBasket((basket) => !basket);
    }
  };

  return (
    <div className="">
      <Toaster
        position="top-right"
        expand={true}
        richColors
        visibleToasts={1}
      />
      {fetchedProduct !== null && (
        <div className="w-full">
          <div className="py-14 flex flex-row w-full justify-around items-start gap-10 mx-auto">
            <div className="w-1/2 flex flex-col md:flex-row items-start justify-end gap-2">
              <div className="flex flex-col gap-1  min-w-20">
                {fetchedProduct.images.map((image, index) => (
                  <img
                    src={image}
                    className="w-20 hover:cursor-pointer"
                    alt=""
                    key={index}
                    onClick={handleImageClick}
                  />
                ))}
              </div>
              <img src={highlightedImage} className="" alt="" />
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
                  onValueChange={(e) => setSize(e)}
                >
                  {fetchedProduct.sizes.map((size, index) => (
                    <ToggleGroupItem
                      value={size}
                      className="bg-slate-200 rounded-sm py-2 hover:cursor-pointer"
                      aria-label="Toggle bold"
                      key={index}
                    >
                      {size}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <div className="flex gap-2">
                <Button className="w-38" onClick={handleAddCart}>
                  ADD TO CART
                </Button>
                <Button className="w-38" variant="secondary">
                  ADD A REVIEW
                </Button>
                {/* (only verified Purchaser) */}
              </div>

              <div className="w-full border-t py-5 text-xs font-mono text-slate-500 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
              </div>
            </div>
          </div>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="border">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({fetchedProduct.reviewsNumber})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="border p-3">
              An e-commerce website is an online platform that facilitates the
              buying and selling of products or services over the internet. It
              serves as a virtual marketplace where businesses and individuals
              can showcase their products, interact with customers, and conduct
              transactions without the need for a physical presence. E-commerce
              websites have gained immense popularity due to their convenience,
              accessibility, and the global reach they offer.
              <br />
              E-commerce websites typically display products or services along
              with detailed descriptions, images, prices, and any available
              variations (e.g., sizes, colors). Each product usually has its own
              dedicated page with relevant information.
            </TabsContent>
            <TabsContent
              value="reviews"
              className="border p-3 flex flex-col gap-3"
            >
              {fetchedReviews !== null &&
                fetchedReviews.length > 0 &&
                fetchedReviews.map((item, index) => (
                  <ReviewComponent
                    title={fetchedProduct.title}
                    review={item}
                    key={index}
                  />
                ))}
              {fetchedReviews === null ||
                (fetchedReviews.length === 0 && <p>No review yet added</p>)}
            </TabsContent>
          </Tabs>
          <RelatedProductsSection
            category={fetchedProduct.category[0]}
            subCategory={fetchedProduct.subCategory[0]}
          />
        </div>
      )}
    </div>
  );
}
