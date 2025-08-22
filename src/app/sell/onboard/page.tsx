import { Metadata } from 'next';
import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import { SellerProvider } from '@/context/SellerContext';
import SellerWizard from '@/components/seller/SellerWizard';

export const metadata: Metadata = {
  title: 'Sell Your Property | OnlyIf - Real Estate Platform',
  description: 'List your property with OnlyIf. Complete our simple 4-step process to get your property listed and start receiving offers.',
  keywords: 'sell property, list property, real estate listing, property seller, OnlyIf',
};

export default function SellerOnboardPage() {
  return (
    <SellerProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <SellerWizard />
        <Footer />
      </div>
    </SellerProvider>
  );
}