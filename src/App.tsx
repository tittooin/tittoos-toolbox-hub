import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from "react";
import ConsentBanner from "./components/ConsentBanner";
const ADS_ENABLED = import.meta.env.VITE_ENABLE_ADS === 'true';

const ENABLE_DOWNLOADERS = import.meta.env.VITE_ENABLE_DOWNLOADERS !== 'false';

// Lazily load pages to reduce initial bundle size
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Categories = lazy(() => import("./pages/Categories"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const AllTools = lazy(() => import("./pages/AllTools"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Attributions = lazy(() => import("./pages/Attributions"));
const Blog = lazy(() => import("./pages/Blog"));
const Author = lazy(() => import("./pages/Author"));

// Tools
const PDFConverter = lazy(() => import("./pages/tools/PDFConverter"));
const PasswordGenerator = lazy(() => import("./pages/tools/PasswordGenerator"));
const QRGenerator = lazy(() => import("./pages/tools/QRGenerator"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const ImageConverter = lazy(() => import("./pages/tools/ImageConverter"));
const TextAnalyzer = lazy(() => import("./pages/tools/TextAnalyzer"));
const VideoConverter = lazy(() => import("./pages/tools/VideoConverter"));
const AudioConverter = lazy(() => import("./pages/tools/AudioConverter"));
const UnitConverter = lazy(() => import("./pages/tools/UnitConverter"));
const CurrencyConverter = lazy(() => import("./pages/tools/CurrencyConverter"));
const TemperatureConverter = lazy(() => import("./pages/tools/TemperatureConverter"));
const Base64Converter = lazy(() => import("./pages/tools/Base64Converter"));
const UUIDGenerator = lazy(() => import("./pages/tools/UUIDGenerator"));
const LoremGenerator = lazy(() => import("./pages/tools/LoremGenerator"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const BarcodeGenerator = lazy(() => import("./pages/tools/BarcodeGenerator"));
const SEOAnalyzer = lazy(() => import("./pages/tools/SEOAnalyzer"));
const WebsiteAnalyzer = lazy(() => import("./pages/tools/WebsiteAnalyzer"));
const Calculator = lazy(() => import("./pages/tools/Calculator"));
const PercentageCalculator = lazy(() => import("./pages/tools/PercentageCalculator"));
const BMICalculator = lazy(() => import("./pages/tools/BMICalculator"));
const LoanCalculator = lazy(() => import("./pages/tools/LoanCalculator"));
const AgeCalculator = lazy(() => import("./pages/tools/AgeCalculator"));
const ImageAnalyzer = lazy(() => import("./pages/tools/ImageAnalyzer"));
const ColorAnalyzer = lazy(() => import("./pages/tools/ColorAnalyzer"));
const TextEditor = lazy(() => import("./pages/tools/TextEditor"));
const JSONEditor = lazy(() => import("./pages/tools/JSONEditor"));
const CSVEditor = lazy(() => import("./pages/tools/CSVEditor"));
const HTMLEditor = lazy(() => import("./pages/tools/HTMLEditor"));
const CSSEditor = lazy(() => import("./pages/tools/CSSEditor"));
const JSONFormatter = lazy(() => import("./pages/tools/JSONFormatter"));
const XMLFormatter = lazy(() => import("./pages/tools/XMLFormatter"));
const SQLFormatter = lazy(() => import("./pages/tools/SQLFormatter"));
const HTMLFormatter = lazy(() => import("./pages/tools/HTMLFormatter"));
const CSSFormatter = lazy(() => import("./pages/tools/CSSFormatter"));
const TimestampConverter = lazy(() => import("./pages/tools/TimestampConverter"));
const URLEncoder = lazy(() => import("./pages/tools/URLEncoder"));
const MarkdownEditor = lazy(() => import("./pages/tools/MarkdownEditor"));
const TextToImage = lazy(() => import("./pages/tools/TextToImage"));
const TextToVideo = lazy(() => import("./pages/tools/TextToVideo"));
const AIPromptAssistant = lazy(() => import("./pages/tools/AIPromptAssistant"));
const AIWebsiteGenerator = lazy(() => import("./pages/tools/AIWebsiteGenerator"));
const AIToolGenerator = lazy(() => import("./pages/tools/AIToolGenerator"));
const YoutubeDownloader = lazy(() => import("./pages/tools/YoutubeDownloader"));
const FacebookDownloader = lazy(() => import("./pages/tools/FacebookDownloader"));
const TwitterDownloader = lazy(() => import("./pages/tools/TwitterDownloader"));
const LinkedinDownloader = lazy(() => import("./pages/tools/LinkedinDownloader"));
const ImageBackgroundRemover = lazy(() => import("./pages/tools/ImageBackgroundRemover"));
const WebsiteSpeedChecker = lazy(() => import("./pages/tools/WebsiteSpeedChecker"));
const AIImageEditor = lazy(() => import("./pages/tools/AIImageEditor"));
const VideoEditor = lazy(() => import("./pages/tools/VideoEditor"));
const OCRConverter = lazy(() => import("./pages/tools/OCRConverter"));
const ResumeBuilder = lazy(() => import("./pages/tools/ResumeBuilder"));

// Blog Category Pages
const AnalyzersCategoryPage = lazy(() => import("./pages/blog-posts/analyzers-category"));
const CalculatorsCategoryPage = lazy(() => import("./pages/blog-posts/calculators-category"));
const FormattersCategoryPage = lazy(() => import("./pages/blog-posts/formatters-category"));
const AIToolsCategoryPage = lazy(() => import("./pages/blog-posts/ai-tools-category"));
const ValidatorsCategoryPage = lazy(() => import("./pages/blog-posts/validators-category"));
const ConvertersCategoryPage = lazy(() => import("./pages/blog-posts/converters-category"));
const GeneratorsCategoryPage = lazy(() => import("./pages/blog-posts/generators-category"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {ADS_ENABLED && <ConsentBanner />}
      <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tools" element={<AllTools />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/attributions" element={<Attributions />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/author/:slug" element={<Author />} />
            
            {/* Blog Category Pages */}
            <Route path="/blog-posts/analyzers-category" element={<AnalyzersCategoryPage />} />
            <Route path="/blog-posts/calculators-category" element={<CalculatorsCategoryPage />} />
            <Route path="/blog-posts/formatters-category" element={<FormattersCategoryPage />} />
            <Route path="/blog-posts/ai-tools-category" element={<AIToolsCategoryPage />} />
            <Route path="/blog-posts/validators-category" element={<ValidatorsCategoryPage />} />
            <Route path="/blog-posts/converters-category" element={<ConvertersCategoryPage />} />
            <Route path="/blog-posts/generators-category" element={<GeneratorsCategoryPage />} />
            
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
            <Route path="/tools/website-speed-checker" element={<WebsiteSpeedChecker />} />
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
            <Route path="/tools/image-background-remover" element={<ImageBackgroundRemover />} />
            <Route path="/tools/ai-image-editor" element={<AIImageEditor />} />
            <Route path="/tools/video-editor" element={<VideoEditor />} />
            
            {/* Calculator Tools */}
            <Route path="/tools/calculator" element={<Calculator />} />
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/bmi-calculator" element={<BMICalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            
            {/* Formatters */}
            <Route path="/tools/json-formatter" element={<JSONFormatter />} />
            <Route path="/tools/xml-formatter" element={<XMLFormatter />} />
            <Route path="/tools/sql-formatter" element={<SQLFormatter />} />
            <Route path="/tools/html-formatter" element={<HTMLFormatter />} />
            <Route path="/tools/css-formatter" element={<CSSFormatter />} />
            
            {/* Encoders */}
            <Route path="/tools/url-encoder" element={<URLEncoder />} />
            <Route path="/tools/text-to-image" element={<TextToImage />} />
            <Route path="/tools/text-to-video" element={<TextToVideo />} />
            <Route path="/tools/ai-prompt-assistant" element={<AIPromptAssistant />} />
            <Route path="/tools/ai-website-generator" element={<AIWebsiteGenerator />} />
            <Route path="/tools/ai-tool-generator" element={<AIToolGenerator />} />
            
            {/* Downloaders (optional) */}
            {ENABLE_DOWNLOADERS && <Route path="/tools/youtube-downloader" element={<YoutubeDownloader />} />}
            {ENABLE_DOWNLOADERS && <Route path="/tools/facebook-downloader" element={<FacebookDownloader />} />}
            {ENABLE_DOWNLOADERS && <Route path="/tools/twitter-downloader" element={<TwitterDownloader />} />}
            {ENABLE_DOWNLOADERS && <Route path="/tools/linkedin-downloader" element={<LinkedinDownloader />} />}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>


      </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
