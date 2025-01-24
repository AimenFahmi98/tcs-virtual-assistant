"use client";

import { BiSolidConversation } from "react-icons/bi";
import { IoDocuments } from "react-icons/io5";
import { HiCog } from "react-icons/hi2";
import MenuLink from "./MenuLink";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CgProfile } from "react-icons/cg";
import { PiSignOut } from "react-icons/pi";
import { jsx } from "react/jsx-runtime";

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
  const supabase = createClient();

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

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw new Error("Sign out error:", error);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <div className="col-start-2 text-text">
      <div className="grid h-full grid-cols-3 items-center justify-evenly">
        <div className="mr-24 flex items-center justify-center gap-3">
          <MenuLink
            href={"virtual-assistant"}
            title={"AI Assistant"}
            icon={<BiSolidConversation className="h-4 w-4" />}
          />
          <MenuLink
            href={"document-manager"}
            title={"Documents"}
            icon={<IoDocuments className="h-4 w-4" />}
          />
        </div>
        <div></div>
        <div className="flex h-full items-center justify-end gap-4 pr-9">
          <MenuLink
            href={"settings/appearance"}
            title={"Settings"}
            icon={<HiCog className="h-5 w-5" />}
          />
          {isAuthenticated && (
            <div className="flex items-center justify-center gap-4">
              <MenuLink
                href="/virtual-assistant"
                title={email}
                icon={<CgProfile className="h-5 w-5" />}
                className={
                  "bg-accent_secondary text-background hover:border hover:border-accent_secondary hover:bg-background hover:text-accent_secondary"
                }
              />
              <form onSubmit={handleSignOut}>
                <button
                  className="flex items-center justify-center gap-2 rounded-full border border-primary_darker px-4 py-2 hover:bg-primary_light"
                  type="submit"
                >
                  <PiSignOut className="h-5 w-5" />
                  <span className="text-nowrap text-sm">Sign Out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
