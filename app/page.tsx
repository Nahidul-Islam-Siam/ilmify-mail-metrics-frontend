import ToastProvider from '../components/ToastProvider';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
import CtaBand from '../components/CtaBand';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <ToastProvider>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Faq />
      <CtaBand />
      <Footer />
    </ToastProvider>
  );
}
