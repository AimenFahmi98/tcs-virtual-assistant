"use client";

import { CgProfile } from "react-icons/cg";
import DropDownMenu from "./DropDownMenu";
import BtnSignOut from "./BtnSignOut";
import Link from "next/link";
import { LuSettings } from "react-icons/lu";
import { IoDocumentsOutline } from "react-icons/io5";
import { TbUserShield } from "react-icons/tb";
import useAdminStatus from "@/hooks/user-management/useAdminStatus";
import { useState } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import Image from "next/image";

function MenuLink({ href, icon: Icon, text, onLinkClicked }) {
  return (
    <Link
      href={href}
      className="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
      onClick={onLinkClicked}
    >
      <Icon className="h-5 w-5" />
      <span className="text-nowrap text-sm">{text}</span>
    </Link>
  );
}
function MenuTrigger({ isAdmin, title, userEmail }) {
  const { currentUser, isLoading } = useSelector((state) => state.users);

  return isLoading ? (
    <div className="relative flex items-center justify-center gap-3 rounded-xl bg-primary p-1.5 pr-3 text-sm shadow-md transition-all duration-300">
      <div className="max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] animate-pulse rounded-full bg-primary_darker" />
      <div className="flex flex-col items-start justify-center gap-2">
        <div className="h-4 w-[100px] animate-pulse rounded-full bg-primary_darker" />
        <div className="h-3 w-[200px] animate-pulse rounded-full bg-primary_darker" />
      </div>
    </div>
  ) : (
    currentUser && (
      <div className="relative flex items-center justify-center gap-3 rounded-xl bg-primary p-1.5 pr-3 text-sm shadow-md transition-all duration-300 hover:cursor-pointer hover:bg-primary_light">
        <Image
          src={
            currentUser.profile_picture ||
            "https://api.dicebear.com/7.x/avataaars/svg"
          }
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col items-start justify-center">
          <span className="max-w-[250px] truncate font-semibold text-text">
            {currentUser?.fullName || "Unknown User"}
          </span>
          <span className="max-w-[250px] truncate text-xs text-text_light">
            {userEmail || "No e-mail provided"}
          </span>
        </div>
      </div>
    )
  );
}

const MenuContent = ({ isAdmin, onLinkClicked }) => (
  <div className="flex flex-col items-center justify-start">
    <MenuLink
      href="/profile/account-info"
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
    <Provider store={store}>
      {isAdminFetched && (
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
          <MenuContent
            isAdmin={isAdmin}
            onLinkClicked={() => setIsOpen(false)}
          />
        </DropDownMenu>
      )}
    </Provider>
  );
}

export default ProfileMenu;
