import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

/**
 * A navigation component for the settings page that includes a back button and renders child components
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered in the settings navigation
 * @returns {JSX.Element} A settings navigation layout with a back button and content area
 */
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
