import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex">
      {children}
      </main>
      <Footer />
    </div>
  );
}
