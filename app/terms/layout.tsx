"use client";

import Footer from "@/components/footer";
import { MainNavbar } from "@/components/main-navbar";

export default function TermsLayout({
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
