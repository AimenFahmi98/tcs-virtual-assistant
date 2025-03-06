import Image from "next/image";
import React from "react";

const BtnAppAgent = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="ml-4 flex items-center gap-3 rounded-xl bg-primary_light px-3 py-1.5 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary"
      aria-label="Open AI Assistant"
    >
      <div className="relative flex h-[40px] w-[40px] items-center justify-center">
        <Image
          src="/ai-agent-04.jpg"
          alt="AI Assistant"
          fill
          className="rounded-full object-cover"
          priority
        />
      </div>
      <div className="pr-2 text-left">
        <p className="text-sm font-medium text-text">App Agent</p>
        <p className="text-xs text-text_light">I will do things for you</p>
      </div>
    </button>
  );
};

export default BtnAppAgent;
