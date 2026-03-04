import HeroCarousel from "@/components/home/HeroCarousel";
import WhyUsCRO from "@/components/home/WhyUsCRO";
import BestSellers from "@/components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import BlogsPreview from "@/components/home/BlogsPreview";
import Affiliates from "@/components/home/Affiliates";
import FAQAccordion from "@/components/home/FAQAccordion";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <BestSellers />
      <Affiliates />

      <WhyUsCRO />
      <FAQAccordion />
      <Testimonials />

      {/* Contact Banner */}
      <section className="py-20 bg-bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-black text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/20 rounded-full blur-3xl -tr-32 -mr-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -bl-32 -ml-32 pointer-events-none"></div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 relative z-10">Need a Custom Order?</h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto relative z-10">We handle large-scale shipments and retail packaging. Get in touch with our factory today.</p>

            <a href="/contact" className="inline-block bg-highlight text-black font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 relative z-10">
              Contact Us <i className="fa-solid fa-paper-plane ml-2"></i>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
