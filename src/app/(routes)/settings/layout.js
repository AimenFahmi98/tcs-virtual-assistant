import SettingsList from "@/app/ui-components/SettingsList";
import Sidebar from "@/app/ui-components/Sidebar";

function Layout({ children }) {
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <Sidebar>
        <SettingsList />
      </Sidebar>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
