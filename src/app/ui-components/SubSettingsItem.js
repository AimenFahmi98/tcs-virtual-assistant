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
function SubSettingsItem({ title, href }) {
  const pathname = usePathname(); // Get the current pathname
  const isSelected = pathname === `${href}`;

  return (
    <Link
      href={href}
      className={`ml-8 flex w-[90%] items-center justify-start text-nowrap rounded-lg py-1.5 hover:text-text_light ${isSelected && "bg-primary_dark"} text-text hover:text-text_light`}
    >
      <h2 className="pl-4 text-[14px]">{title}</h2>
    </Link>
  );
}

export default SubSettingsItem;
