"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const textArray = [
  "Effortlessly upload and organize documents.",
  "Empower the TCS Assistant with insights into your internal business operations.",
  "Streamline your business operations with ease.",
];

function MarketingCarousel() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Image
        src={"/app-func-02.png"}
        fill
        className="object-cover"
        alt="background image"
      />

      <div className="absolute left-[51%] top-28 -translate-x-1/2 transform bg-transparent">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-nowrap text-4xl text-black">
            Document Management
          </h1>
          <div className="h-8 min-w-[700px] overflow-hidden text-center">
            <span
              key={currentTextIndex}
              className="animate-slide-up block text-text"
            >
              {textArray[currentTextIndex]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketingCarousel;
