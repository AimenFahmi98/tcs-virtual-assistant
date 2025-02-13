"use client";

import { fetchCurrentUser } from "@/redux/userSlice";
import { formatTimeAgo } from "@/utils/common/common-utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const testUser = {
  profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  fullName: "John Anderson",
  email: "john.anderson@company.com",
  createdAt: "2023-01-15T08:30:00Z",
  roles: [
    {
      title: "Senior Software Engineer",
      description:
        "Leads development of core applications and mentors junior developers. Specializes in full-stack development with focus on scalable architecture.",
    },
    {
      title: "Technical Lead",
      description:
        "Oversees technical direction of projects and ensures best practices are followed.",
    },
    {
      title: "Scrum Master",
      description:
        "Facilitates agile ceremonies and removes impediments for the team.",
    },
  ],
};

function Page() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-2xl p-6 text-text">
      <div className="mb-8 flex items-center gap-6">
        <img
          src={testUser.profilePicture}
          alt="Profile"
          className="h-24 w-24 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{currentUser?.fullName}</h1>
          <p className="text-gray-600">{currentUser?.email}</p>
          <p className="text-sm text-gray-500">
            Joined {formatTimeAgo(currentUser?.created_at)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        <div className="max-h-96 space-y-4 overflow-y-auto pr-4">
          {currentUser?.roles.map((role, index) => (
            <div key={index} className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-semibold">{role.name}</h3>
              <p className="text-sm text-text_light">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
