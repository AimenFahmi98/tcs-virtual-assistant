"use client";

import { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { BiUser } from "react-icons/bi";
import Spinner from "@/app/ui-components/common/Spinner";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addRole, deleteRole, fetchAllRoles } from "@/redux/roleSlice";
import { addNotification } from "@/redux/notificationSlice";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const dispatch = useDispatch();
  const { isFetchingRoles, roles, roleBeingDeleted } = useSelector(
    (state) => state.roles,
  );
  const { currentUser: user } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [dispatch]);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="m-auto min-h-full max-w-7xl px-8 py-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-text">Role Management</h1>
        </div>

        <div className="mb-2 flex items-center justify-between gap-8">
          {/* Search Bar */}
          <div className="flex-1 transform border-b-2 border-primary transition-all">
            <div className="flex items-center gap-3 px-4 py-3">
              <IoMdSearch className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background text-text placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => document.getElementById("addRoleForm").showModal()}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-accent_secondary px-6 py-3 text-sm text-background transition-all hover:opacity-80"
          >
            <GoPlus className="h-4 w-4" />
            Add New Role
          </button>
        </div>

        <div
          className="overflow-y-auto p-2"
          style={{ maxHeight: "calc(100vh - 240px)" }}
        >
          {isFetchingRoles ? (
            <Spinner />
          ) : (
            <div className="space-y-2">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className={`group transform rounded-lg border-2 border-primary bg-primary_light p-4 transition-all duration-200 hover:bg-primary ${
                    roleBeingDeleted === role.id && "opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-start gap-2">
                        <BiUser className="h-6 w-6 text-text" />
                        <h4 className="text-lg font-semibold text-text">
                          {role.name}
                        </h4>
                      </div>
                      <p className="mt-1 text-sm text-text_light">
                        {role.description}
                      </p>
                    </div>
                    <button
                      disabled={roleBeingDeleted === role.id}
                      onClick={() => dispatch(deleteRole(role.id))}
                      className="rounded-md bg-transparent p-2 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <FaRegTrashAlt className="h-5 w-5 text-red-500 transition-all hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Role Dialog */}
        <dialog
          id="addRoleForm"
          className="rounded-xl bg-background p-8 shadow-2xl backdrop:bg-gray-900/50"
          onClick={(e) => {
            const dialogDimensions = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < dialogDimensions.left ||
              e.clientX > dialogDimensions.right ||
              e.clientY < dialogDimensions.top ||
              e.clientY > dialogDimensions.bottom
            ) {
              e.currentTarget.close();
            }
          }}
        >
          <h3 className="mb-6 text-2xl font-semibold text-text">
            Add New Role
          </h3>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(
                addRole({ name: newRoleName, description: newRoleDescription }),
              );
              dispatch(
                addNotification({
                  userId: user.id,
                  title: "New Role",
                  content: `'${newRoleName}' has been added as a new role.`,
                }),
              );
              setNewRoleName("");
              setNewRoleDescription("");
              document.getElementById("addRoleForm").close();
            }}
          >
            <input
              type="text"
              placeholder="Role name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="focus:ring-secondary/20 w-full rounded-lg border border-gray-300 bg-background p-3.5 text-text transition-all focus:border-secondary focus:outline-none focus:ring-2"
            />
            <textarea
              placeholder="Role description (optional)"
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              className="focus:ring-secondary/20 h-32 w-full rounded-lg border border-gray-300 bg-background p-3.5 text-text transition-all focus:border-secondary focus:outline-none focus:ring-2"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => document.getElementById("addRoleForm").close()}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-text transition-all hover:opacity-80"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-accent_secondary px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-80 hover:shadow-lg"
              >
                Add Role
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </div>
  );
}
