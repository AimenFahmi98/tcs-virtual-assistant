import Sidebar from "@/app/ui-components/sidebar/Sidebar";
import SettingsNav from "../../../ui-components/sidebar/settings/SettingsNav";
import SettingsItem from "../../../ui-components/sidebar/settings/SettingsItem";
import SubSettingsItem from "@/app/ui-components/sidebar/settings/SubSettingsItem";
import { VscAccount } from "react-icons/vsc";
import { PiPaintBrush } from "react-icons/pi";
import { RiShieldUserLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";

function Layout({ children }) {
  return (
    <>
      <Sidebar className="row-span-full">
        <SettingsNav>
          <SettingsItem icon={<FaUsers className="h-5 w-5" />} title={"Users"}>
            <SubSettingsItem
              title={"Manage Users"}
              href={"/application/admin-settings/users"}
              icon={<PiPaintBrush />}
            />
          </SettingsItem>
          <SettingsItem
            icon={<RiShieldUserLine className="h-5 w-5" />}
            title={"Roles"}
          >
            <SubSettingsItem
              title={"Manage Roles"}
              href={"/application/admin-settings/roles"}
            />
            <SubSettingsItem
              title={"Manage User Roles"}
              href={"/application/admin-settings/user-roles"}
            />
            <SubSettingsItem
              title={"Manage Document Roles"}
              href={"/application/admin-settings/document-roles"}
            />
          </SettingsItem>
        </SettingsNav>
      </Sidebar>
      <main>{children}</main>
    </>
  );
}

export default Layout;
