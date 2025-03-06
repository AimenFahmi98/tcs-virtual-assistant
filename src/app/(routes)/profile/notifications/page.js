"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@/redux/notificationSlice";
import Ping from "@/app/ui-components/common/Ping";
import Spinner from "@/app/ui-components/common/Spinner";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, isFetchingNotifications, error } = useSelector(
    (state) => state.notifications,
  );
  const { currentUser } = useSelector((state) => state.users);
  const userId = currentUser?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications(userId));
    }
  }, [dispatch, userId]);

  if (isFetchingNotifications) {
    return (
      <div className="flex h-full w-full items-center justify-center text-text">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-text">Error: {error}</div>;
  }

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  return (
    <div className="container mx-auto px-40 py-20 text-text">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 005.412-1.321m-5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </div>
      {notifications.length === 0 ? (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                No notifications yet!
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  We&apos;ll let you know when something important comes up.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ul className="rounded-md text-text shadow-sm">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="my-2 rounded-3xl bg-primary px-6 py-4 transition-colors duration-150 hover:bg-primary_light"
            >
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text">
                    {notification.title}
                  </p>
                  <p className="truncate text-sm text-text_light">
                    {notification.content}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {!notification.isRead ? (
                    <Ping isPing={true}>
                      <button
                        className="relative inline-flex items-center rounded-full bg-primary_darker px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-primary_light"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as Read
                      </button>
                    </Ping>
                  ) : (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Read
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
