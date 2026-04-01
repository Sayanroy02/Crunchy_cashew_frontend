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
import { COLORS } from "@/constants/styles";
// import SectionDivider from "@/components/ui/SectionDivider";


export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Fixed Hero Background — will-change promotes to own GPU layer so scroll compositing is cheaper */}
      <div className="fixed top-0 left-0 w-full pointer-events-auto z-0" style={{ willChange: 'transform' }}>
        <HeroVideo />
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="relative z-10 w-full mt-[clamp(600px,100svh,820px)] bg-bg-cream shadow-[0_-15px_40px_rgba(0,0,0,0.2)] rounded-t-[40px]"
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

        {/* Contact Banner */}
        <section className="py-4 md:py-6 bg-bg-cream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative mt-16 md:mt-14">

              {/* Floating image — overlaps the top edge of the card */}
              <div className="absolute -top-14 md:-top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <Image
                  src="/images/Artboard-1-1000-copy-p-2000.png"
                  alt="Artboard Accent"
                  width={500}
                  height={500}
                  className="w-56 md:w-96 lg:w-[500px] h-auto object-contain drop-shadow-xl"
                />
              </div>

              {/* Main Card */}
              <div
                className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl overflow-visible px-10 pt-16 md:pt-16 pb-10 shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #FFFBEA 0%, #FEF3C7 45%, #FDE68A 100%)',
                }}
              >
                {/* Card inner clip — needed to keep dot pattern inside rounded corners */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  {/* Dotted matrix background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #D97706 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      opacity: 0.1,
                    }}
                  />
                  {/* Decorative blobs */}
                  <div
                    className="absolute -top-16 -right-16 w-64 h-64 rounded-full"
                    style={{ background: 'radial-gradient(circle, #FCD34D55 0%, transparent 70%)' }}
                  />
                  <div
                    className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
                    style={{ background: 'radial-gradient(circle, #FDE68A55 0%, transparent 70%)' }}
                  />
                </div>

                {/* Left: Text */}
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ backgroundColor: COLORS.primary, color: '#fff', letterSpacing: '0.12em' }}
                  >
                    Factory Direct
                  </span>

                  <h2
                    className="text-3xl md:text-4xl font-bold leading-tight"
                    style={{ color: COLORS.black }}
                  >
                    Need a{' '}
                    <span style={{ color: COLORS.primary }}>Custom Order?</span>
                  </h2>

                  <p
                    className="text-sm md:text-base max-w-sm leading-relaxed"
                    style={{ color: COLORS.black, fontWeight: 600 }}
                  >
                    We handle large-scale shipments and retail packaging. Get in
                    touch with our factory today.
                  </p>


                  <a href="/contact"
                    className="group inline-flex items-center gap-3 font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 text-sm mt-2"
                    style={{ backgroundColor: COLORS.button, color: COLORS.buttonText, boxShadow: '0 4px 24px #D9770640' }}
                  >
                    Contact Us
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 group-hover:translate-x-1 bg-black/20">
                      <i className="fa-solid fa-paper-plane text-black text-xs" />
                    </span>
                  </a>
                </div>

                {/* Right: Mockup Image */}
                <div className="relative z-10 flex-shrink-0 flex items-end justify-center md:justify-end w-full md:w-auto">
                  <Image
                    src="/images/crunchy-cashews-product.png"
                    alt="Product Mockup"
                    width={384}
                    height={384}
                    className="w-64 md:w-80 lg:w-96 object-contain drop-shadow-2xl"
                    style={{ marginBottom: '-40px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>


        <BlogsPreview />
        <BlogFeatureBanner />
      </div>
    </main>
  );
}