"use client";

import Sidebar from "@/app/ui-components/common/Sidebar";
import SettingsNav from "../../ui-components/common/SettingsNav";
import SettingsItem from "../../ui-components/common/SettingsItem";
import SubSettingsItem from "@/app/ui-components/common/SubSettingsItem";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";

function Layout({ children }) {
  const { notifications } = useSelector((state) => state.notifications);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <>
      <Sidebar className="row-span-full">
        <SettingsNav>
          <SettingsItem
            icon={<VscAccount className="h-5 w-5" />}
            title={"Account"}
          >
            <SubSettingsItem
              title={"Account Information"}
              href={"/profile/account-info"}
            />
            <SubSettingsItem
              title={"Notifications"}
              href={"/profile/notifications"}
              notificationCount={unreadNotifications.length}
            />
          </SettingsItem>
        </SettingsNav>
      </Sidebar>
      <main>{children}</main>
    </>
  );
}

export default Layout;
