import ReduxProvider from "@/app/ui-components/common/ReduxProvider";

function layout({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}

export default layout;
