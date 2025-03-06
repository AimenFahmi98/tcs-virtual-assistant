"use client";

import { useDispatch, useSelector } from "react-redux";
import ProfileMenu from "./ProfileMenu";
import BtnAppAgent from "../ai-agent/BtnAppAgent";
import { toggleIsAgentOpen } from "@/redux/uiSlice";

function Header({ className }) {
  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();

  return (
    currentUser && (
      <div className="col-start-2 text-text">
        <div
          className={`flex items-center justify-between py-2 pr-4 ${className} `}
        >
          <BtnAppAgent onClick={() => dispatch(toggleIsAgentOpen())} />
          <ProfileMenu title={currentUser.email} />
        </div>
      </div>
    )
  );
}

export default Header;
