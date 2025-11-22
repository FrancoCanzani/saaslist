import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto">
      <Header />
      <main>
      {children}
      </main>
      <Footer />
    </div>
  );
}
