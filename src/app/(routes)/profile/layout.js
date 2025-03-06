import Sidebar from "@/app/ui-components/common/Sidebar";
import SettingsNav from "../../ui-components/common/SettingsNav";
import SettingsItem from "../../ui-components/common/SettingsItem";
import SubSettingsItem from "@/app/ui-components/common/SubSettingsItem";
import { VscAccount } from "react-icons/vsc";
import { PiPaintBrush } from "react-icons/pi";
import Header from "@/app/ui-components/common/Header";

function Layout({ children }) {
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
              icon={<PiPaintBrush />}
            />
          </SettingsItem>
        </SettingsNav>
      </Sidebar>
      <main>{children}</main>
    </>
  );
}

export default Layout;
