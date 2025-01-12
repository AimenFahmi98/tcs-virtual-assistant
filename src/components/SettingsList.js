"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VscAccount } from "react-icons/vsc";
import { PiPaintBrush } from "react-icons/pi";
import { BiArrowBack } from "react-icons/bi";

function SettingsList() {
  return (
    <MainSetting
      icon={<VscAccount className="h-5 w-5" />}
      title={"Account"}
      className={"mt-24 text-text"}
    >
      <SubSetting
        title={"Appearance"}
        href={"/settings/appearance"}
        icon={<PiPaintBrush />}
      />
      <SubSetting
        title={"Profile"}
        href={"/settings/profile"}
        icon={<VscAccount />}
      />
    </MainSetting>
  );
}

function MainSetting({ icon, title, className, children }) {
  return (
    <div
      className={`grid grid-cols-[auto_1fr] items-center justify-center gap-y-2 px-6 ${className}`}
    >
      <Link
        href={"/ai-assistant"}
        className="col-start-1 mb-5 rounded-l-lg bg-primary_dark py-2.5 pl-4 pr-2"
      >
        <BiArrowBack className="h-5 w-5" />
      </Link>
      <Link
        href={"/ai-assistant"}
        className="col-start-2 mb-5 rounded-r-lg bg-primary_dark px-3 py-2"
      >
        <span className="font-semibold">Virtual Assistant</span>
      </Link>
      <div className="pl-4 pr-2">{icon}</div>
      <span className="px-3 py-2">{title}</span>
      {children}
    </div>
  );
}

function SubSetting({ title, href }) {
  const pathname = usePathname(); // Get the current pathname
  return (
    <div className="col-start-2 text-text">
      <Link
        className={`w-full px-3 py-2 ${
          pathname === `${href}` ? "bg-primary_dark" : "bg-inherit"
        } flex items-center justify-start rounded-lg`}
        href={href}
      >
        {title}
      </Link>
    </div>
  );
}

export default SettingsList;
