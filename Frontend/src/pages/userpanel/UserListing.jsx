import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductFilter from "@/components/userpanel/ProductFilter";
import { sortOptions } from "@/config";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/user/product-slice";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserProductTile from "@/components/userpanel/UserProductTile";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductDetailsDialog from "@/components/userpanel/ProductDetailsDialog";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/user/cart-slice";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function UserListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector((state) => state.userProducts);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOptions) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOptions] };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOptions);
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOptions);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    toast.promise(dispatch(fetchProductDetails(getCurrentProductId)).unwrap(), {
      loading: "Loading product details...",
      success: () => {
        setOpenDetailsDialog(true);
        return "Product loaded successfully!";
      },
      error: "Failed to load product. Try again.",
    });
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    });
  }

  useEffect(() => {
    const filtersFromStorage = JSON.parse(sessionStorage.getItem("filters")) || {};
    const categoryFromURL = searchParams.get("category");

    if (categoryFromURL) {
      filtersFromStorage.category = [categoryFromURL];
    }

    setFilters(filtersFromStorage);
    const createQueryString = createSearchParamsHelper(filtersFromStorage);
    setSearchParams(new URLSearchParams(createQueryString));
  }, [searchParams]);

  useEffect(() => {
    if (filters && sort) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
    }
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length || 0} Products
            </span>
            <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2 bg-background hover:bg-accent/20 text-foreground px-4 py-2 rounded-lg transition-all shadow-sm"
    >
      <ArrowUpDown className="h-4 w-4" />
      <span className="font-medium">Sort by</span>
    </Button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent 
    align="end" 
    className="w-[240px] rounded-lg shadow-xl bg-popover mt-2 border-0" // Added border-0 here
    sideOffset={6}
  >
    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
      {sortOptions.map((sortItem) => (
        <DropdownMenuRadioItem 
          value={sortItem.id} 
          key={sortItem.id}
          className="px-5 py-2.5 text-sm cursor-pointer transition-colors 
            hover:bg-accent/30 focus:bg-accent/40
            data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary 
            data-[state=checked]:font-medium group border-0" // Added border-0 here
        >
          <div className="flex items-center justify-between w-full">
            <span>{sortItem.label}</span>
            <span className="ml-auto pl-4">
              <span className="h-2 w-2 rounded-full bg-primary opacity-0 
                group-data-[state=checked]:opacity-100 transition-opacity
                inline-block shadow-sm" />
            </span>
          </div>
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <UserProductTile
                key={productItem._id}
                product={productItem}
                handleGetProductDetails={() => handleGetProductDetails(productItem._id)}
                handleAddtoCart={() => handleAddtoCart(productItem._id, productItem.totalStock)}
              />
            ))
          ) : (
            <p className="p-4 text-muted-foreground">No products found.</p>
          )}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default UserListing;