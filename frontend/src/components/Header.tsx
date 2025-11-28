import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiBars3,
} from "react-icons/hi2";
import SidebarMenu from "./SidebarMenu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppSelector } from "../hooks";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // --- FIX: Using the correct variable name from your slice ---
  const { productsInCart } = useAppSelector((state) => state.cart);

  // --- Calculate total quantity safely ---
  const totalQuantity = (productsInCart || []).reduce(
    (total, product) => total + product.quantity, 
    0
  );

  // Refs for animation targets
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const rightIconsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  // --- BADGE ANIMATION (Pop effect when quantity changes) ---
  useEffect(() => {
    if (totalQuantity > 0 && badgeRef.current) {
      gsap.fromTo(badgeRef.current,
        { scale: 0.5, backgroundColor: "#22c55e" }, 
        { scale: 1, backgroundColor: "#000000", duration: 0.4, ease: "back.out(2)" } 
      );
    }
  }, [totalQuantity]);

  // --- HEADER ANIMATIONS ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Entrance
      tl.fromTo(headerRef.current, 
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .from([menuBtnRef.current, logoRef.current, rightIconsRef.current?.children], {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5");

      // 2. Scroll Behavior (Hide on down, Show on up)
      ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 100) {
            gsap.to(headerRef.current, { yPercent: -100, duration: 0.4, ease: "power3.inOut" });
          } else {
            gsap.to(headerRef.current, { yPercent: 0, duration: 0.4, ease: "power3.out" });
          }
        }
      });

      // 3. Magnetic Hover Effect
      const applyMagnetic = (element: HTMLElement | null) => {
        if (!element) return;
        const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3" });

        element.addEventListener("mousemove", (e) => {
          const { left, top, width, height } = element.getBoundingClientRect();
          xTo((e.clientX - (left + width / 2)) * 0.5);
          yTo((e.clientY - (top + height / 2)) * 0.5);
        });

        element.addEventListener("mouseleave", () => {
          xTo(0);
          yTo(0);
        });
      };

      applyMagnetic(menuBtnRef.current);
      if (rightIconsRef.current) {
        Array.from(rightIconsRef.current.children).forEach((child) => {
            applyMagnetic(child as HTMLElement);
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 transition-shadow duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          
          <button
            ref={menuBtnRef}
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <HiBars3 className="text-2xl text-gray-900" />
          </button>

          <Link to="/" ref={logoRef} className="flex flex-col items-center group relative">
            <span className="text-3xl font-serif font-black text-gray-900 tracking-tight group-hover:tracking-widest transition-all duration-500 ease-out">
              UrbanCanvas
            </span>
            <span className="text-[10px] text-gray-500 tracking-[0.3em] font-medium mt-1 uppercase group-hover:text-black transition-colors duration-300">
              Luxury Fashion
            </span>
          </Link>

          <div ref={rightIconsRef} className="flex items-center gap-2">
            <Link to="/search" className="p-3 rounded-full hover:bg-gray-100 transition-colors group">
              <HiOutlineMagnifyingGlass className="text-xl text-gray-800 group-hover:scale-110 transition-transform" />
            </Link>
            
            <Link to="/login" className="p-3 rounded-full hover:bg-gray-100 transition-colors group">
              <HiOutlineUser className="text-xl text-gray-800 group-hover:scale-110 transition-transform" />
            </Link>
            
            <Link to="/cart" className="p-3 rounded-full hover:bg-gray-100 transition-colors group relative">
              <HiOutlineShoppingBag className="text-xl text-gray-800 group-hover:scale-110 transition-transform" />
              
              {/* Conditional Rendering: Only show if quantity > 0 */}
              {totalQuantity > 0 && (
                <span 
                  ref={badgeRef}
                  className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                >
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <SidebarMenu
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
};

export default Header;