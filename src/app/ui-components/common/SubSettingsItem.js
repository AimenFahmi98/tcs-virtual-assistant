"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A component that renders a sub-settings navigation item as a link.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.title - The text to display for the sub-settings item
 * @param {string} props.href - The URL path that the link should navigate to
 * @returns {JSX.Element} A Link component styled as a sub-settings item that highlights when selected
 */
function SubSettingsItem({ title, href, notificationCount = 0 }) {
  const pathname = usePathname(); // Get the current pathname
  let isSelected = pathname === `${href}`;

  // Deals with the case of having only one settings item for the two pages all-documents and rag-documents
  if (
    href ===
      "/document-manager/document-management/my-documents/all-documents" &&
    pathname ===
      "/document-manager/document-management/my-documents/rag-documents"
  ) {
    isSelected = true;
  }

  return (
    <Link
      href={href}
      className={`ml-8 flex w-[90%] items-center justify-start text-nowrap rounded-lg py-1.5 hover:text-text_light ${isSelected && "bg-primary_dark"} text-text hover:text-text_light`}
    >
      <div className="flex w-full items-center justify-between">
        <h2 className="pl-4 text-[14px]">{title}</h2>
        {notificationCount > 0 && (
          <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-gray-100">
            <span className="font-semibold">{notificationCount}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default SubSettingsItem;
