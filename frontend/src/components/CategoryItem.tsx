import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

interface CategoryItemProps {
  categoryTitle: string;
  image: string;
  link: string;
}

const CategoryItem = ({ categoryTitle, image, link }: CategoryItemProps) => {
  const containerRef = useRef<HTMLDivElement>(null); // New ref for the whole container
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // --- 1. ENTRANCE SLIDE ANIMATION ---
  useEffect(() => {
    const container = containerRef.current;
    
    // This animation runs once when the component mounts
    gsap.fromTo(container, 
      {
        y: 100,      // Start 100px down (Slide from bottom)
        opacity: 0,  // Start invisible
        scale: 0.9   // Start slightly smaller
      },
      {
        y: 0,        // End at normal position
        opacity: 1,  // End fully visible
        scale: 1,    // End at normal size
        duration: 1.2,
        ease: "power3.out", // Smooth deceleration
        delay: 0.2, // Small delay so it doesn't happen instantly
      }
    );
  }, []);

  // --- 2. INTERACTIVE 3D TILT (Your existing code) ---
  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!card || !imageRef.current || !textRef.current) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;

      // A. Tilt Card
      gsap.to(card, {
        duration: 0.5,
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
      });

      // B. Parallax Image
      gsap.to(imageRef.current, {
        duration: 0.5,
        x: -rotateY * 1.5, 
        y: -rotateX * 1.5,
        scale: 1.15, 
        ease: "power2.out",
      });

      // C. Parallax Text
      gsap.to(textRef.current, {
        duration: 0.5,
        x: rotateY * 2,
        y: rotateX * 2,
        ease: "power2.out",
      });
      
      // D. Shine Overlay
      gsap.to(overlayRef.current, {
        duration: 0.5,
        opacity: 0.4 + (Math.abs(rotateX) + Math.abs(rotateY)) / 40, 
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      if (!card || !imageRef.current || !textRef.current) return;

      // Elastic Reset
      gsap.to([card, textRef.current], {
        duration: 0.8,
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.5)", 
      });

      gsap.to(imageRef.current, {
        duration: 0.8,
        x: 0,
        y: 0,
        scale: 1.0, 
        ease: "power2.out",
      });
      
      gsap.to(overlayRef.current, {
        duration: 0.8,
        opacity: 0,
        ease: "power2.out"
      });
    };

    card?.addEventListener("mousemove", handleMouseMove);
    card?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card?.removeEventListener("mousemove", handleMouseMove);
      card?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    // Added 'ref={containerRef}' here to animate the entrance
    <div 
      ref={containerRef} 
      className="flex justify-center items-center w-full perspective-1000 opacity-0" // Start with opacity-0 to prevent flash
    >
      <Link 
        to={`/shop/${link}`} 
        className="block w-full max-w-[320px] h-[420px] relative cursor-pointer group"
      >
        <div 
          ref={cardRef}
          className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative bg-black transform-style-3d will-change-transform"
        >
          {/* IMAGE LAYER */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              ref={imageRef}
              src={`/assets/${image}`}
              alt={categoryTitle}
              className="w-full h-full object-cover scale-100 will-change-transform"
            />
          </div>

          {/* OVERLAY LAYERS */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
          <div ref={overlayRef} className="absolute inset-0 bg-white opacity-0 mix-blend-overlay pointer-events-none" />

          {/* TEXT LAYER */}
          <div 
            ref={textRef}
            className="absolute bottom-8 left-0 w-full text-center pointer-events-none z-10"
          >
            <h3 className="text-3xl font-black text-white uppercase tracking-[3px] drop-shadow-lg italic">
              {categoryTitle}
            </h3>
            <div className="w-12 h-1 bg-yellow-400 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;