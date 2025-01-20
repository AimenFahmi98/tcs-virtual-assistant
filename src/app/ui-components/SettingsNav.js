import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

function SettingsNav({ children }) {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <Link
        className="ml-24 flex items-center justify-center gap-4 text-nowrap text-text_light hover:text-text"
        href={"/virtual-assistant"}
      >
        <BiArrowBack className="h-6 w-6" />
        <span>Virtual Assistant</span>
      </Link>
      <div className="mt-20 flex flex-col items-start justify-center gap-6">
        <h1 className="pl-2 text-2xl text-text">Settings</h1>
        <div className="flex w-full flex-col gap-1 px-2">{children}</div>
      </div>
    </div>
  );
}

export default SettingsNav;
