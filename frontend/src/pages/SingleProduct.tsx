import React, { useLayoutEffect, useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
import { useAppDispatch } from "../hooks";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { formatCategoryName } from "../utils/formatCategoryName";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import {
  Button,
  Dropdown,
  ProductItem,
  QuantityInput,
  StandardSelectInput,
} from "../components";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- TYPES ---
interface Product {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  description?: string;
  popularity: number;
  stock: number;
}

// --- HOC OPTIMIZATION ---
const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

const SingleProduct = () => {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Form State
  const [size, setSize] = useState<string>("xs");
  const [color, setColor] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);

  // --- REFS ---
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  
  // --- DATA FETCHING ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const [productRes, allProductsRes] = await Promise.all([
          fetch(`https://urbancanvas.onrender.com/products/${params.id}`),
          fetch("https://urbancanvas.onrender.com/products")
        ]);

        if (!productRes.ok) throw new Error("Product not found");

        const productData = await productRes.json();
        const allProductsData = await allProductsRes.json();

        setSingleProduct(productData);
        setProducts(allProductsData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    loadData();
    
    setQuantity(1);
    setSize("xs");
    setColor("black");
  }, [params.id]);

  // --- MEMOIZED LOGIC ---
  const similarProducts = useMemo(() => {
    if (!singleProduct || products.length === 0) return [];
    
    // Improved filter logic
    return products
      .filter(p => p.category === singleProduct.category && p.id !== singleProduct.id)
      .slice(0, 3);
  }, [products, singleProduct]);

  // --- ANIMATIONS ---
  useLayoutEffect(() => {
    if (isLoading || !singleProduct) return;

    // Use GSAP MatchMedia for responsive animations
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // General Reveal Animation (All Screens)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(imageContainerRef.current, 
        { clipPath: "inset(0% 100% 0% 0%)", scale: 1.1 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2 }
      )
      .fromTo(imageRef.current,
        { scale: 1.4 },
        { scale: 1, duration: 1.2 },
        "<"
      )
      .fromTo(detailsRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8 },
        "-=0.8"
      );

      // Scroll Trigger for Similar Products
      gsap.from(".similar-product-card", {
        scrollTrigger: {
          trigger: ".similar-products-section",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });

    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [isLoading, singleProduct]);

  // --- INTERACTION HANDLERS ---
  const handleAddToCart = () => {
    if (!singleProduct) return;

    dispatch(
      addProductToTheCart({
        id: singleProduct.id + size + color,
        image: singleProduct.image,
        title: singleProduct.title,
        category: singleProduct.category,
        price: singleProduct.price,
        quantity,
        size,
        color,
        popularity: singleProduct.popularity,
        stock: singleProduct.stock,
      })
    );
    toast.success("Added to your cart!");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Disable parallax on mobile/tablet to improve performance
    if(!imageRef.current || window.innerWidth < 1024) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const xPos = (clientX - left) / width - 0.5;
    const yPos = (clientY - top) / height - 0.5;

    gsap.to(imageRef.current, {
      x: xPos * 30,
      y: yPos * 30,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if(!imageRef.current) return;
    gsap.to(imageRef.current, { x: 0, y: 0, duration: 0.5 });
  };

  // --- RENDER HELPERS ---
  if (error) {
    return <div className="h-screen flex items-center justify-center text-xl">Product not found.</div>;
  }

  return (
    // Responsive padding: smaller on mobile (pt-20), larger on desktop (pt-24)
    <div ref={containerRef} className="max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-8 pt-20 lg:pt-24 pb-16">
      
      {/* SKELETON LOADER - Responsive */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 animate-pulse">
          <div className="lg:col-span-2 bg-gray-200 h-[400px] lg:h-[600px] rounded-xl" />
          <div className="flex flex-col gap-5 mt-4 lg:mt-9">
            <div className="h-10 bg-gray-200 w-3/4 rounded" />
            <div className="h-6 bg-gray-200 w-1/2 rounded" />
            <div className="h-40 bg-gray-200 rounded mt-5" />
          </div>
        </div>
      ) : (
        /* ACTUAL CONTENT */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-12 min-h-[80vh]">
            
            {/* PRODUCT IMAGE SECTION */}
            <div 
              ref={imageContainerRef}
              // aspect-[4/5] ensures image isn't too tall on mobile
              // lg:h-full allows it to fill space on desktop
              className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-[#f0f0f0] cursor-crosshair aspect-[4/5] lg:aspect-auto lg:h-full"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                ref={imageRef}
                src={`/assets/${singleProduct?.image}`}
                alt={singleProduct?.title}
                className="w-full h-full object-cover origin-center absolute inset-0 lg:static"
              />
              <div className="absolute bottom-4 right-4 lg:bottom-5 lg:right-5 bg-white/80 backdrop-blur px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-[10px] lg:text-xs font-medium uppercase tracking-wider shadow-sm">
                Hover to explore
              </div>
            </div>

            {/* PRODUCT DETAILS SECTION */}
            <div ref={detailsRef} className="w-full flex flex-col gap-6 lg:py-4">
              <div className="flex flex-col gap-3 pb-6 border-b border-black/10">
                <div className="flex justify-between items-start">
                  {/* Responsive Text Size */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight">
                    {singleProduct?.title}
                  </h1>
                </div>
                
                <div className="flex justify-between items-center text-lg">
                  <span className="text-secondaryBrown font-medium uppercase tracking-wide text-sm">
                    {formatCategoryName(singleProduct?.category || "")}
                  </span>
                  <span className="font-bold text-xl md:text-2xl">${singleProduct?.price}</span>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-col gap-4">
                {/* Selectors Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <SelectInputUpgrade
                    label="Size"
                    selectList={[
                      { id: "xs", value: "XS" },
                      { id: "sm", value: "SM" },
                      { id: "m", value: "M" },
                      { id: "lg", value: "LG" },
                      { id: "xl", value: "XL" },
                      { id: "2xl", value: "2XL" },
                    ]}
                    value={size}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSize(e.target.value)}
                  />
                  <SelectInputUpgrade
                    label="Color"
                    selectList={[
                      { id: "black", value: "BLACK" },
                      { id: "red", value: "RED" },
                      { id: "blue", value: "BLUE" },
                      { id: "white", value: "WHITE" },
                      { id: "rose", value: "ROSE" },
                      { id: "green", value: "GREEN" },
                    ]}
                    value={color}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setColor(e.target.value)}
                  />
                </div>

                {/* Actions: Stack on mobile, Row on tablet/desktop */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
                  <div className="w-full sm:w-32">
                    <QuantityInputUpgrade
                      value={quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex-1 w-full">
                     {/* Note: Removed 'fullWidth' prop to prevent TS error.
                       Using w-full wrapper div instead for mobile responsiveness.
                     */}
                     <div className="w-full [&>button]:w-full">
                       <Button mode="brown" text="Add to Cart" onClick={handleAddToCart} />
                     </div>
                  </div>
                </div>
                
                <p className="text-green-600 text-sm flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"/>
                  In Stock - Ready to ship
                </p>
              </div>

              {/* INFO ACCORDIONS */}
              <div className="mt-2 flex flex-col gap-2">
                <Dropdown dropdownTitle="Description">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {singleProduct?.description || "Experience premium quality with our meticulously crafted design. Made for comfort and durability."}
                  </p>
                </Dropdown>

                <Dropdown dropdownTitle="Materials & Care">
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm md:text-base">
                    <li>100% Premium Cotton</li>
                    <li>Machine wash cold</li>
                    <li>Do not bleach</li>
                  </ul>
                </Dropdown>

                <Dropdown dropdownTitle="Shipping & Returns">
                  <p className="text-gray-600 text-sm md:text-base">Free shipping on orders over $100. 30-day return policy.</p>
                </Dropdown>
              </div>
            </div>
          </div>

          {/* SIMILAR PRODUCTS */}
          {similarProducts.length > 0 && (
            <div className="similar-products-section mt-20 lg:mt-32 border-t border-black/10 pt-12 lg:pt-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl mb-8 lg:mb-12 text-center font-medium">
                You May Also Like
              </h2>
              {/* Responsive Grid instead of Flex for better alignment on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 lg:gap-8 justify-items-center">
                {similarProducts.map((product) => (
                  <div key={product.id} className="similar-product-card w-full max-w-[350px]">
                    <ProductItem {...product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleProduct;