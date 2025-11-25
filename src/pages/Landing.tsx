import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis"; 
import { Banner, CategoriesSection, HomeCollectionSection } from "../components";
import CustomCursor from "../components/CustomCursor";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  //  Load loader state from sessionStorage
  const [animationDone, setAnimationDone] = useState(
    () => sessionStorage.getItem("urbancanvas_loader") === "done"
  );

  //  INTRO ANIMATION (only if first load)
  useLayoutEffect(() => {
    if (animationDone) return; // skip loader on navigation

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      document.body.style.overflow = "hidden"; // lock scroll

      tl.to(".intro-char", {
        y: "0%",
        opacity: 1,
        stagger: 0.05,
        duration: 1,
      })
      .to(".intro-shutter-top", {
        height: "0%",
        duration: 1.1,
        ease: "expo.inOut",
      }, "split")
      .to(".intro-shutter-bottom", {
        height: "0%",
        duration: 1.1,
        ease: "expo.inOut",
      }, "split")
      .from(".landing-content", {
        scale: 1.1,
        filter: "blur(10px)",
        duration: 1.4,
      }, "-=0.8")
      .add(() => {
        document.body.style.overflow = ""; // unlock scroll
        sessionStorage.setItem("urbancanvas_loader", "done"); // remember
        setAnimationDone(true);
      });

    }, mainRef);

    return () => ctx.revert();
  }, [animationDone]);

  //  GLOBAL SCROLL EFFECTS (always enable)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Banner Parallax
      gsap.to(".banner-wrapper-inner", {
        scale: 0.9,
        opacity: 0.5,
        borderRadius: "40px",
        scrollTrigger: {
          trigger: ".banner-container",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // BG Morph on scroll sections
      gsap.utils.toArray<HTMLElement>(".section-wrapper").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => gsap.to("body", { backgroundColor: section.dataset.bgcolor, duration: 0.7 }),
          onEnterBack: () => gsap.to("body", { backgroundColor: section.dataset.bgcolor, duration: 0.7 }),
        });
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  //  UI JSX
  return (
    <ReactLenis root>
      <div ref={mainRef} className="relative min-h-screen">

        <CustomCursor />

        {/* SPLIT SHUTTER PRELOADER (only first load) */}
        {!animationDone && (
          <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col">

            {/* TOP */}
            <section className="intro-shutter-top w-full h-1/2 bg-black border-b border-gray-800 flex items-end justify-center overflow-hidden">
              <div className="flex gap-[0.5vw] -mb-[2vw] select-none">
                {["U","R","B","A","N"].map((char, i) => (
                  <span key={i} className="intro-char text-white text-[9vw] sm:text-[10vw] font-black translate-y-full opacity-0 inline-block leading-none tracking-tight">
                    {char}
                  </span>
                ))}
              </div>
            </section>

            {/* BOTTOM */}
            <section className="intro-shutter-bottom w-full h-1/2 bg-black border-t border-gray-800 flex items-start justify-center overflow-hidden">
              <div className="flex gap-[0.5vw] mt-[2vw] select-none">
                {["C","A","N","V","A","S"].map((char, i) => (
                  <span key={i} className="intro-char text-white text-[9vw] sm:text-[10vw] font-black translate-y-full opacity-0 inline-block leading-none tracking-tight">
                    {char}
                  </span>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="landing-content origin-center will-change-transform">

          {/* Banner */}
          <div className="section-wrapper banner-container h-[100vh] w-full bg-black sticky top-0" data-bgcolor="#000000">
            <div className="banner-wrapper-inner w-full h-full overflow-hidden">
              <Banner />
            </div>
          </div>

          {/* Collection */}
          <div className="section-wrapper relative bg-white rounded-t-[3rem] -mt-[10vh] pt-10 shadow-2xl z-10" data-bgcolor="#ffffff">
            <HomeCollectionSection />
          </div>

          {/* Categories */}
          <div className="section-wrapper relative z-10" data-bgcolor="#f5f5f5">
            <CategoriesSection />
          </div>

        </div>

        {/* GLOBAL NOISE */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[9000] mix-blend-overlay">
          <svg viewBox="0 0 200 200">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)"/>
          </svg>
        </div>

      </div>
    </ReactLenis>
  );
};

export default Landing;
