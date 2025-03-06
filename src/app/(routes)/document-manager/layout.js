import SettingsItem from "@/app/ui-components/common/SettingsItem";
import SettingsNav from "@/app/ui-components/common/SettingsNav";
import Sidebar from "@/app/ui-components/common/Sidebar";
import SubSettingsItem from "@/app/ui-components/common/SubSettingsItem";
import { LuFiles } from "react-icons/lu";
import { HiOutlineDatabase } from "react-icons/hi";

function Layout({ children }) {
  return (
    <>
      <Sidebar className="row-span-full">
        <SettingsNav>
          <SettingsItem
            title={"Document Management"}
            icon={<LuFiles className="h-5 w-5" />}
          >
            <SubSettingsItem
              title={"My Documents"}
              href={
                "/document-manager/document-management/my-documents/all-documents"
              }
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
    </>
  );
}

export default Layout;
