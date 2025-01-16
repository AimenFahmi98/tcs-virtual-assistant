import DocumentManagerHeader from "@/components/DocumentManagerHeader";
import SettingsItem from "@/components/SettingsItem";
import SettingsNav from "@/components/SettingsNav";
import Sidebar from "@/components/Sidebar";
import SubSettingsItem from "@/components/SubSettingsItem";
import { LuFiles } from "react-icons/lu";
import { HiOutlineDatabase } from "react-icons/hi";

function Layout({ children }) {
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <Sidebar>
        <SettingsNav>
          <SettingsItem
            title={"Document Management"}
            icon={<LuFiles className="h-5 w-5" />}
          >
            <SubSettingsItem
              title={"My Documents"}
              href={"/document-manager/document-management/all-documents"}
            />
            <SubSettingsItem
              title={"Manage Roles"}
              href={"/document-manager/document-management/manage-role"}
            />
          </SettingsItem>
          <SettingsItem
            title={"Storage"}
            icon={<HiOutlineDatabase className="h-5 w-5" />}
          >
            <SubSettingsItem
              title={"Overview"}
              href={"/document-manager/storage/overview"}
            />
          </SettingsItem>
        </SettingsNav>
      </Sidebar>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
