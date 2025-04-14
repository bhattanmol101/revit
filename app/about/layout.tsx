"use client";

import { MainNavbar } from "@/components/main-navbar";
import Footer from "@/components/footer";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <MainNavbar />
      <div className="pt-24 pb-10 px-4 md:px-36">{children}</div>
      <Footer />
    </section>
  );
}
