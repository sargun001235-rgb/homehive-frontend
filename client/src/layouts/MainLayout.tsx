import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Background Mesh & Globs */}
      <div className="fixed inset-0 z-[-2] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]" />
      <div className="fixed inset-0 z-[-1] opacity-50" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Floating Animated Blobs */}
      <div className="blob bg-primary/20 w-[600px] h-[600px] rounded-full top-[-10%] left-[-10%] mix-blend-multiply" style={{ animationDelay: '0s' }}></div>
      <div className="blob bg-secondary/20 w-[500px] h-[500px] rounded-full bottom-[-10%] right-[-10%] mix-blend-multiply" style={{ animationDelay: '2s' }}></div>
      <div className="blob bg-accent/15 w-[400px] h-[400px] rounded-full top-[40%] left-[60%] mix-blend-multiply" style={{ animationDelay: '4s' }}></div>

      <Navbar />
      <main className="flex-grow z-10 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
