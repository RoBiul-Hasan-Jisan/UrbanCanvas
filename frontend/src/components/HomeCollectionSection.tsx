import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductGrid from "./ProductGrid";
import ProductGridWrapper from "./ProductGridWrapper";

gsap.registerPlugin(ScrollTrigger);

const HomeCollectionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null); // Ref for background text

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. TEXT REVEAL (Mask Effect)
      const titleChars = titleRef.current?.querySelectorAll(".char");
      
      if (titleChars) {
        gsap.fromTo(titleChars, 
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            }
          }
        );
      }

      // 2. LINE DRAWING ANIMATION
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "expo.out",
            delay: 0.5,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            }
          }
        );
      }

      // 3. MAGNETIC BUTTON LOGIC
      const btn = btnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

        const mouseMove = (e: MouseEvent) => {
          const { left, top, width, height } = btn.getBoundingClientRect();
          const x = e.clientX - (left + width / 2);
          const y = e.clientY - (top + height / 2);
          
          xTo(x * 0.3);
          yTo(y * 0.3);
        };

        const mouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener("mousemove", mouseMove);
        btn.addEventListener("mouseleave", mouseLeave);
      }

      // 4. BACKGROUND MOVEMENT (NEW ADDITION)
      // Moves the giant text horizontally based on scroll position
      if (bgTextRef.current) {
        gsap.to(bgTextRef.current, {
          xPercent: -20, // Moves 20% to the left
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom", // Start when section enters viewport
            end: "bottom top",   // End when section leaves viewport
            scrub: 1,            // Smooth scrolling effect
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-24 bg-white relative overflow-hidden">
      
      {/* --- NEW: KINETIC BACKGROUND LAYER --- */}
      {/* This sits behind everything (z-0) and moves on scroll */}
      <div 
        ref={bgTextRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[200%] select-none pointer-events-none z-0 opacity-[0.03]"
      >
        <h2 className="text-[18vw] font-black leading-none whitespace-nowrap text-black tracking-tighter">
          NEW SEASON — NEW COLLECTION — NEW SEASON —
        </h2>
      </div>

      {/* Header Container (Relative z-10 to sit ABOVE background) */}
      <div className="max-w-screen-2xl mx-auto px-5 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          
          {/* TITLE WITH MASK */}
          <div className="overflow-hidden">
            <h1 ref={titleRef} className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
              <span className="char inline-block">N</span>
              <span className="char inline-block">e</span>
              <span className="char inline-block">w</span>
              <span className="inline-block">&nbsp;</span>
              <span className="char inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Arrivals
              </span>
            </h1>
          </div>

          {/* ADVANCED MAGNETIC BUTTON */}
          <div className="relative">
             <Link
              to="/shop"
              ref={btnRef}
              className="
                relative inline-flex items-center justify-center px-10 py-4 
                text-lg font-bold tracking-widest uppercase 
                border-2 border-gray-900 rounded-full overflow-hidden 
                text-gray-900 group transition-colors duration-300
                hover:text-white hover:border-transparent
              "
            >
              <span className="absolute inset-0 w-full h-full bg-gray-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
              
              <span className="relative z-10 flex items-center gap-3">
                View Collection
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* ANIMATED DIVIDER LINE */}
        <div 
          ref={lineRef} 
          className="w-full h-[2px] bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 mt-8"
        ></div>
      </div>

      {/* Grid Section (Relative z-10) */}
      <div className="relative z-10">
        <ProductGridWrapper limit={4}>
          <ProductGrid />
        </ProductGridWrapper>
      </div>
    </section>
  );
};

export default HomeCollectionSection;