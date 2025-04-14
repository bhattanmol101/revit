import Footer from "@/components/footer";

import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <main>{children}</main>
      <Footer />
    </div>
  );
}
