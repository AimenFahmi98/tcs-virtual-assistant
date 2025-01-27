import MarketingCarousel from "./_components/MarketingCarousel";

function layout({ children }) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[40%]">{children}</div>
      <div className="relative -z-50 h-screen w-[60%]">
        <MarketingCarousel />
      </div>
    </div>
  );
}

export default layout;
