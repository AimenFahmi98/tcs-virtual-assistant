"use client";

import { CgProfile } from "react-icons/cg";
import DropDownMenu from "./DropDownMenu";
import BtnSignOut from "./BtnSignOut";
import Link from "next/link";
import { LuSettings } from "react-icons/lu";
import { IoDocumentsOutline } from "react-icons/io5";
import { TbUserShield } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";
import useAdminStatus from "@/hooks/user-management/useAdminStatus";
import { useState } from "react";

const MenuLink = ({ href, icon: Icon, text, onLinkClicked }) => (
  <Link
    href={href}
    className="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
    onClick={onLinkClicked}
  >
    <Icon className="h-5 w-5" />
    <span className="text-nowrap text-sm">{text}</span>
  </Link>
);

const MenuTrigger = ({ isAdmin, title, userEmail }) => (
  <div className="relative mx-auto flex items-center justify-center gap-2 rounded-full bg-[url('/texture-08.jpg')] bg-cover bg-center px-5 py-[9px] text-sm text-black shadow-md transition-all duration-300 hover:cursor-pointer">
    {isAdmin ? (
      <FaUserShield className="h-4 w-4" />
    ) : (
      <FaUser className="h-4 w-4" />
    )}
    <span>{title || userEmail || "User"}</span>
  </div>
);

const MenuContent = ({ isAdmin, onLinkClicked }) => (
  <div className="flex flex-col items-center justify-start">
    <MenuLink
      href="/profile"
      icon={CgProfile}
      text="Profile"
      onLinkClicked={onLinkClicked}
    />
    <MenuLink
      href="/settings/appearance"
      icon={LuSettings}
      text="Settings"
      onLinkClicked={onLinkClicked}
    />
    <MenuLink
      href="/document-manager/document-management/my-documents"
      icon={IoDocumentsOutline}
      text="Documents"
      onLinkClicked={onLinkClicked}
    />
    {isAdmin && (
      <MenuLink
        href="/admin-settings/roles"
        icon={TbUserShield}
        text="Admin Settings"
        onLinkClicked={onLinkClicked}
      />
    )}
    <div className="my-1 h-[1px] w-[90%] rounded-full bg-primary_dark"></div>
    <BtnSignOut className="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-text hover:bg-primary" />
  </div>
);

function ProfileMenu({ title }) {
  const { isAdmin, isAdminFetched, user } = useAdminStatus();
  const [isOpen, setIsOpen] = useState(false);

  return (
    isAdminFetched && (
      <DropDownMenu
        trigger={
          <MenuTrigger
            isAdmin={isAdmin}
            title={title}
            userEmail={user?.email}
            isMenuOpen={isOpen}
          />
        }
      >
        <MenuContent isAdmin={isAdmin} onLinkClicked={() => setIsOpen(false)} />
      </DropDownMenu>
    )
  );
}

export default ProfileMenu;
