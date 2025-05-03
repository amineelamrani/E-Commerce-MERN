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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FiveStarsInputReview from "@/components/FiveStarsInputReview";
import { Loader2 } from "lucide-react";

export default function Product() {
  let { productID } = useParams();
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetchedReviews, setFetchedReviews] = useState(null);
  const [highlightedImage, setHighlightedImage] = useState(null);
  const [size, setSize] = useState("");
  const { setBasket, productsPurchased } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isProductReviewed, setIsProductReviewed] = useState(false);
  const [reviewItem, setReviewItem] = useState({
    content: "",
    rating: 0,
  });

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
  }, [productID, isProductReviewed]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productID]);

  useEffect(() => {
    const fetchReviewsData = async () => {
      setIsProductReviewed(false);
      const res = await fetch(`/api/v1/products/${productID}/isreviewed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data && data.status === "success") {
        if (data.result.length > 0) {
          setIsProductReviewed(true);
        }
      }
    };

    fetchReviewsData();
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
  }, [isProductReviewed]);

  const handleImageClick = (e) => {
    setHighlightedImage(e.target.currentSrc);
  };

  const handleAddReview = async () => {
    // Algo
    // set loading to true
    // do a fetch to add the review (dont give the user the possibility to update while it is on loading)
    // once done successfully => show that it is done successfully thank him - click anywhere to close - dont give the possibility to review again
    setIsLoading(true);
    if (reviewItem.content !== "") {
      const res = await fetch(`/api/v1/products/${productID}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewItem),
      });
      const data = await res.json();
      if (data && data.status === "success") {
        setIsLoading(false);
        setIsProductReviewed(true);
      }
    }
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
          <div className="py-14 flex flex-col md:flex-row w-full justify-around items-start md:gap-10 mx-auto">
            <div className="w-full md:w-1/2 flex flex-col md:flex-row items-start justify-center gap-2 relative overflow-hidden">
              <div className="hidden md:flex flex-col gap-1 max-w-15 ">
                {fetchedProduct.images.map((image, index) => (
                  <img
                    src={image}
                    className=" hover:cursor-pointer"
                    alt=""
                    key={index}
                    onClick={handleImageClick}
                  />
                ))}
              </div>
              <div className="w-full h-full relative">
                <img src={highlightedImage} className="w-full h-full" alt="" />
                {productsPurchased && productsPurchased.includes(productID) && (
                  <p className="absolute right-0 top-4 bg-yellow-500 px-2 rotate-20 rounded-sm">
                    Purchased
                  </p>
                )}
                {isProductReviewed && (
                  <p className="absolute left-0 top-4 bg-green-200 px-2 -rotate-20 rounded-sm">
                    Reviewed
                  </p>
                )}
              </div>
              <div className="flex md:hidden flex-row gap-1 max-w-15">
                {fetchedProduct.images.map((image, index) => (
                  <img
                    src={image}
                    className=" hover:cursor-pointer"
                    alt=""
                    key={index}
                    onClick={handleImageClick}
                  />
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {fetchedProduct.title}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <FiveStartFeedback rating={fetchedProduct.reviewsMedian} />
                <p>({fetchedProduct.reviewsNumber})</p>
                <p>{fetchedProduct.ordersNumber} orders</p>
              </div>
              <h3 className="text-3xl font-bold">${fetchedProduct.price}</h3>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base">
                {fetchedProduct.description}
              </p>
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
                {productsPurchased &&
                  productsPurchased.includes(productID) &&
                  !isProductReviewed && (
                    <Dialog>
                      <DialogTrigger
                        className="w-38 bg-yellow-500 rounded-md hover:cursor-pointer hover:text-white text-black "
                        variant="secondary"
                      >
                        ADD REVIEW
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adding review</DialogTitle>
                          <DialogDescription className="text-xs">
                            Thanks for purchasing from us. Now next step is to
                            kindly give us your feedback on the items purchased
                            Dear client so we can improve our services!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                          <div className="flex w-full items-center gap-2">
                            <Label htmlFor="content">Review</Label>
                            <Input
                              type="text"
                              id="content"
                              value={reviewItem.content}
                              onChange={(e) => {
                                setReviewItem({
                                  ...reviewItem,
                                  ["content"]: e.target.value,
                                });
                              }}
                              placeholder="Please provide your review..."
                            />
                          </div>
                          <div className="flex w-full items-center gap-2">
                            <Label>Rating</Label>
                            <FiveStarsInputReview
                              setReviewItem={setReviewItem}
                              reviewItem={reviewItem}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          {!isProductReviewed && (
                            <Button
                              onClick={handleAddReview}
                              disabled={isLoading ? true : false}
                            >
                              {isLoading && (
                                <Loader2 className="animate-spin" />
                              )}
                              Add review
                            </Button>
                          )}

                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
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
                Reviews ({fetchedReviews !== null && fetchedReviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="description"
              className="border p-3 text-xs sm:text-sm md:text-base"
            >
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
