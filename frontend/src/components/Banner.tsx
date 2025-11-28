import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Banner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleLinesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // --- 1. OPENING SEQUENCE ---
      
      // A. Image Shutter Reveal (Expands from center)
      tl.fromTo(
        imageRef.current,
        { 
          scale: 1.4, 
          filter: "blur(10px)",
          clipPath: "inset(40% 10% 40% 10%)" // Starts as a small strip
        },
        { 
          scale: 1.1, // Lands slightly zoomed in (for parallax room)
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",   // Expands to full size
          duration: 1.8,
          ease: "expo.out",
        }
      );

      // B. Overlay Fade In
      tl.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1 }, 
        "-=1.2"
      );

      // C. Text "Mask" Reveal (Rising from hidden overflow)
      titleLinesRef.current.forEach((line, i) => {
        if (line) {
          gsap.fromTo(line.children, 
            { y: "100%", rotate: 5 }, // Start below and tilted
            {
              y: "0%", 
              rotate: 0,
              duration: 1.2,
              ease: "power4.out",
              delay: i * 0.15, // Stagger lines
            }
          );
        }
      });

      // D. Button Pop Up
      tl.fromTo(btnRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.5"
      );

      // --- 2. CONTINUOUS "KEN BURNS" ZOOM ---
      // Keeps the image slowly moving so it never feels static
      gsap.to(imageRef.current, {
        scale: 1.2,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      // --- 3. MOUSE PARALLAX INTERACTION ---
      const container = containerRef.current;
      if (container) {
        const xToImg = gsap.quickTo(imageRef.current, "x", { duration: 0.5, ease: "power3" });
        const yToImg = gsap.quickTo(imageRef.current, "y", { duration: 0.5, ease: "power3" });
        
        const xToText = gsap.quickTo([titleLinesRef.current, btnRef.current], "x", { duration: 0.8, ease: "power3" });
        const yToText = gsap.quickTo([titleLinesRef.current, btnRef.current], "y", { duration: 0.8, ease: "power3" });

        container.addEventListener("mousemove", (e) => {
          const { width, height } = container.getBoundingClientRect();
          const x = (e.clientX / width) - 0.5;
          const y = (e.clientY / height) - 0.5;

          // Image moves Opposite to mouse (Background layer)
          xToImg(x * -50); 
          yToImg(y * -50);

          // Text moves Towards mouse (Foreground layer)
          xToText(x * 30);
          yToText(y * 30);
        });
        
        // Reset on leave
        container.addEventListener("mouseleave", () => {
           xToImg(0); yToImg(0);
           xToText(0); yToText(0);
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper to push refs into array
  const addToTitleRefs = (el: HTMLHeadingElement | null) => {
    if (el && !titleLinesRef.current.includes(el)) {
      titleLinesRef.current.push(el);
    }
  };

  return (
    // UPDATED: Changed h-[85vh] to h-full so it fills the parent sticky container
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden bg-black"
    >
      {/* 1. BACKGROUND IMAGE */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Fashion Banner"
          // ADDED 'brightness-50': This makes the image 50% darker
          className="w-full h-full object-cover will-change-transform scale-110 brightness-50" 
        />
      </div>

      {/* 2. DARK OVERLAY */}
      <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10"></div>

      {/* 3. CONTENT CONTAINER */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full text-center px-4">
        
        {/* Animated Subtitle (Masked) */}
        <div className="overflow-hidden mb-4">
          <p 
            ref={addToTitleRefs} 
            className="block text-white/90 text-sm md:text-base tracking-[6px] uppercase font-medium"
          >
            <span className="block">New Season Arrivals</span>
          </p>
        </div>

        {/* Main Title (Masked Lines) */}
        <div className="space-y-2 mb-10">
            <div className="overflow-hidden">
               {/* Change 'text-white' to 'text-red-500', 'text-blue-500', etc. */}
               <h1 ref={addToTitleRefs} className="block text-6xl md:text-8xl font-black text-rose-600 tracking-tighter leading-none">
                 <span className="block">SUMMER</span>
               </h1>
            </div>
            <div className="overflow-hidden">
               <h1 ref={addToTitleRefs} className="block text-6xl md:text-8xl font-black text-blue-400 tracking-tighter leading-none">
                 <span className="block">COLLECTION</span>
               </h1>
            </div>
        </div>

        {/* Buttons Group */}
        <div ref={btnRef} className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <Link
            to="/shop"
            className="group relative px-10 py-4 bg-white text-black overflow-hidden"
          >
             <span className="absolute inset-0 w-full h-full bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
             <span className="relative z-10 text-sm font-bold tracking-widest uppercase">Shop Now</span>
          </Link>

          <Link
            to="/collection"
            className="group relative px-10 py-4 bg-transparent border border-white text-white overflow-hidden"
          >
             <span className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
             <span className="relative z-10 text-sm font-bold tracking-widest uppercase group-hover:text-black transition-colors duration-300">Explore</span>
          </Link>
        </div>

      </div>
      
      {/* Decorative Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
         <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default Banner;