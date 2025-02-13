import { redirect } from "next/navigation";

const {
  default: PageYetToBeWorkedOn,
} = require("@/app/ui-components/PageUnderDevelopment.js");

function page() {
  redirect("/profile/account-info");
}

export default page;
