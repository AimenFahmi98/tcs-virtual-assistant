import { toggleIsAgentOpen } from "@/redux/uiSlice";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

const BtnAppAgent = () => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleIsAgentOpen())}
      className="ml-4 flex items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 px-2 py-[6px] shadow-md transition-shadow duration-300 hover:shadow-lg"
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
        <span className="block text-sm font-bold text-gray-50">App Agent</span>
        <span className="block text-xs text-gray-300">
          Your smart assistant
        </span>
      </div>
    </button>
  );
};

export default BtnAppAgent;
