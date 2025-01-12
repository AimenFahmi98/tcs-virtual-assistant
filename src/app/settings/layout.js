import SettingsList from "@/components/SettingsList";
import Sidebar from "@/components/Sidebar";

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
