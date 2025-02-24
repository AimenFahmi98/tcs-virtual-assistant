"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme } from "@/redux/uiSlice";
import Spinner from "./Spinner";
import { fetchCurrentUser } from "@/redux/userSlice";
import { fetchDocumentsAvailableToCurrentUser } from "@/redux/documentSlice";

function BaseLayout({ children }) {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { currentUser } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchTheme(currentUser.id));
      dispatch(fetchDocumentsAvailableToCurrentUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  return (
    <div
      data-theme={theme || "light"}
      className="grid h-screen max-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr] overflow-y-hidden"
    >
      {children}
    </div>
  );
}

export default BaseLayout;
