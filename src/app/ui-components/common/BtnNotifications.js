import { IoNotificationsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

function BtnNotifications({ onClick }) {
  const { notifications } = useSelector((state) => state.notifications);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <button
      className="rounded-xl bg-primary from-primary_light to-primary_dark p-3 transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative">
        <IoNotificationsOutline className="h-[24px] w-[24px] text-text" />

        {unreadNotifications.length > 0 && (
          <div className="absolute -right-[7px] -top-[7px] flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-red-50">
            <span>{unreadNotifications.length}</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default BtnNotifications;
