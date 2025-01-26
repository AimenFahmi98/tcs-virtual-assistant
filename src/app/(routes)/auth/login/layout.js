import Image from "next/image";
import MarketingCarousel from "../_components/MarketingCarousel";

function layout({ children }) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[45%]">{children}</div>
      <div className="relative -z-50 h-screen w-[55%]">
        <MarketingCarousel />
      </div>
    </div>
  );
}

export default layout;
