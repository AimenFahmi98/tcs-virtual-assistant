"use client";

import Spinner from "@/app/ui-components/common/Spinner";
import { uploadProfilePicture } from "@/redux/userSlice";
import { formatTimeAgo } from "@/utils/common/common-utils";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

function Page() {
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state) => state.users);

  return (
    <div className="mx-auto max-w-2xl p-6 text-text">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-8 flex items-center gap-6 rounded-3xl p-6 shadow-md_custom">
            <label htmlFor="profileImage" className="relative cursor-pointer">
              <Image
                src={
                  currentUser?.profile_picture ||
                  "https://api.dicebear.com/7.x/avataaars/svg"
                }
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    dispatch(
                      uploadProfilePicture({
                        userId: currentUser.id,
                        file: file,
                      }),
                    );
                  }
                }}
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
            </label>
            <div>
              <h1 className="text-2xl font-bold">{currentUser?.fullName}</h1>
              <p className="text-text_light">{currentUser?.email}</p>
              <p className="text-sm text-text_light">
                Joined {formatTimeAgo(currentUser?.created_at)}
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl p-6 shadow-md_custom">
            <h2 className="text-xl font-semibold">Roles</h2>
            <div className="max-h-[500px] space-y-4 overflow-y-auto pr-4">
              {currentUser?.roles.map((role, index) => (
                <div key={index} className="rounded-lg bg-primary_light p-4">
                  <h3 className="text-lg font-semibold">{role.name}</h3>
                  <p className="text-xs text-text_light">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
