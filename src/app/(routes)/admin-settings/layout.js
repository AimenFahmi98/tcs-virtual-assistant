import Sidebar from "@/app/ui-components/Sidebar";
import SettingsNav from "../../ui-components/SettingsNav";
import SettingsItem from "../../ui-components/SettingsItem";
import SubSettingsItem from "@/app/ui-components/SubSettingsItem";
import { VscAccount } from "react-icons/vsc";
import { PiPaintBrush } from "react-icons/pi";
import { RiShieldUserLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import Header from "@/app/ui-components/Header";

function Layout({ children }) {
  return (
    <>
      <Header />
      <Sidebar className="row-span-full">
        <SettingsNav>
          <SettingsItem icon={<FaUsers className="h-5 w-5" />} title={"Users"}>
            <SubSettingsItem
              title={"Manage Users"}
              href={"/admin-settings/users"}
              icon={<PiPaintBrush />}
            />
          </SettingsItem>
          <SettingsItem
            icon={<RiShieldUserLine className="h-5 w-5" />}
            title={"Roles"}
          >
            <SubSettingsItem
              title={"Manage Roles"}
              href={"/admin-settings/roles"}
            />
            <SubSettingsItem
              title={"Manage User Roles"}
              href={"/admin-settings/user-roles"}
            />
            <SubSettingsItem
              title={"Manage Document Roles"}
              href={"/admin-settings/document-roles"}
            />
          </SettingsItem>
        </SettingsNav>
      </Sidebar>
      <main>{children}</main>
    </>
  );
}

export default Layout;
