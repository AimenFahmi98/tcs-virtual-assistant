"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

function Page() {
  const { conversations } = useSelector((state) => state.chat);

  if (conversations.length > 0) {
    redirect(`/virtual-assistant/${conversations[0].id}`);
  }
}

export default Page;
