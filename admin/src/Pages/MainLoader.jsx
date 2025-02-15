import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import rollingPin from "../../Image/rolling-pin.png";
import whisk from "../../Image/whisk.png";
import cupcake from "../../Image/cupcake.png";
import bakingTray from "../../Image/cookies.png";

const MainLoader = () => {
  const loaderRef = useRef(null);
  const rollingPinRef = useRef(null);
  const whiskRef = useRef(null);
  const cupcakeRef = useRef(null);
  const bakingTrayRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to([rollingPinRef.current, whiskRef.current, cupcakeRef.current, bakingTrayRef.current], {
      rotation: 360,
      transformOrigin: "center",
      duration: 1,
      ease: "power2.inOut",
      stagger: 0.2,
    }).to(
      [rollingPinRef.current, whiskRef.current, cupcakeRef.current, bakingTrayRef.current],
      {
        scale: 1.2,
        yoyo: true,
        repeat: 1,
        duration: 0.5,
        ease: "power1.inOut",
        stagger: 0.2,
      }
    );

    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 2,
      ease: "power2.out",
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = "none";
        }
      },
    });

    return () => {
      gsap.killTweensOf([
        rollingPinRef.current,
        whiskRef.current,
        cupcakeRef.current,
        bakingTrayRef.current,
      ]);
      gsap.killTweensOf(loaderRef.current);
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="loader flex items-center justify-center h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-yellow-100"
    >
      <div className="relative w-28 h-28">
        <div
          ref={rollingPinRef}
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
        >
          <img src={rollingPin} alt="Rolling Pin" className="w-10 h-10" />
        </div>
        <div
          ref={whiskRef}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        >
          <img src={whisk} alt="Whisk" className="w-10 h-10" />
        </div>
        <div
          ref={cupcakeRef}
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
        >
          <img src={cupcake} alt="Cupcake" className="w-10 h-10" />
        </div>
        <div
          ref={bakingTrayRef}
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
        >
          <img src={bakingTray} alt="Baking Tray" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export default MainLoader;
