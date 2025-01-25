"use client";

import { BiSolidConversation } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { HiCog } from "react-icons/hi2";
import MenuLink from "./MenuLink";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CgProfile } from "react-icons/cg";
import BtnSignOut from "./BtnSignOut";
import DropDownMenu from "./DropDownMenu";
import ProfileMenu from "./ProfileMenu";

/**
 * Header component that displays the main navigation menu of the application.
 * Contains links to the Virtual Assistant, Document Manager, and Settings pages.
 * Uses MenuLink components to render navigation items with icons.
 * Layout is structured using CSS Grid with three columns.
 * @component
 * @returns {JSX.Element} A header component with navigation menu items
 */
function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchSession() {
      const supabase = createClient();
      const response = await supabase.auth.getUser();

      if (!response.error) {
        setEmail(response.data.user.email);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
    fetchSession();
  }, []);
  return (
    <div className="col-start-2 text-text">
      <div className="flex items-center justify-end py-1 pr-4">
        <ProfileMenu email={email} />
      </div>
    </div>
  );
}

export default Header;
