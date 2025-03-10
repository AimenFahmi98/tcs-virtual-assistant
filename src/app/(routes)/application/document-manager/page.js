import { redirect } from "next/navigation";

function Page() {
  redirect(
    "/application/document-manager/document-management/my-documents/all-documents",
  );
}

export default Page;
