import Header from "@/components/header";
import Footer from "@/components/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      <Footer />
    </div>
  );
}
