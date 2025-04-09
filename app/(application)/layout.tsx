"use client";

import "@/styles/globals.css";

import { RightBar } from "@/components/right-bar";
import { SideNavbar } from "@/components/side-navbar";
import { Navbar } from "@/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-row justify-center pt-16">
        <div className="hidden sm:flex basis-2/12">
          <SideNavbar />
        </div>
        <div className="sm:basis-[36%]">{children}</div>
        <div className="hidden sm:flex basis-3/12">
          <RightBar />
        </div>
      </div>
    </>
  );
}
