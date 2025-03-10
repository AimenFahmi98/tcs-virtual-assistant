import Sidebar from "@/app/ui-components/sidebar/Sidebar";
import SettingsNav from "../../../ui-components/sidebar/settings/SettingsNav";
import SettingsItem from "../../../ui-components/sidebar/settings/SettingsItem";
import SubSettingsItem from "@/app/ui-components/sidebar/settings/SubSettingsItem";
import { VscAccount } from "react-icons/vsc";
import { PiPaintBrush } from "react-icons/pi";

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
              title={"Appearance"}
              href={"/settings/appearance"}
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
