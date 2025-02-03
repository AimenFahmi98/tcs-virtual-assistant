"use client";

import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import DropDownMenu from "./DropDownMenu";
import BtnSignOut from "./BtnSignOut";
import Link from "next/link";
import { LuSettings } from "react-icons/lu";
import { IoDocumentsOutline } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";
import { GrUserAdmin } from "react-icons/gr";
import { TbUserShield } from "react-icons/tb";
import { HiOutlineUser } from "react-icons/hi";

function ProfileMenu({ title }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminFetched, setIsAdminFetched] = useState(false);
  const [user, setUser] = useState(null);

  // Get the information about whether if the user is an Admin or not
  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("Error fetching user:", error);
          return;
        }

        setUser(user);

        // Check admin role
        const response = await fetch(`/api/users/${user.id}/roles`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const roles = await response.json();
        const isAdmin =
          Array.isArray(roles) && roles.some((role) => role?.name === "Admin");

        setIsAdmin(isAdmin);
      } catch (error) {
        console.error("Error checking admin role:", error);
      } finally {
        setIsAdminFetched(true);
      }
    }

    fetchUser();
  }, []);

  return (
    isAdminFetched && (
      <DropDownMenu
        trigger={
          <div
            className={`relative mx-auto flex items-center justify-center gap-2 rounded-full border-4 border-background px-5 py-2.5 text-sm text-background transition duration-300 hover:cursor-pointer hover:border-4 hover:border-primary_dark ${
              isAdmin ? "bg-yellow-300 text-yellow-900" : "bg-secondary"
            }`}
          >
            {isAdmin ? (
              <GrUserAdmin className="h-4 w-4" />
            ) : (
              <HiOutlineUser className="h-4 w-4" />
            )}
            <span>{title || user?.email || "User"}</span>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-start">
          <Link
            href={"/profile"}
            className={
              "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
            }
          >
            <CgProfile className="h-5 w-5" />
            <span className="text-nowrap text-sm">Profile</span>
          </Link>
          <Link
            href={"/settings/appearance"}
            className={
              "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
            }
          >
            <LuSettings className="h-5 w-5" />
            <span className="text-nowrap text-sm">Settings</span>
          </Link>
          <Link
            href={"/document-manager/document-management/my-documents"}
            className={
              "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 hover:bg-primary"
            }
          >
            <IoDocumentsOutline className="h-5 w-5" />
            <span className="text-nowrap text-sm">Documents</span>
          </Link>
          {isAdmin && (
            <Link
              href={"/admin-settings/roles"}
              className={
                "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-yellow-900 hover:bg-primary"
              }
            >
              <TbUserShield className="h-5 w-5" />
              <span className="text-nowrap text-sm">Admin Settings</span>
            </Link>
          )}
          <div className="my-1 h-[1px] w-[90%] rounded-full bg-primary_dark"></div>
          <BtnSignOut
            className={
              "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-text hover:bg-primary"
            }
          />
        </div>
      </DropDownMenu>
    )
  );
}

export default ProfileMenu;
