import Hero from '../components/landing/Hero';
import Statistics from '../components/landing/Statistics';
import MarketplacePreview from '../components/landing/MarketplacePreview';
import FeaturedSellers from '../components/landing/FeaturedSellers';
import HowItWorks from '../components/landing/HowItWorks';
import SocialProof from '../components/landing/SocialProof';
import CommunityFeed from '../components/landing/CommunityFeed';
import MassMedia from '../components/landing/MassMedia';
import CallToAction from '../components/landing/CallToAction';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full relative">
      <Hero />
      <Statistics />
      <MarketplacePreview />
      <FeaturedSellers />
      <HowItWorks />
      <SocialProof />
      <MassMedia />
      <CommunityFeed />
      <CallToAction />
    </div>
  );
}
