import Image from "next/image";

function VAWelcome() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-[45%] bg-primary_light rounded-3xl pb-8 pt-4 px-10">
      <div className="flex items-center justify-center">
        <Image
          src={"/tcs-logo-no-text.webp"}
          alt="Logo"
          width={55}
          height={55}
        />
      </div>
      <p>
        Hi there! 👋 Welcome to TCS&apos;s Virtual Assistant. How can I assist
        you today? 😊
      </p>
    </div>
  );
}

export default VAWelcome;
