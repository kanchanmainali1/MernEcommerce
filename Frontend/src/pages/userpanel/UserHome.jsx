import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/user/product-slice";
import { getSearchResults, resetSearchResults } from "@/store/user/search-slice";
import { addToCart, fetchCartItems } from "@/store/user/cart-slice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/userpanel/ProductDetailsDialog";
import UserProductTile from "@/components/userpanel/UserProductTile";

// Banner images (ensure these paths point to your assets)
import bannerOne from "../../assets/pic1.jpg";
import bannerTwo from "../../assets/pic4.jpg";
import bannerThree from "../../assets/pic3.jpg";

const banners = [bannerOne, bannerTwo, bannerThree];

function UserHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selectors for state slices
  const productList = useSelector((state) => state.userProducts?.productList || []);
  const { searchResults } = useSelector((state) => state.userSearch);
  const productDetails = useSelector((state) => state.userProducts?.productDetails || null);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.userCart);

  // Fetch featured products when no search term is active.
  useEffect(() => {
    if (!keyword || keyword.trim().length < 4) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: {},
          sortParams: "price-lowtohigh",
        })
      );
    }
  }, [dispatch, keyword]);

  // Auto-rotate banner slider.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Debounce search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword && keyword.trim().length > 3) {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      } else {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(resetSearchResults());
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [keyword, dispatch, setSearchParams]);

  // Open product details dialog when fetched.
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Navigation and data fetching.
  const handleNavigateToListingPage = () => {
    navigate(`/user/listing`);
  };

  const handleGetProductDetails = (productId) => {
    toast.promise(dispatch(fetchProductDetails(productId)).unwrap(), {
      loading: "Loading product...",
      success: () => {
        setOpenDetailsDialog(true);
        return "Product loaded successfully!";
      },
      error: "Failed to load product details.",
    });
  };

  const handleAddToCart = (productId, totalStock) => {
    const currentCartItems = cartItems?.items || [];
    const index = currentCartItems.findIndex((item) => item.productId === productId);
    if (index > -1 && currentCartItems[index].quantity + 1 > totalStock) {
      toast.error(`Only ${totalStock} quantity can be added for this item`);
      return;
    }
    toast.promise(
      dispatch(
        addToCart({
          userId: user?.id,
          productId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) dispatch(fetchCartItems(user?.id));
      }),
      {
        loading: "Adding product to cart...",
        success: "Product added to cart!",
        error: "Failed to add product to cart. Please try again.",
      }
    );
  };

  // Slider controls.
  const handlePrevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  const handleNextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Search Bar Section (Moved Above Banner Slider) */}
      <div className="w-full bg-white/90 backdrop-blur-md py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-6 h-6 text-gray-500" />
            </div>
            <Input
              value={keyword}
              name="keyword"
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search Products..."
              className="w-full pl-12 pr-4 py-3 text-base rounded-full border border-gray-300 shadow focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Banner Slider Section */}
      <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Slider Arrow Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto md:px-6 px-4 pb-12">
        {keyword && keyword.trim().length > 3 ? (
          searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((item) => (
                <UserProductTile
                  key={item.productId}
                  product={item}
                  handleGetProductDetails={() => handleGetProductDetails(item.productId)}
                  handleAddtoCart={() => handleAddToCart(item.productId, item.totalStock)}
                />
              ))}
            </div>
          ) : (
            <h1 className="text-5xl font-extrabold text-center mt-16">No result found!</h1>
          )
        ) : (
          <>
            <h2 className="text-4xl font-bold text-center mb-10 mt-6 text-gray-800">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productList.length > 0 ? (
                productList.map((product) => (
                  <UserProductTile
                    key={product._id}
                    product={product}
                    handleGetProductDetails={() => handleGetProductDetails(product._id)}
                  />
                ))
              ) : (
                <p className="text-center col-span-full text-lg text-gray-600">
                  No Products Found
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default UserHome;
