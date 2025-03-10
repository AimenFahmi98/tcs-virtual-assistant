"use client";

import { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import Spinner from "@/app/ui-components/common/Spinner";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rolesSearchQuery, setRolesSearchQuery] = useState("");
  const [isLoadingUserRoles, setIsLoadingUserRoles] = useState(false);
  const [updatingRoleId, setUpdatingRoleId] = useState(-1);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/supabase/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async function fetchUserRoles(userId) {
    setIsLoadingUserRoles(true);
    try {
      const response = await fetch(`/api/supabase/users/${userId}/roles`);
      if (!response.ok) throw new Error("Failed to fetch user roles");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user roles:", error);
      return [];
    } finally {
      setIsLoadingUserRoles(false);
    }
  }

  async function fetchAvailableRoles() {
    try {
      const response = await fetch("/api/supabase/roles");
      if (!response.ok) throw new Error("Failed to fetch roles");
      return await response.json();
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [usersData, rolesData] = await Promise.all([
        fetchUsers(),
        fetchAvailableRoles(),
      ]);
      setUsers(usersData);
      setSelectedUserId(usersData[0].id);
      setRoles(rolesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const loadUserRoles = async () => {
        const roles = await fetchUserRoles(selectedUserId);
        setUserRoles(roles);
      };
      loadUserRoles();
    }
  }, [selectedUserId]);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddRole = async (roleId) => {
    if (!selectedUserId) return;
    setUpdatingRoleId(roleId);

    try {
      const response = await fetch(
        `/api/supabase/users/${selectedUserId}/roles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role_id: roleId }),
        },
      );

      if (response.ok) {
        const roles = await fetchUserRoles(selectedUserId);
        setUserRoles(roles);
      }
    } catch (error) {
      console.error("Error adding role:", error);
    } finally {
      setUpdatingRoleId(-1);
    }
  };

  const handleRemoveRole = async (roleId) => {
    if (!selectedUserId) return;
    setUpdatingRoleId(roleId);

    try {
      const response = await fetch(
        `/api/supabase/users/${selectedUserId}/roles`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role_id: roleId }),
        },
      );

      if (response.ok) {
        const roles = await fetchUserRoles(selectedUserId);
        setUserRoles(roles);
      }
    } catch (error) {
      console.error("Error removing role:", error);
    } finally {
      setUpdatingRoleId(-1);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-background to-primary_light text-text">
      <div className="flex min-h-full items-center justify-center px-16 py-2">
        <div className="flex gap-6">
          <div className="w-1/2 rounded-3xl bg-background p-6 shadow-md_custom">
            <div className="mb-4 transform border-b-2 border-primary">
              <h2 className="mb-4 px-4 text-xl font-semibold">Users</h2>
              <div className="flex items-center gap-3 px-4 py-3">
                <IoMdSearch className="h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background text-text placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {isLoading ? (
              <Spinner />
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`cursor-pointer rounded-lg p-4 transition-all ${
                      selectedUserId === user.id
                        ? "border-2 border-primary bg-primary_light"
                        : "hover:bg-primary"
                    }`}
                  >
                    <h4 className="font-semibold">{user.fullName}</h4>
                    <p className="text-sm text-text_light">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-1/2">
            {selectedUserId && (
              <div className="flex flex-col gap-4">
                <div className="rounded-3xl bg-background p-6 shadow-md_custom">
                  <h2 className="mb-4 text-xl font-semibold">Assigned Roles</h2>
                  <div className="max-h-40 min-h-40 space-y-2 overflow-y-auto">
                    {isLoadingUserRoles ? (
                      <div className="flex h-full items-center justify-center">
                        <Spinner />
                      </div>
                    ) : (
                      userRoles.map((role) => (
                        <button
                          onClick={() => handleRemoveRole(role.id)}
                          disabled={updatingRoleId === role.id}
                          key={role.id}
                          className="flex w-full items-center justify-between rounded-xl bg-primary_light p-3 hover:bg-primary"
                        >
                          <div>
                            <h4 className="text-sm font-medium">{role.name}</h4>
                          </div>
                          <div>
                            {updatingRoleId === role.id ? (
                              <Spinner size="24px" borderSize="3px" />
                            ) : (
                              <FiMinus className="h-6 w-6" />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-background p-6 shadow-md_custom">
                  <h2 className="mb-2 text-xl font-semibold">
                    Available Roles
                  </h2>
                  <div className="mb-4 transform border-b-2 border-primary">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <IoMdSearch className="h-6 w-6 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search roles..."
                        value={rolesSearchQuery}
                        onChange={(e) => setRolesSearchQuery(e.target.value)}
                        className="w-full bg-background text-text placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="max-h-[390px] min-h-[390px] space-y-2 overflow-y-auto">
                    {roles
                      .filter(
                        (role) => !userRoles.some((ur) => ur.id === role.id),
                      )
                      .filter((role) => {
                        const regex = new RegExp(rolesSearchQuery, "i");
                        return (
                          regex.test(role.name) || regex.test(role.description)
                        );
                      })
                      .map((role) => (
                        <button
                          onClick={() => handleAddRole(role.id)}
                          disabled={updatingRoleId === role.id}
                          key={role.id}
                          className={`flex w-full items-center justify-between gap-4 rounded-lg bg-primary_light p-4 hover:bg-primary ${updatingRoleId === role.id && "blur-sm"}`}
                        >
                          <div className="flex flex-col items-start gap-2">
                            <h4 className="text-md font-medium">{role.name}</h4>
                            <p className="text-left text-xs text-text_light">
                              {role.description}
                            </p>
                          </div>
                          <div className="p-2">
                            {updatingRoleId === role.id ? (
                              <Spinner size="24px" borderSize="2px" />
                            ) : (
                              <FiPlus className="h-6 w-6 text-text" />
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
