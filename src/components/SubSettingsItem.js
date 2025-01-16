"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function SubSettingsItem({ title, href }) {
  const pathname = usePathname(); // Get the current pathname
  const isSelected = pathname === `${href}`;
  console.log("isSelected", isSelected);

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
