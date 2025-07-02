
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
import ImageAnalyzer from "./pages/tools/ImageAnalyzer";
import ColorAnalyzer from "./pages/tools/ColorAnalyzer";
import TextEditor from "./pages/tools/TextEditor";
import JSONEditor from "./pages/tools/JSONEditor";
import CSVEditor from "./pages/tools/CSVEditor";
import HTMLEditor from "./pages/tools/HTMLEditor";
import CSSEditor from "./pages/tools/CSSEditor";
import JSONFormatter from "./pages/tools/JSONFormatter";
import XMLFormatter from "./pages/tools/XMLFormatter";
import SQLFormatter from "./pages/tools/SQLFormatter";
import HTMLFormatter from "./pages/tools/HTMLFormatter";
import CSSFormatter from "./pages/tools/CSSFormatter";
import TimestampConverter from "./pages/tools/TimestampConverter";
import URLEncoder from "./pages/tools/URLEncoder";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import TextToImage from "./pages/tools/TextToImage";
import TextToVideo from "./pages/tools/TextToVideo";
import AIPromptAssistant from "./pages/tools/AIPromptAssistant";
import AIWebsiteGenerator from "./pages/tools/AIWebsiteGenerator";
import AIToolGenerator from "./pages/tools/AIToolGenerator";

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
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          
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
          <Route path="/tools/color-analyzer" element={<ColorAnalyzer />} />
          <Route path="/tools/image-analyzer" element={<ImageAnalyzer />} />
          
          {/* Editor Tools */}
          <Route path="/tools/color-picker" element={<ColorPicker />} />
          <Route path="/tools/text-editor" element={<TextEditor />} />
          <Route path="/tools/json-editor" element={<JSONEditor />} />
          <Route path="/tools/csv-editor" element={<CSVEditor />} />
          <Route path="/tools/html-editor" element={<HTMLEditor />} />
          <Route path="/tools/css-editor" element={<CSSEditor />} />
          <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
          
          {/* Calculator Tools */}
          <Route path="/tools/calculator" element={<Calculator />} />
          <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
          <Route path="/tools/bmi-calculator" element={<BMICalculator />} />
          <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
          <Route path="/tools/age-calculator" element={<AgeCalculator />} />
          
          {/* Formatter Tools */}
          <Route path="/tools/json-formatter" element={<JSONFormatter />} />
          <Route path="/tools/xml-formatter" element={<XMLFormatter />} />
          <Route path="/tools/sql-formatter" element={<SQLFormatter />} />
          <Route path="/tools/html-formatter" element={<HTMLFormatter />} />
          <Route path="/tools/css-formatter" element={<CSSFormatter />} />
          <Route path="/tools/url-encoder" element={<URLEncoder />} />
          
          {/* AI Tools */}
          <Route path="/tools/text-to-image" element={<TextToImage />} />
          <Route path="/tools/text-to-video" element={<TextToVideo />} />
          <Route path="/tools/ai-prompt-assistant" element={<AIPromptAssistant />} />
          <Route path="/tools/ai-website-generator" element={<AIWebsiteGenerator />} />
          <Route path="/tools/ai-tool-generator" element={<AIToolGenerator />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
