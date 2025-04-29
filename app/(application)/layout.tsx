"use client";

import "@/styles/globals.css";

import { RightBar } from "@/app/(application)/_components/right-bar";
import { SideNavbar } from "@/app/(application)/_components/side-navbar";
import { Navbar } from "@/app/(application)/_components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-row justify-center pt-16">
        <div className="hidden sm:flex sm:basis-3/12 lg:basis-2/12">
          <SideNavbar />
        </div>
        <div className="lg:basis-[36%] sm:basis-[80%] flex flex-col justify-center p-1">
          {children}
        </div>
        <div className="hidden sm:flex sm:basis-5/12 lg:basis-3/12">
          <RightBar />
        </div>
      </div>
    </>
  );
}
