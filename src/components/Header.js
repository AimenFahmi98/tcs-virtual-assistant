import Link from "next/link";
import { BiSolidConversation } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { HiCog } from "react-icons/hi2";

function Header() {
  return (
    <div className="col-start-2 text-text">
      <div className="grid h-full grid-cols-3 items-center justify-evenly">
        <div className="mr-24 flex items-center justify-center gap-3">
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

function MenuLink({ title, icon, href }) {
  return (
    <Link
      href={href}
      className="text-md flex items-center justify-center gap-2 rounded-full border border-primary_darker px-4 py-2 hover:bg-primary_light"
    >
      {icon}
      <span className="max-w-24 truncate">{title}</span>
    </Link>
  );
}

export default Header;
