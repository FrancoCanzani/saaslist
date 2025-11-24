import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto flex flex-col flex-1 w-full">
        <main className="flex-1 flex w-full">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
