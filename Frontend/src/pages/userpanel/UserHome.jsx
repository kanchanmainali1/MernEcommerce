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

  // Banner slider auto-rotation.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Search effect: Debounce input and update search results.
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

  // Open product details dialog when available.
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Navigate to the full listing page.
  function handleNavigateToListingPage() {
    navigate(`/user/listing`);
  }

  // Fetch product details.
  function handleGetProductDetails(productId) {
    toast.promise(dispatch(fetchProductDetails(productId)).unwrap(), {
      loading: "Loading product...",
      success: () => {
        setOpenDetailsDialog(true);
        return "Product loaded successfully!";
      },
      error: "Failed to load product details.",
    });
  }

  // Handler for adding product to cart.
  function handleAddToCart(productId, totalStock) {
    const currentCartItems = cartItems?.items || [];
    const index = currentCartItems.findIndex((item) => item.productId === productId);
    if (index > -1) {
      const quantity = currentCartItems[index].quantity;
      if (quantity + 1 > totalStock) {
        toast.error(`Only ${totalStock} quantity can be added for this item`);
        return;
      }
    }
    toast.promise(
      dispatch(
        addToCart({
          userId: user?.id,
          productId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
        }
      }),
      {
        loading: "Adding product to cart...",
        success: "Product is added to cart!",
        error: "Failed to add product to cart. Please try again.",
      }
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Search Bar */}
      <div className="w-full bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              value={keyword}
              name="keyword"
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Search Products..."
            />
          </div>
        </div>
      </div>

      {/* Banner Slider */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-xl shadow-xl my-8">
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
        {/* Banner Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/60 rounded-xl">
          <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg mb-4">
            Explore The Best Collections
          </h1>
          <p className="text-lg drop-shadow-lg mb-6">
            Discover exclusive products at unbeatable prices. Shop your favorite styles with ease and elegance.
          </p>
          <div className="flex gap-4">
            <Button
              variant="default"
              className="text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all"
              onClick={handleNavigateToListingPage}
            >
              Browse Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto md:px-6 px-4 pb-12">
        {keyword && keyword.trim().length > 3 ? (
          searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
            <h1 className="text-5xl font-extrabold text-center">No result found!</h1>
          )
        ) : (
          <>
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
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
