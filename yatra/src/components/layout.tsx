import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 dark:from-blue-600 to-40% to-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
}