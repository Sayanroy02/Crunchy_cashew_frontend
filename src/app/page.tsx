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
// import SectionDivider from "@/components/ui/SectionDivider";

// ── Inline keyframes (home-page only) ─────────────────────────────────────
const homeDecoStyles = `
  @keyframes fruitSway {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-10px) rotate(1.5deg); }
    66%      { transform: translateY(6px) rotate(-1deg); }
  }
  @keyframes fruitSwayR {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-8px) rotate(-1.5deg); }
    66%      { transform: translateY(5px) rotate(1deg); }
  }
  .fruit-hover img { transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1); }
  .fruit-hover:hover img { transform: scale(1.12); }
`;

// ── Re-usable fruit deco pair ──────────────────────────────────────────────
function FruitDeco({ delay = '0s' }: { delay?: string }) {
  return (
    <>
      {/* Left fruit */}
      <div
        className="fruit-hover pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
        style={{ animation: `fruitSway 7s ease-in-out infinite`, animationDelay: delay }}
      >
        <Image
          src="/images/Left-Fruit-2-1.png"
          alt=""
          width={180}
          height={320}
          className="w-[clamp(80px,8.5vw,150px)] h-auto object-contain opacity-85 drop-shadow-xl"
          priority={false}
        />
      </div>

      {/* Right fruit */}
      <div
        className="fruit-hover pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
        style={{ animation: `fruitSwayR 8s ease-in-out infinite`, animationDelay: delay }}
      >
        <Image
          src="/images/Right-Fruit-2-2-1.png"
          alt=""
          width={180}
          height={320}
          className="w-[clamp(80px,8.5vw,150px)] h-auto object-contain opacity-85 drop-shadow-xl"
          priority={false}
        />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* ── Keyframes ── */}
      <style dangerouslySetInnerHTML={{ __html: homeDecoStyles }} />

      {/* Fixed Hero Background — will-change promotes to own GPU layer so scroll compositing is cheaper */}
      <div className="fixed top-0 left-0 w-full pointer-events-auto z-0" style={{ willChange: 'transform' }}>
        <HeroVideo />
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="relative z-10 w-full mt-[clamp(600px,100svh,820px)] bg-bg-cream shadow-[0_-15px_40px_rgba(0,0,0,0.2)] rounded-t-[40px]"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* BestSellers — no fruit deco */}
        <BestSellers />

        {/* PriceComparison — WITH fruit deco */}
        <div className="relative" style={{ overflow: 'visible' }}>
          <FruitDeco delay="0s" />
          <PriceComparisonPreview />
        </div>

        <AnimatedFlyingImage />

        {/* BulkOrder — WITH fruit deco */}
        <div className="relative" style={{ overflow: 'visible' }}>
          <FruitDeco delay="0.5s" />
          <BulkOrderCard />
        </div>

        <InstaVideos />
        <AboutFactory />

        {/* Testimonials — WITH fruit deco */}
        <div className="relative" style={{ overflow: 'visible' }}>
          <FruitDeco delay="1s" />
          <Testimonials />
        </div>

        {/* Contact Banner */}
        <section className="py-4 md:py-6 bg-bg-cream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative">

              {/* Floating image on top of card */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <Image
                  src="/images/Artboard-1-1000-copy-p-2000.png"
                  alt="Artboard Accent"
                  width={500}
                  height={500}
                  className="w-500 h-auto object-contain drop-shadow-xl"
                />
              </div>

              {/* Main Card */}
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl overflow-hidden px-10 pt-16 pb-10 shadow-xl bg-black">

                {/* Dot grid pattern overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #ffffff18 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />

                {/* Gold circles */}
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full pointer-events-none bg-[#FDC700]/10 border border-[#FDC700]/20" />
                <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full pointer-events-none bg-[#FDC700]/10 border border-[#FDC700]/20" />

                {/* Left: Text */}
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FDC700]/20 text-[#FDC700] border border-[#FDC700]/40">
                    Factory Direct
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Need a{" "}
                    <span className="text-[#FDC700]">Custom Order?</span>
                  </h2>
                  <p className="text-sm md:text-base max-w-sm leading-relaxed text-white/70">
                    We handle large-scale shipments and retail packaging. Get in
                    touch with our factory today.
                  </p>
                  <a
                    href="/contact"
                    className="group inline-flex items-center gap-3 font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 text-sm mt-2 bg-[#FDC700] text-[#0a0a0a]"
                    style={{ boxShadow: "0 4px 24px #FDC70055" }}
                  >
                    Contact Us
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 group-hover:translate-x-1 bg-primary">
                      <i className="fa-solid fa-paper-plane text-white text-xs" />
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
                    style={{ marginBottom: "-40px" }}
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