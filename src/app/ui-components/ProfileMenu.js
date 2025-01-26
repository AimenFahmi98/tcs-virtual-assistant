import { CgProfile } from "react-icons/cg";
import DropDownMenu from "./DropDownMenu";
import BtnSignOut from "./BtnSignOut";
import Link from "next/link";
import { LuSettings } from "react-icons/lu";
import { HiMiniDocument } from "react-icons/hi2";
import { GrDocumentStore } from "react-icons/gr";
import { IoDocumentsOutline } from "react-icons/io5";

function ProfileMenu({ title }) {
  return (
    <DropDownMenu
      trigger={
        <div className="relative mx-auto flex items-center justify-center gap-2 rounded-full border-4 border-background bg-secondary px-4 py-2 text-sm text-background transition duration-300 hover:border-4 hover:border-primary_dark">
          <CgProfile className="h-5 w-5" />
          <span>{title}</span>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-start">
        <Link
          href={"/profile"}
          className={
            "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
          }
        >
          <CgProfile className="h-5 w-5" />
          <span className="text-nowrap text-sm">Profile</span>
        </Link>
        <Link
          href={"/settings/appearance"}
          className={
            "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
          }
        >
          <LuSettings className="h-5 w-5" />
          <span className="text-nowrap text-sm">Settings</span>
        </Link>
        <Link
          href={"/document-manager/document-management/my-documents"}
          className={
            "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
          }
        >
          <IoDocumentsOutline className="h-5 w-5" />
          <span className="text-nowrap text-sm">Documents</span>
        </Link>
        <div className="my-1 h-[1px] w-[90%] rounded-full bg-primary_dark"></div>
        <BtnSignOut
          className={
            "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-text hover:bg-primary"
          }
        />
      </div>
    </DropDownMenu>
  );
}

export default ProfileMenu;
