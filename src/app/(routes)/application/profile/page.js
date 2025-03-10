import { redirect } from "next/navigation";

const {
  default: PageYetToBeWorkedOn,
} = require("@/app/ui-components/common/PageUnderDevelopment.js.js");

function page() {
  redirect("/application/profile/account-info");
}

export default page;
