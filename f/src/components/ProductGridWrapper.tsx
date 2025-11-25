import React, { ReactElement, useCallback, useEffect, useState } from "react";
import customFetch from "../axios/custom";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setShowingProducts,
  setTotalProducts,
} from "../features/shop/shopSlice";

// Define Product type based on your db.json
interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number;
  popularity: number;
  stock: number;
}

// Safe string conversion helper function
const safeToString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
};

// Safe product validation
const isValidProduct = (product: any): product is Product => {
  return product && 
         product.id && 
         product.title != null && 
         product.category != null;
};

const ProductGridWrapper = ({
  searchQuery = "",
  sortCriteria = "",
  category = "",
  page = 1,
  limit,
  children,
}: {
  searchQuery?: string;
  sortCriteria?: string;
  category?: string;
  page?: number;
  limit?: number;
  children:
    | ReactElement<{ products: Product[] }>
    | ReactElement<{ products: Product[] }>[];
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { totalProducts } = useAppSelector((state) => state.shop);
  const dispatch = useAppDispatch();

  const getSearchedProducts = useCallback(
    async (query: string, sort: string, currentPage: number) => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(" Fetching products from JSON Server...");
        console.log(" API URL:", customFetch.defaults.baseURL + "/products");
        
        const response = await customFetch("/products");
        const allProducts: any[] = response.data;
        
        console.log(" Successfully fetched", allProducts.length, "products");
        
        // Step 1: Filter out invalid products first
        const validProducts = allProducts.filter(isValidProduct);
        console.log(" Valid products after filtering:", validProducts.length);
        
        if (validProducts.length !== allProducts.length) {
          console.warn(` Filtered out ${allProducts.length - validProducts.length} invalid products`);
        }

        // Step 2: Apply search filter with null safety
        let searchedProducts = validProducts.filter((product: Product) => {
          const productTitle = safeToString(product.title);
          const searchTerm = safeToString(query);
          
          return productTitle.includes(searchTerm);
        });

        console.log(" After search filter:", searchedProducts.length, "products");

        // Step 3: Apply category filter with null safety
        if (category && category !== "") {
          searchedProducts = searchedProducts.filter((product: Product) => {
            const productCategory = safeToString(product.category);
            const selectedCategory = safeToString(category);
            return productCategory === selectedCategory;
          });
          console.log(" After category filter:", searchedProducts.length, "products");
        }

        // Update total products in store
        if (totalProducts !== searchedProducts.length) {
          dispatch(setTotalProducts(searchedProducts.length));
        }

        // Step 4: Sort the products with null safety
        if (sort === "price-asc") {
          searchedProducts = [...searchedProducts].sort(
            (a: Product, b: Product) => (a.price || 0) - (b.price || 0)
          );
          console.log(" Sorted by price: low to high");
        } else if (sort === "price-desc") {
          searchedProducts = [...searchedProducts].sort(
            (a: Product, b: Product) => (b.price || 0) - (a.price || 0)
          );
          console.log(" Sorted by price: high to low");
        } else if (sort === "popularity") {
          searchedProducts = [...searchedProducts].sort(
            (a: Product, b: Product) => (b.popularity || 0) - (a.popularity || 0)
          );
          console.log(" Sorted by popularity");
        }

        let productsToShow: Product[] = [];
        
        // Fixed pagination logic
        if (limit) {
          productsToShow = searchedProducts.slice(0, limit);
          dispatch(setShowingProducts(productsToShow.length));
          console.log(` Limited to ${limit} products`);
        } else if (currentPage) {
          const startIndex = (currentPage - 1) * 9;
          const endIndex = startIndex + 9;
          productsToShow = searchedProducts.slice(startIndex, endIndex);
          dispatch(setShowingProducts(productsToShow.length));
          console.log(` Page ${currentPage}: showing products ${startIndex + 1}-${endIndex}`);
        } else {
          productsToShow = searchedProducts;
          dispatch(setShowingProducts(searchedProducts.length));
          console.log(" Showing all products");
        }

        setProducts(productsToShow);
        console.log(" Final products to display:", productsToShow.length);
        
      } catch (err: any) {
        console.error(" Failed to fetch products:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          url: err.config?.url
        });
        
        setError(
          err.response?.status === 404 
            ? "Products endpoint not found. Check if JSON Server is running correctly."
            : "Failed to load products. Please make sure JSON Server is running on port 5000."
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, totalProducts, category, limit]
  );

  useEffect(() => {
    console.log(" ProductGridWrapper useEffect triggered", {
      searchQuery,
      sortCriteria,
      category,
      page,
      limit
    });
    getSearchedProducts(searchQuery, sortCriteria, page);
  }, [searchQuery, sortCriteria, page, getSearchedProducts]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Unable to Load Products
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <div className="font-mono text-xs break-all">
              Make sure JSON Server is running:
            </div>
            <div className="font-mono bg-black text-green-400 p-2 rounded mt-1 text-xs">
              json-server --watch src/data/db.json --port 5000
            </div>
          </div>
          <button 
            onClick={() => getSearchedProducts(searchQuery, sortCriteria, page)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (products.length === 0 && !loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <div className="text-gray-500 text-xl mb-2">No products found</div>
          {searchQuery && (
            <div className="text-gray-400">
              No results for "<span className="font-semibold">{searchQuery}</span>"
            </div>
          )}
          {category && (
            <div className="text-gray-400">
              in category "<span className="font-semibold">{category}</span>"
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pass products to children
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { products });
    }
    return child;
  });

  return (
    <div>
      <div className="text-sm text-gray-500 mb-4 text-center">
        Showing {products.length} of {totalProducts} products
        {searchQuery && ` for "${searchQuery}"`}
        {category && ` in ${category}`}
      </div>
      {childrenWithProps}
    </div>
  );
};

export default ProductGridWrapper;