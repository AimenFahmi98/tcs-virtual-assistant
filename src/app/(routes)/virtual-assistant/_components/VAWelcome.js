import Image from "next/image";

/**
 * Renders a welcome component for the TCS Virtual Assistant interface.
 * This component displays a TCS logo and a welcome message in a styled container.
 *
 * @component
 * @return {JSX.Element} A styled welcome message container with the TCS logo
 */
function VAWelcome() {
  return (
    <div className="flex w-[90%] max-w-[600px] flex-col items-center justify-center gap-4 rounded-3xl bg-primary_light px-10 pb-8 pt-4">
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
