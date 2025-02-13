import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminFetched, setIsAdminFetched] = useState(false);
  const [user, setUser] = useState(null);

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

        const response = await fetch(`/api/supabase/users/${user.id}/roles`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const roles = await response.json();
        setIsAdmin(
          Array.isArray(roles) && roles.some((role) => role?.name === "Admin"),
        );
      } catch (error) {
        console.error("Error checking admin role:", error);
      } finally {
        setIsAdminFetched(true);
      }
    }

    fetchUser();
  }, []);

  return { isAdmin, isAdminFetched, user };
}
