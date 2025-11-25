import React, { useRef, useLayoutEffect } from "react";
import ProductItem from "./ProductItem";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string | number;
  image: string;
  title: string;
  category: string;
  price: number;
  popularity?: number;
  stock?: number;
}

const ProductGrid = ({ products }: { products?: Product[] }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!products || products.length === 0) return;

    const ctx = gsap.context(() => {
      
      // --- ADVANCED 3D CASCADE ANIMATION ---
      const cards = gsap.utils.toArray(".product-card-wrapper");

      gsap.fromTo(
        cards,
        {
          // START STATE (Deep Space)
          z: -500,             // Pushed far back into the screen
          y: 150,              // Slightly down
          rotationX: 45,       // Tilted back
          opacity: 0,          // Invisible
          scale: 0.5,          // Small
          filter: "blur(10px)" // Blurry (simulating speed)
        },
        {
          // END STATE (Normal)
          z: 0,
          y: 0,
          rotationX: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)", // Sharpen focus
          
          duration: 1.2,
          ease: "elastic.out(1, 0.75)", // Heavy, realistic physics bounce
          
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%", // Start slightly earlier for better UX
            toggleActions: "play none none reverse",
          },
          
          stagger: {
            amount: 0.8,      // Fast ripple
            grid: "auto",     // Auto-detect layout
            from: "center",   // Explode from center
            ease: "power2.out"
          },
        }
      );

    }, gridRef);

    return () => ctx.revert();
  }, [products]);

  if (!products || products.length === 0) return null;

  return (
    <div
      ref={gridRef}
      id="gridTop"
      // Added 'perspective-[2000px]' to parent. This is REQUIRED for 3D effects.
      className="
        max-w-screen-2xl mx-auto px-5 mt-12 
        perspective-[2000px] 
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-6 
        lg:gap-8 
        place-items-center
      "
    >
      {products.map((product) => (
        <div 
          key={product.id} 
          // 'preserve-3d' allows the 3D rotation to look real
          className="product-card-wrapper w-full flex justify-center [transform-style:preserve-3d]"
        >
          <ProductItem
            id={String(product.id)}
            image={product.image}
            title={product.title}
            category={product.category}
            price={product.price}
            popularity={product.popularity ?? 0}
            stock={product.stock ?? 0}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProductGrid);