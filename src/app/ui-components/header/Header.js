import ProfileMenu from "./profile/ProfileMenu";
import BtnAppAgent from "./app-agent/BtnAppAgent";
import BtnNotifications from "../common/BtnNotifications";
import { redirect } from "next/navigation";
import BtnThemeSwitcher from "../common/btnThemeSwitcher";

function Header({ className }) {
  return (
    <div className="col-start-2 text-text">
      <div
        className={`flex items-center justify-between py-2 pr-4 ${className} `}
      >
        <BtnAppAgent />
        <div className="flex items-center gap-2">
          <BtnNotifications
            onClick={() => redirect("/application/profile/notifications")}
          />
          <BtnThemeSwitcher />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}

export default Header;
