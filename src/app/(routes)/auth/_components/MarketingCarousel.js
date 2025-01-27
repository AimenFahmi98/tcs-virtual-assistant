import Image from "next/image";

function MarketingCarousel() {
  return (
    <div className="relative h-full w-full">
      <Image
        src={"/app-func-02.png"}
        fill
        className="object-cover"
        alt="background image"
      />

      <div className="absolute left-[51%] top-36 -translate-x-1/2 -translate-y-1/2 transform bg-transparent">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-nowrap text-4xl text-black">
            Document Management
          </h1>
          <span className="min-w-[700px] text-center">
            Effortlessly upload and organize documents to empower the TCS
            Assistant with comprehensive insights into your business
            operations.s
          </span>
        </div>
      </div>
    </div>
  );
}

export default MarketingCarousel;
