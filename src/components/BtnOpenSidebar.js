import { BsLayoutSidebarInset } from "react-icons/bs";

function BtnOpenSidebar({ setIsOpen, hoverBgColor }) {
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
