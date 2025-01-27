import Image from "next/image";

function MarketingCarousel() {
  return (
    <div className="relative h-full w-full">
      <Image
        src={"/app-02.png"}
        fill
        className="object-cover"
        alt="background image"
      />

      <div className="absolute left-1/2 top-20 -translate-x-1/2 -translate-y-1/2 transform bg-transparent">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-nowrap text-3xl font-[500] text-text">
            Document Management
          </h1>
          <span className="text-nowrap">
            Upload documents to give the TCS assistant awarenes of your business
          </span>
        </div>
      </div>
    </div>
  );
}

export default MarketingCarousel;
