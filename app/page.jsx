import ToastProvider from '../components/ToastProvider.jsx';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Pricing from '../components/Pricing.jsx';
import Faq from '../components/Faq.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Footer from '../components/Footer.jsx';

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
