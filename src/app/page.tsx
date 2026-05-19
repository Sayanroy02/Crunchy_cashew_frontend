import Image from "next/image";
// import WhyUsCRO from "@/components/home/WhyUsCRO";
import BestSellers from "@/components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import BlogsPreview from "@/components/home/BlogsPreview";
import BlogFeatureBanner from "@/components/home/BlogFeatureBanner";
import Affiliates from "@/components/home/Affiliates";
import HeroVideo from "@/components/home/HeroAnimationBanner";
// import OfferStripCarousel from "@/components/home/HeroCarousel";
// import PriceComparisonPreview from "@/components/home/PriceComparisonPreview";
import DirectAdvantage from "@/components/home/OffersGrid";
import BulkOrderCard from "@/components/home/BulkOrderCard";
import AboutFactory from "@/components/home/AboutFactory";
import InstaVideos from "@/components/home/InstaVideos";
import WhyUsCRO from "@/components/home/WhyUsCRO";
import PriceComparisonPreview from "@/components/home/PriceComparisonPreview";
import AnimatedFlyingImage from "@/components/home/AnimatedFlyingImage";
import SectionDecoration from "@/components/ui/SectionDecoration";
import WhiteLabelBanner from "@/components/home/WhiteLabelBanner";
import { COLORS } from "@/constants/styles";
// import SectionDivider from "@/components/ui/SectionDivider";


export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero — starts below the fixed navbar on all breakpoints */}
      <div className="relative w-full z-0">
        <HeroVideo />
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="relative z-10 w-full bg-bg-cream shadow-[0_-15px_40px_rgba(0,0,0,0.2)] rounded-t-[40px]"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* BestSellers */}
        {/* <SectionDecoration type="parachute" className="-top-4 right-[15%]" /> */}
        <BestSellers />


        {/* PriceComparison */}
        <PriceComparisonPreview />

        <AnimatedFlyingImage />

        {/* BulkOrder */}
        <BulkOrderCard />

        <InstaVideos />
        <AboutFactory />

        {/* Testimonials */}
        <Testimonials />

        {/* White Labelling Banner */}
        <WhiteLabelBanner />


        <BlogsPreview />
        <BlogFeatureBanner />
      </div>
    </main>
  );
}