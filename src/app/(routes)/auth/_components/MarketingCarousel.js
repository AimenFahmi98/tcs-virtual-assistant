import Image from "next/image";

function MarketingCarousel() {
  return (
    <div className="relative h-full w-full">
      <Image
        src={"/computer-02.jpg"}
        fill
        className="object-cover"
        alt="background image"
      />

      <div className="absolute left-1/2 top-36 -translate-x-1/2 -translate-y-1/2 transform bg-white">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-nowrap text-3xl font-[500] text-text">
            Document Management
          </h1>
          <span className="text-nowrap">
            Upload documents to give the TCS assistant awarenes of your business
          </span>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 h-[39%] w-[69%] -translate-x-[48.5%] -translate-y-[53%] transform bg-white">
        <Image src={"/app-01.png"} fill alt="background image" />
      </div>
    </div>
  );
}

export default MarketingCarousel;
