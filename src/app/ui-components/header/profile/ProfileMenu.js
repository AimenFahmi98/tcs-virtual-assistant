"use client";

import { CgProfile } from "react-icons/cg";
import DropDownMenu from "../../common/DropDownMenu";
import BtnSignOut from "../../common/BtnSignOut";
import Link from "next/link";
import { LuSettings } from "react-icons/lu";
import { IoDocumentsOutline, IoNotificationsOutline } from "react-icons/io5";
import { TbUserShield } from "react-icons/tb";
import useAdminStatus from "@/hooks/user-management/useAdminStatus";
import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { MdAdminPanelSettings } from "react-icons/md";
import Ping from "../../common/Ping";
import { FaRegUser } from "react-icons/fa6";

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
  const { notifications } = useSelector((state) => state.notifications);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return isLoading ? (
    <div className="relative flex items-center justify-center gap-3 rounded-xl bg-primary px-3 py-1.5 pr-3 text-sm transition-all duration-300">
      <div className="max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] animate-pulse rounded-full bg-primary_darker" />
      <div className="flex flex-col items-start justify-center gap-2">
        <div className="h-4 w-[100px] animate-pulse rounded-full bg-primary_darker" />
        <div className="h-3 w-[200px] animate-pulse rounded-full bg-primary_darker" />
      </div>
    </div>
  ) : (
    currentUser && (
      <div
        className={`relative flex items-center justify-center gap-3 rounded-xl bg-primary px-3 py-1.5 pr-4 text-sm transition-all duration-300 hover:cursor-pointer hover:from-primary hover:to-primary`}
      >
        {currentUser.profile_picture ? (
          <Image
            src={
              currentUser.profile_picture ||
              // "https://api.dicebear.com/7.x/avataaars/svg"
              "empty-pp.png"
            }
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-primary_dark">
            <FaRegUser className="h-5 w-5 text-text" />
          </div>
        )}

        {/* {unreadNotifications.length > 0 && (
          <div className="absolute -right-1 -top-0.5">
            <div className="relative">
              <IoNotificationsOutline className="h-5 w-5 text-text" />
              <div className="absolute -right-1 -top-1 flex h-[12px] w-[12px] items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-red-50">
                <span>{unreadNotifications.length}</span>
              </div>
            </div>
          </div>
        )} */}

        <div className="flex flex-col items-start justify-center">
          <div className="flex items-start justify-start gap-1.5">
            <span className="max-w-[250px] truncate font-semibold text-text">
              {currentUser?.fullName || "Unknown User"}
            </span>
            {/* {isAdmin && (
              <MdAdminPanelSettings className="h-4 w-4 text-yellow-400" />
            )} */}
          </div>
          <span className="max-w-[250px] truncate text-xs text-text_light">
            {userEmail || "No e-mail provided"}
          </span>
        </div>
      </div>
    )
  );
}

function MenuContent({ isAdmin, onLinkClicked }) {
  const { notifications } = useSelector((state) => state.notifications);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div className="flex flex-col items-center justify-start">
      <Link
        href="/application/profile/notifications"
        className="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
        onClick={onLinkClicked}
      >
        <Ping isPing={unreadNotifications.length > 0}>
          <IoNotificationsOutline className="h-5 w-5" />
        </Ping>
        <span className="text-nowrap text-sm">Notifications</span>
      </Link>
      <MenuLink
        href="/application/profile/account-info"
        icon={CgProfile}
        text="Profile"
        onLinkClicked={onLinkClicked}
      />
      <MenuLink
        href="/application/settings/appearance"
        icon={LuSettings}
        text="Settings"
        onLinkClicked={onLinkClicked}
      />
      <MenuLink
        href="/application/document-manager/document-management/my-documents"
        icon={IoDocumentsOutline}
        text="Documents"
        onLinkClicked={onLinkClicked}
      />
      {isAdmin && (
        <MenuLink
          href="/application/admin-settings/roles"
          icon={TbUserShield}
          text="Admin Settings"
          onLinkClicked={onLinkClicked}
        />
      )}
      <div className="my-1 h-[1px] w-[90%] rounded-full bg-primary_dark"></div>
      <BtnSignOut className="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-text hover:bg-primary" />
    </div>
  );
}

function ProfileMenu() {
  const { isAdmin, isAdminFetched, user } = useAdminStatus();
  const [isOpen, setIsOpen] = useState(false);

  return (
    isAdminFetched && (
      <DropDownMenu
        trigger={
          <MenuTrigger
            isAdmin={isAdmin}
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
