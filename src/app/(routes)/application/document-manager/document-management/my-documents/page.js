import { redirect } from "next/navigation";

function page() {
  redirect(
    "/application/document-manager/document-management/my-documents/all-documents",
  );
}

export default page;
