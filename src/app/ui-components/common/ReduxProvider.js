"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import BaseLayout from "./BaseLayout";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <BaseLayout>{children}</BaseLayout>
    </Provider>
  );
}
