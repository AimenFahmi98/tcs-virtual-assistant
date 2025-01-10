import Image from "next/image";
import Link from "next/link";
import { BiSolidConversation } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { HiCog } from "react-icons/hi2";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { RiSettings5Fill } from "react-icons/ri";

function Header() {
  return (
    <div className="col-start-2">
      <div className="grid grid-cols-3 items-center justify-evenly h-full">
        <div className="flex items-center justify-center gap-3 mr-24">
          <MenuLink
            href={"ai-assistant"}
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
        {/* <div className="flex justify-center items-center gap-4">
          <Image
            src={"/tcs-logo-no-text.webp"}
            width={60}
            height={60}
            alt="Logo"
          />
        </div> */}
        <div className="flex items-center justify-end pr-8 h-full">
          {/* <MenuIconLink to={"/settings"}>
            <HiCog className="h-8 w-8" />
          </MenuIconLink> */}
          <MenuLink
            href={"settings"}
            title={"Settings"}
            icon={<HiCog className="h-6 w-6" />}
          />
        </div>
      </div>
    </div>
  );
}

function MenuLink({ title, icon, href }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-full border border-primary_darker px-4 py-2 text-md hover:bg-primary_light"
    >
      {icon}
      <span className="w-24 truncate">{title}</span>
    </Link>
  );
}

function MenuIconLink({ to, children }) {
  return (
    <Link
      href={to}
      className="flex items-center justify-center rounded-full text-md hover:bg-primary_light border border-primary_darker p-1"
    >
      {children}
    </Link>
  );
}

export default Header;
