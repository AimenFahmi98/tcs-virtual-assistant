import Sidebar from "@/app/ui-components/Sidebar";
import SettingsNav from "../../ui-components/SettingsNav";
import SettingsItem from "../../ui-components/SettingsItem";
import SubSettingsItem from "@/app/ui-components/SubSettingsItem";
import { VscAccount } from "react-icons/vsc";
import { PiPaintBrush } from "react-icons/pi";
import Header from "@/app/ui-components/Header";

function Layout({ children }) {
  return (
    <>
      <Header />
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
