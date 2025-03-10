import { BsLayoutSidebarInset } from "react-icons/bs";

/**
 * A button component that toggles the sidebar visibility
 * @param {Object} props - Component properties
 * @param {Function} props.setIsOpen - State setter function to toggle sidebar visibility
 * @returns {JSX.Element} A button element with a sidebar icon
 */
function BtnOpenSidebar({ setIsOpen }) {
  return (
    <button
      onClick={() => setIsOpen((isOpen) => !isOpen)}
      className={`absolute left-3 top-0.5 rounded-lg p-3 text-gray-500 hover:text-text`}
    >
      <BsLayoutSidebarInset className={`h-7 w-7`} />
    </button>
  );
}

export default BtnOpenSidebar;
