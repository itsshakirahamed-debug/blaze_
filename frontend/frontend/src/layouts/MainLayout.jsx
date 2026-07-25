import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFF] w-full items-center">
      <Navbar />
      <main className="flex-grow w-full flex flex-col items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
