"use client";

import { useSelector } from "react-redux";
import ProfileMenu from "./ProfileMenu";

function Header({ className }) {
  const currentUser = useSelector((state) => state.users.currentUser);

  return (
    currentUser && (
      <div className="col-start-2 text-text">
        <div
          className={`flex items-center justify-end py-2 pr-4 ${className} `}
        >
          <ProfileMenu title={currentUser.email} />
        </div>
      </div>
    )
  );
}

export default Header;
