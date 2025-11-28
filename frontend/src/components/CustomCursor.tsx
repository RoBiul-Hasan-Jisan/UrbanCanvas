import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);   // The small dot
  const followerRef = useRef<HTMLDivElement>(null); // The big circle
  const textRef = useRef<HTMLSpanElement>(null);     // Text inside the cursor

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cursor = cursorRef.current;
      const follower = followerRef.current;
      const text = textRef.current;

      // Add null checks for TypeScript
      if (!cursor || !follower || !text) return;

      // --- 1. MOVEMENT SETUP ---
      // We need previous coordinates to calculate velocity
      let posX = 0, posY = 0;
      let mouseX = 0, mouseY = 0;

      // High-perf movement setters
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
      
      // Follower has lag
      const xToFollow = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3" });
      const yToFollow = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3" });

      // --- 2. VELOCITY SKEW LOOP (The Jelly Effect) ---
      // This runs on every animation frame to calculate speed
      gsap.ticker.add(() => {
        // Calculate the lag distance (velocity)
        const dt = 1.0 - Math.pow(1.0 - 0.1, gsap.ticker.deltaRatio());
        
        posX += (mouseX - posX) * dt;
        posY += (mouseY - posY) * dt;
        
        // Calculate velocity based on distance between mouse and follower
        const deltaX = mouseX - posX;
        const deltaY = mouseY - posY;
        const velocity = Math.sqrt(deltaX**2 + deltaY**2);
        
        // Calculate angle of movement
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        // Apply Skew (Stretch based on speed)
        // Cap the stretch at 1.5x so it doesn't look broken
        const scale = Math.min(1 + velocity * 0.005, 1.5);
        
        gsap.set(follower, {
          rotation: angle,
          scaleX: scale,
          scaleY: 1 / scale, // Maintain area (squash & stretch)
          overwrite: "auto"
        });
      });

      // --- 3. MOUSE LISTENERS ---
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        xTo(mouseX);
        yTo(mouseY);
        xToFollow(mouseX);
        yToFollow(mouseY);
      };

      const handleMouseDown = () => {
        gsap.to(follower, { scale: 0.8, duration: 0.1, ease: "power2.out" });
        gsap.to(cursor, { scale: 1.5, duration: 0.1 });
      };

      const handleMouseUp = () => {
        gsap.to(follower, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" });
        gsap.to(cursor, { scale: 1, duration: 0.1 });
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);

      // --- 4. SMART HOVER DETECTION (Event Delegation) ---
      // Instead of querying selectors, we check the target on mouseover.
      // This works even for content added dynamically later.
      const handleMouseOver = (e: Event) => {
        const target = e.target as HTMLElement;

        // Check if hovering a Link, Button, or specific class
        const isLink = target.closest("a") || target.closest("button") || target.closest(".cursor-pointer");
        const isImage = target.closest("img") || target.closest(".banner-container");

        if (isLink) {
          // LINK STATE: Big White Circle
          gsap.to(cursor, { scale: 0, duration: 0.2 });
          gsap.to(follower, { 
            width: 80, 
            height: 80, 
            backgroundColor: "#fff", 
            mixBlendMode: "difference", 
            duration: 0.3 
          });
          // Show Text
          text.innerText = "OPEN";
          gsap.to(text, { opacity: 1, scale: 1, duration: 0.3 });
        } 
        else if (isImage) {
           // IMAGE STATE: Glass Effect
           gsap.to(cursor, { scale: 0, duration: 0.2 });
           gsap.to(follower, { 
             width: 100, 
             height: 100, 
             backgroundColor: "rgba(255,255,255,0.1)", 
             backdropFilter: "blur(5px)", // Glassmorphism
             border: "1px solid rgba(255,255,255,0.5)",
             mixBlendMode: "normal", 
             duration: 0.3 
           });
           text.innerText = "VIEW";
           gsap.to(text, { opacity: 1, scale: 1, duration: 0.3 });
        }
        else {
          // DEFAULT STATE: Reset
          gsap.to(cursor, { scale: 1, duration: 0.2 });
          gsap.to(follower, { 
            width: 32, 
            height: 32, 
            backgroundColor: "transparent", 
            border: "1px solid #FACC15", // Yellow-400
            mixBlendMode: "normal",
            backdropFilter: "none",
            duration: 0.3 
          });
          gsap.to(text, { opacity: 0, scale: 0, duration: 0.2 });
        }
      };

      document.addEventListener("mouseover", handleMouseOver);

      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
         window.removeEventListener("mousedown", handleMouseDown);
         window.removeEventListener("mouseup", handleMouseUp);
         document.removeEventListener("mouseover", handleMouseOver);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* 1. Main Pointer (Small Dot) */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-3 h-3 bg-yellow-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
      />
      
      {/* 2. Physics Follower (The Jelly Ring) */}
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 items-center justify-center hidden md:flex border border-yellow-400 will-change-transform"
      >
         {/* Context Text (View / Open) */}
         <span ref={textRef} className="text-[10px] font-black text-black opacity-0 uppercase tracking-widest">
            VIEW
         </span>
      </div>
    </>
  );
};

export default CustomCursor;