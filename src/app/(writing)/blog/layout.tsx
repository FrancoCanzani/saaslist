import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

