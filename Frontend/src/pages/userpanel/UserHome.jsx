import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/user/product-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/userpanel/ProductDetailsDialog";
import UserProductTile from "@/components/userpanel/UserProductTile";

// Banner images (place your own images in the assets folder)
import bannerOne from "../../assets/pic1.jpg";
import bannerTwo from "../../assets/pic4.jpg";
import bannerThree from "../../assets/pic3.jpg";

const banners = [bannerOne, bannerTwo, bannerThree];

function UserHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const productList = useSelector((state) => state.userProducts?.productList || []);
  const productDetails = useSelector((state) => state.userProducts?.productDetails || null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage() {
    navigate(`/user/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    toast.promise(dispatch(fetchProductDetails(getCurrentProductId)).unwrap(), {
      loading: "Loading product...",
      success: () => {
        setOpenDetailsDialog(true);
        return "Product loaded successfully!";
      },
      error: "Failed to load product details.",
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen space-y-12 p-4 md:p-6 bg-gray-100">
      {/* Banner Slider */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-xl shadow-xl mb-8">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}

        {/* Banner Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white bg-black/60  rounded-xl">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg">Explore The Best Collections</h1>
            <p className="text-lg drop-shadow-lg">
              Discover exclusive products at unbeatable prices. Shop your favorite styles with ease and elegance.
            </p>
            <Button 
              variant="default"
              className="text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all"
              onClick={handleNavigateToListingPage}
            >
              Browse Collection
            </Button>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length)
            }
            className="bg-white/70 hover:bg-white/90 p-2 rounded-full shadow-md"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length)
            }
            className="bg-white/70 hover:bg-white/90 p-2 rounded-full shadow-md"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-800" />
          </Button>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-10 bg-white rounded-xl shadow-lg px-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList.length > 0 ? (
              productList.map((productItem) => (
                <UserProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-lg text-gray-600">No Products Found</p>
            )}
          </div>
        </div>
      </section>

      {/* Product Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default UserHome;
