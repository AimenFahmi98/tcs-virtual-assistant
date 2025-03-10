"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotification,
  fetchNotifications,
  markNotificationAsReadInDB,
  markNotificationAsUnreadInDB,
} from "@/redux/notificationSlice";
import Ping from "@/app/ui-components/common/Ping";
import Spinner from "@/app/ui-components/common/Spinner";
import { BsTrash3 } from "react-icons/bs";

const DeleteButton = ({ onClick }) => (
  <button
    className="flex items-center justify-center rounded-xl bg-red-500 p-2 text-red-50 hover:bg-red-400"
    onClick={onClick}
  >
    <span className="text-sm font-semibold">
      <BsTrash3 className="h-[15px] w-[15px] stroke-[0.3px]" />
    </span>
  </button>
);

const ActionButtons = ({
  notification,
  userId,
  dispatch,
  notificationBeingUpdated,
}) => {
  const handleDelete = () => {
    dispatch(deleteNotification({ userId, notificationId: notification.id }));
  };

  const handleMarkAsRead = () => {
    dispatch(
      markNotificationAsReadInDB({ userId, notificationId: notification.id }),
    );
  };

  const handleMarkAsUnread = () => {
    dispatch(
      markNotificationAsUnreadInDB({ userId, notificationId: notification.id }),
    );
  };

  if (!notification.isRead) {
    return (
      <div className="flex items-center space-x-2">
        <Ping isPing={true}>
          <button
            className={`relative inline-flex items-center rounded-full bg-primary_darker px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-primary_dark ${notification.id === notificationBeingUpdated ? "opacity-30" : ""}`}
            disabled={notification.id === notificationBeingUpdated}
            onClick={handleMarkAsRead}
          >
            Mark as Read
          </button>
        </Ping>
        <DeleteButton onClick={handleDelete} />
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-2">
        <button
          className={`relative inline-flex items-center rounded-full bg-primary_darker px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-primary_dark ${notification.id === notificationBeingUpdated ? "opacity-30" : ""}`}
          disabled={notification.id === notificationBeingUpdated}
          onClick={handleMarkAsUnread}
        >
          Mark as Unread
        </button>
        <DeleteButton onClick={handleDelete} />
      </div>
    );
  }
};

function NotificationItem({
  notification,
  userId,
  dispatch,
  notificationBeingDeleted,
  notificationBeingUpdated,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      key={notification.id}
      className={`relative my-2 rounded-3xl bg-primary px-6 py-4 transition-colors duration-150 ${
        notificationBeingDeleted === notification.id ? "opacity-30" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-text">{notification.title}</p>
          <p className="truncate text-sm text-text_light">
            {notification.content}
          </p>
        </div>
        <div className="flex-shrink-0">
          <ActionButtons
            notification={notification}
            userId={userId}
            dispatch={dispatch}
            notificationBeingUpdated={notificationBeingUpdated}
          />
        </div>
      </div>
    </li>
  );
}

const EmptyNotifications = () => (
  <div className="rounded-md bg-primary p-4">
    <div className="flex">
      <div className="ml-3">
        <h3 className="text-md font-medium text-text">No notifications yet!</h3>
        <div className="mt-2 text-sm text-text_light">
          <p>We&apos;ll let you know when something important comes up.</p>
        </div>
      </div>
    </div>
  </div>
);

const NotificationList = ({
  notifications,
  userId,
  dispatch,
  notificationBeingDeleted,
  notificationBeingUpdated,
}) => (
  <ul className="rounded-md text-text shadow-sm">
    {notifications.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        userId={userId}
        dispatch={dispatch}
        notificationBeingDeleted={notificationBeingDeleted}
        notificationBeingUpdated={notificationBeingUpdated}
      />
    ))}
  </ul>
);

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const {
    notifications,
    isFetchingNotifications,
    error,
    notificationBeingDeleted,
    notificationBeingUpdated,
  } = useSelector((state) => state.notifications);
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
    return (
      <div className="flex h-full w-full items-center justify-center text-text">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-40 py-20 text-text">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Notifications</h1>
      </div>
      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <NotificationList
          notifications={notifications}
          userId={userId}
          dispatch={dispatch}
          notificationBeingDeleted={notificationBeingDeleted}
          notificationBeingUpdated={notificationBeingUpdated}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
