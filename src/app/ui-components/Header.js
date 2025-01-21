import { BiSolidConversation } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { HiCog } from "react-icons/hi2";
import MenuLink from "./MenuLink";

/**
 * Header component that displays the main navigation menu of the application.
 * Contains links to the Virtual Assistant, Document Manager, and Settings pages.
 * Uses MenuLink components to render navigation items with icons.
 * Layout is structured using CSS Grid with three columns.
 * @component
 * @returns {JSX.Element} A header component with navigation menu items
 */
function Header() {
  return (
    <div className="col-start-2 text-text">
      <div className="grid h-full grid-cols-3 items-center justify-evenly">
        <div className="mr-24 flex items-center justify-center gap-3">
          <MenuLink
            href={"virtual-assistant"}
            title={"AI Assistant"}
            icon={<BiSolidConversation className="h-4 w-4" />}
          />
          <MenuLink
            href={"document-manager"}
            title={"Documents"}
            icon={<IoDocuments className="h-4 w-4" />}
          />
        </div>
        <div></div>
        <div className="flex h-full items-center justify-end pr-8">
          <MenuLink
            href={"settings/appearance"}
            title={"Settings"}
            icon={<HiCog className="h-6 w-6" />}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
