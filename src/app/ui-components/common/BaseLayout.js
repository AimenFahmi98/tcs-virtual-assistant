"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTheme, toggleIsAgentOpen } from "@/redux/uiSlice";
import { fetchCurrentUser } from "@/redux/userSlice";
import {
  fetchDocumentsAvailableToCurrentUser,
  fetchRagDocumentsAvailableToCurrentUser,
} from "@/redux/documentSlice";
import Header from "./Header";
import Modal from "./Modal";
import AppAgent from "../ai-agent/AppAgent";
import { loadAppAgentConversation, setRedirectPage } from "@/redux/agentSlice";
import { useRouter } from "next/navigation";
import { fetchNotifications } from "@/redux/notificationSlice";

function BaseLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { currentUser } = useSelector((state) => state.users);
  const { currentRedirectPage } = useSelector((state) => state.agent);
  const { isAgentOpen } = useSelector((state) => state.ui);

  useEffect(() => {
    const redirectPage = currentRedirectPage;
    if (currentRedirectPage !== "") {
      console.log("Redirecting to", redirectPage);
      dispatch(toggleIsAgentOpen());
      dispatch(setRedirectPage(""));
      router.push(`/${redirectPage}`);
    }
  }, [currentRedirectPage, router, dispatch]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchTheme(currentUser.id));
      dispatch(fetchNotifications(currentUser.id));
      dispatch(loadAppAgentConversation(currentUser.id));
      dispatch(fetchDocumentsAvailableToCurrentUser(currentUser.id));
      dispatch(fetchRagDocumentsAvailableToCurrentUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  return (
    <div
      data-theme={theme || "light"}
      className="grid h-screen max-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr] overflow-y-hidden"
    >
      <Header />
      <Modal
        isOpen={isAgentOpen}
        onClose={() => dispatch(toggleIsAgentOpen())}
        className={"h-[80%] w-[95%] max-w-xl xs:w-[95%]"}
      >
        <AppAgent />
      </Modal>
      {children}
    </div>
  );
}

export default BaseLayout;
