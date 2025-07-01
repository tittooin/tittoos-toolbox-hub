
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AllTools from "./pages/AllTools";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Blog from "./pages/Blog";
import PDFConverter from "./pages/tools/PDFConverter";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import QRGenerator from "./pages/tools/QRGenerator";
import ColorPicker from "./pages/tools/ColorPicker";
import ImageConverter from "./pages/tools/ImageConverter";
import TextAnalyzer from "./pages/tools/TextAnalyzer";
import VideoConverter from "./pages/tools/VideoConverter";
import AudioConverter from "./pages/tools/AudioConverter";
import UnitConverter from "./pages/tools/UnitConverter";
import CurrencyConverter from "./pages/tools/CurrencyConverter";
import TemperatureConverter from "./pages/tools/TemperatureConverter";
import Base64Converter from "./pages/tools/Base64Converter";
import UUIDGenerator from "./pages/tools/UUIDGenerator";
import LoremGenerator from "./pages/tools/LoremGenerator";
import HashGenerator from "./pages/tools/HashGenerator";
import BarcodeGenerator from "./pages/tools/BarcodeGenerator";
import SEOAnalyzer from "./pages/tools/SEOAnalyzer";
import WebsiteAnalyzer from "./pages/tools/WebsiteAnalyzer";
import Calculator from "./pages/tools/Calculator";
import PercentageCalculator from "./pages/tools/PercentageCalculator";
import BMICalculator from "./pages/tools/BMICalculator";
import LoanCalculator from "./pages/tools/LoanCalculator";
import AgeCalculator from "./pages/tools/AgeCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools" element={<AllTools />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Converter Tools */}
          <Route path="/tools/pdf-converter" element={<PDFConverter />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/video-converter" element={<VideoConverter />} />
          <Route path="/tools/audio-converter" element={<AudioConverter />} />
          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
          <Route path="/tools/temperature-converter" element={<TemperatureConverter />} />
          <Route path="/tools/base64-converter" element={<Base64Converter />} />
          
          {/* Generator Tools */}
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/qr-generator" element={<QRGenerator />} />
          <Route path="/tools/uuid-generator" element={<UUIDGenerator />} />
          <Route path="/tools/lorem-generator" element={<LoremGenerator />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
          
          {/* Analyzer Tools */}
          <Route path="/tools/seo-analyzer" element={<SEOAnalyzer />} />
          <Route path="/tools/website-analyzer" element={<WebsiteAnalyzer />} />
          <Route path="/tools/text-analyzer" element={<TextAnalyzer />} />
          
          {/* Calculator Tools */}
          <Route path="/tools/calculator" element={<Calculator />} />
          <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
          <Route path="/tools/bmi-calculator" element={<BMICalculator />} />
          <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
          <Route path="/tools/age-calculator" element={<AgeCalculator />} />
          
          {/* Editor Tools */}
          <Route path="/tools/color-picker" element={<ColorPicker />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
