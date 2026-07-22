
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from "react";
import SimpleErrorBoundary from "./components/SimpleErrorBoundary";
import AdminRouteGuard from "./components/AdminRouteGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdMobBanner from "./components/AdMobBanner";

// Lazy load pages for better performance
const Categories = lazy(() => import("./pages/Categories"));
const SocialScheduler = lazy(() => import("./pages/tools/SocialScheduler"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const AllTools = lazy(() => import("./pages/AllTools"));
const WorkspaceDashboard = lazy(() => import("./pages/WorkspaceDashboard"));
const CreatorStudio = lazy(() => import("./pages/CreatorStudio"));
const TemplateMarketplace = lazy(() => import("./pages/TemplateMarketplace"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Attributions = lazy(() => import("./pages/Attributions"));
const DigitalIncomeKit = lazy(() => import("./pages/DigitalIncomeKit"));
const Blog = lazy(() => import("./pages/Blog"));
const Author = lazy(() => import("./pages/Author"));
const SubmitBlog = lazy(() => import("./pages/SubmitBlog"));
const Community = lazy(() => import("./pages/Community"));

// Blog Categories
const AnalyzersCategoryPage = lazy(() => import("./pages/blog-posts/analyzers-category"));
const CalculatorsCategoryPage = lazy(() => import("./pages/blog-posts/calculators-category"));
const FormattersCategoryPage = lazy(() => import("./pages/blog-posts/formatters-category"));
const AIToolsCategoryPage = lazy(() => import("./pages/blog-posts/ai-tools-category"));
const ValidatorsCategoryPage = lazy(() => import("./pages/blog-posts/validators-category"));
const ConvertersCategoryPage = lazy(() => import("./pages/blog-posts/converters-category"));
const GeneratorsCategoryPage = lazy(() => import("./pages/blog-posts/generators-category"));
const EditorsCategoryPage = lazy(() => import("./pages/blog-posts/editors-category"));
const GamesCategoryPage = lazy(() => import("./pages/blog-posts/games-category"));
const PDFCategoryPage = lazy(() => import("./pages/blog-posts/pdf-category"));
const DevToolsCategoryPage = lazy(() => import("./pages/blog-posts/dev-tools-category"));

// Converter Tools
const PDFConverter = lazy(() => import("./pages/tools/PDFConverter"));
const PDFToWord = lazy(() => import("./pages/tools/PDFToWord"));
const WordToPDF = lazy(() => import("./pages/tools/WordToPDF"));
const PDFToJPG = lazy(() => import("./pages/tools/PDFToJPG"));
const PDFToPNG = lazy(() => import("./pages/tools/PDFToPNG"));
const JPGToPDF = lazy(() => import("./pages/tools/JPGToPDF"));
const PDFToExcel = lazy(() => import("./pages/tools/PDFToExcel"));
const ExcelToPDF = lazy(() => import("./pages/tools/ExcelToPDF"));
const PDFToPPT = lazy(() => import("./pages/tools/PDFToPPT"));
const PPTToPDF = lazy(() => import("./pages/tools/PPTToPDF"));
const LockPDF = lazy(() => import("./pages/tools/LockPDF"));
const UnlockPDF = lazy(() => import("./pages/tools/UnlockPDF"));
const RotatePDF = lazy(() => import("./pages/tools/RotatePDF"));
const DeletePDFPages = lazy(() => import("./pages/tools/DeletePDFPages"));
const ExtractPDFPages = lazy(() => import("./pages/tools/ExtractPDFPages"));
const WatermarkPDF = lazy(() => import("./pages/tools/WatermarkPDF"));
const RearrangePDF = lazy(() => import("./pages/tools/RearrangePDF"));
const PDFTextExtractor = lazy(() => import("./pages/tools/PDFTextExtractor"));
const PDFEditor = lazy(() => import("./pages/tools/PDFEditor"));
const ImageConverter = lazy(() => import("./pages/tools/ImageConverter"));
const PDFToImage = lazy(() => import("./pages/tools/PDFToImage"));
const PDFToEPUB = lazy(() => import("./pages/tools/PDFToEPUB"));
const VideoToShorts = lazy(() => import("./pages/tools/VideoToShorts"));
const ToolPoster = lazy(() => import("./pages/tools/ToolPoster"));
const VideoConverter = lazy(() => import("./pages/tools/VideoConverter"));
const AudioConverter = lazy(() => import("./pages/tools/AudioConverter"));
const UnitConverter = lazy(() => import("./pages/tools/UnitConverter"));
const CurrencyConverter = lazy(() => import("./pages/tools/CurrencyConverter"));
const TemperatureConverter = lazy(() => import("./pages/tools/TemperatureConverter"));
const Base64Converter = lazy(() => import("./pages/tools/Base64Converter"));
const TimestampConverter = lazy(() => import("./pages/tools/TimestampConverter"));
const MergePDF = lazy(() => import("./pages/tools/MergePDF"));
const SplitPDF = lazy(() => import("./pages/tools/SplitPDF"));
const CompressPDF = lazy(() => import("./pages/tools/CompressPDF"));

// Generator Tools
const PasswordGenerator = lazy(() => import("./pages/tools/PasswordGenerator"));
const QRGenerator = lazy(() => import("./pages/tools/QRGenerator"));
const UUIDGenerator = lazy(() => import("./pages/tools/UUIDGenerator"));
const LoremGenerator = lazy(() => import("./pages/tools/LoremGenerator"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const BarcodeGenerator = lazy(() => import("./pages/tools/BarcodeGenerator"));

// Analyzer Tools
const SEOAnalyzer = lazy(() => import("./pages/tools/SEOAnalyzer"));
const WebsiteAnalyzer = lazy(() => import("./pages/tools/WebsiteAnalyzer"));
const WebsiteSpeedChecker = lazy(() => import("./pages/tools/WebsiteSpeedChecker"));
const TextAnalyzer = lazy(() => import("./pages/tools/TextAnalyzer"));
const ColorAnalyzer = lazy(() => import("./pages/tools/ColorAnalyzer"));
const ImageAnalyzer = lazy(() => import("./pages/tools/ImageAnalyzer"));

// Editor Tools
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const TextEditor = lazy(() => import("./pages/tools/TextEditor"));
const JSONEditor = lazy(() => import("./pages/tools/JSONEditor"));
const CSVEditor = lazy(() => import("./pages/tools/CSVEditor"));
const HTMLEditor = lazy(() => import("./pages/tools/HTMLEditor"));
const CSSEditor = lazy(() => import("./pages/tools/CSSEditor"));
const MarkdownEditor = lazy(() => import("./pages/tools/MarkdownEditor"));
const ImageBackgroundRemover = lazy(() => import("./pages/tools/ImageBackgroundRemover"));
const AIImageEditor = lazy(() => import("./pages/tools/AIImageEditor"));
const VideoEditor = lazy(() => import("./pages/tools/VideoEditor"));

// Calculator Tools
const Calculator = lazy(() => import("./pages/tools/Calculator"));
const PercentageCalculator = lazy(() => import("./pages/tools/PercentageCalculator"));
const BMICalculator = lazy(() => import("./pages/tools/BMICalculator"));
const LoanCalculator = lazy(() => import("./pages/tools/LoanCalculator"));
const AgeCalculator = lazy(() => import("./pages/tools/AgeCalculator"));

// Formatters
const JSONFormatter = lazy(() => import("./pages/tools/JSONFormatter"));
const XMLFormatter = lazy(() => import("./pages/tools/XMLFormatter"));
const SQLFormatter = lazy(() => import("./pages/tools/SQLFormatter"));
const HTMLFormatter = lazy(() => import("./pages/tools/HTMLFormatter"));
const CSSFormatter = lazy(() => import("./pages/tools/CSSFormatter"));

// Validators
const PasswordValidator = lazy(() => import("./pages/tools/PasswordValidator"));
const EmailValidator = lazy(() => import("./pages/tools/EmailValidator"));

// Encoders & AI Tools
const URLEncoder = lazy(() => import("./pages/tools/URLEncoder"));
const TextToImage = lazy(() => import("./pages/tools/TextToImage"));
const ThumbnailGenerator = lazy(() => import("./pages/tools/ThumbnailGenerator"));
const TextToVideo = lazy(() => import("./pages/tools/TextToVideo"));
const AIPromptAssistant = lazy(() => import("./pages/tools/AIPromptAssistant"));
const AIWebsiteGenerator = lazy(() => import("./pages/tools/AIWebsiteGenerator"));
const AIToolGenerator = lazy(() => import("./pages/tools/AIToolGenerator"));
const IPAddressLookup = lazy(() => import("./pages/tools/IPAddressLookup"));
const WhoisLookup = lazy(() => import("./pages/tools/WhoisLookup"));
const InternetSpeedTest = lazy(() => import("./pages/tools/InternetSpeedTest"));
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor"));
const ResumeBuilder = lazy(() => import("./pages/tools/ResumeBuilder"));
const OCRConverter = lazy(() => import("./pages/tools/OCRConverter"));

// AI PDF Tools
const ChatWithPDF = lazy(() => import("./pages/tools/ChatWithPDF"));
const PDFSummarizer = lazy(() => import("./pages/tools/PDFSummarizer"));
const PDFQuizGenerator = lazy(() => import("./pages/tools/PDFQuizGenerator"));
const PDFStudyNotes = lazy(() => import("./pages/tools/PDFStudyNotes"));
const PDFTranslator = lazy(() => import("./pages/tools/PDFTranslator"));
const ImageResizer = lazy(() => import("./pages/tools/ImageResizer"));
const TextToHandwriting = lazy(() => import("./pages/tools/TextToHandwriting"));
const NumberFlow = lazy(() => import("./pages/tools/NumberFlow"));
const AIRemixSuite = lazy(() => import("./pages/tools/AIRemixSuite"));
const SmartPDF = lazy(() => import("./pages/tools/SmartPDF"));
const SmartPDFHub = lazy(() => import("./pages/tools/SmartPDFHub"));
const AxevoraCircle = lazy(() => import("./pages/tools/AxevoraCircle"));
const AxevoraDedications = lazy(() => import("./pages/tools/AxevoraDedications"));
const AxevoraLiveRooms = lazy(() => import("./pages/tools/AxevoraLiveRooms"));
const AxevoraSpotlight = lazy(() => import("./pages/tools/AxevoraSpotlight"));
const AICommandCenter = lazy(() => import("./pages/tools/AICommandCenter"));
const BattleLab = lazy(() => import("./pages/tools/BattleLab"));

// Games
const TypingSpeedTest = lazy(() => import("./pages/tools/TypingSpeedTest"));
const PoolBubbles = lazy(() => import("./pages/tools/PoolBubbles"));
const PromoShowcase = lazy(() => import("./pages/PromoShowcase")); // Added Promo Showcase
const Game2048 = lazy(() => import("./pages/tools/Game2048"));

const ClickSpeedTest = lazy(() => import("./pages/tools/ClickSpeedTest"));
const ReactionTimeTest = lazy(() => import("./pages/tools/ReactionTimeTest"));
const MemoryMatchGame = lazy(() => import("./pages/tools/MemoryMatchGame"));
const MathSpeedChallenge = lazy(() => import("./pages/tools/MathSpeedChallenge"));

// AI Social Media Tools
const AICaptionGenerator = lazy(() => import("./pages/tools/AICaptionGenerator"));
const AIHashtagGenerator = lazy(() => import("./pages/tools/AIHashtagGenerator"));
const AIReelScriptGenerator = lazy(() => import("./pages/tools/AIReelScriptGenerator"));
const TechVersus = lazy(() => import("./pages/versus/TechVersus"));
const SoftwareVersus = lazy(() => import("./pages/versus/SoftwareVersus"));
const NutritionVersus = lazy(() => import("./pages/versus/NutritionVersus"));
const AIThumbnailTextGenerator = lazy(() => import("./pages/tools/AIThumbnailTextGenerator"));
const AIBioGenerator = lazy(() => import("./pages/tools/AIBioGenerator"));
const AIBlogGeneratorPage = lazy(() => import("./pages/tools/AIBlogGeneratorPage"));
const ProductAnalysis = lazy(() => import("./pages/tools/ProductAnalysis"));

// Dev Tools
const WindowsCommandGenerator = lazy(() => import("./pages/tools/WindowsCommandGenerator"));
const LinuxCommandGenerator = lazy(() => import("./pages/tools/LinuxCommandGenerator"));
const MacCommandGenerator = lazy(() => import("./pages/tools/MacCommandGenerator"));
const AndroidCommandGenerator = lazy(() => import("./pages/tools/AndroidCommandGenerator"));

// Admin
const BlogManager = lazy(() => import("./pages/admin/BlogManager"));
const BattleManager = lazy(() => import("./pages/admin/BattleManager"));

// Deals Module
const DealsHome = lazy(() => import("./modules/deals/pages/DealsHome"));
const TrendingDeals = lazy(() => import("./modules/deals/pages/TrendingDeals"));
const DealsCategories = lazy(() => import("./modules/deals/pages/DealsCategories"));
const ProductDetails = lazy(() => import("./modules/deals/pages/ProductDetails"));
const ArticleDetails = lazy(() => import("./modules/deals/pages/ArticleDetails"));

// CMS Module
const CMSDashboard = lazy(() => import("./modules/cms/pages/CMSDashboard"));
const ContentManager = lazy(() => import("./modules/cms/pages/ContentManager"));
const ContentEditor = lazy(() => import("./modules/cms/pages/ContentEditor"));

// Taxonomy Module
const TaxonomyDashboard = lazy(() => import("./modules/taxonomy/pages/TaxonomyDashboard"));

// Product Module
const ProductDashboard = lazy(() => import("./modules/products/pages/ProductDashboard"));

// Commerce Module
const CommerceDashboard = lazy(() => import("./modules/commerce/pages/CommerceDashboard"));
const CommercePublisher = lazy(() => import("./modules/commerce/pages/CommercePublisher"));

// App Support
const NeonBlockPuzzlePrivacy = lazy(() => import("./pages/apps/NeonBlockPuzzlePrivacy"));
const Game2048SagaPrivacy = lazy(() => import("./pages/apps/Game2048SagaPrivacy"));
const Sitemap = lazy(() => import("./pages/Sitemap"));

const queryClient = new QueryClient();

const LegacyHashRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith("#/")) {
      const targetPath = window.location.hash.replace("#/", "/");
      if (targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [navigate, location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LegacyHashRedirect />
          <SimpleErrorBoundary>
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/tools" element={<AllTools />} />
                <Route path="/workspace" element={<WorkspaceDashboard />} />
                <Route path="/creator-studio" element={<CreatorStudio />} />
                <Route path="/marketplace/templates" element={<TemplateMarketplace />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/attributions" element={<Attributions />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/promo" element={<PromoShowcase />} /> {/* Registered Promo route */}
                <Route path="/blog/:slug" element={<Blog />} />
                <Route path="/author/:slug" element={<Author />} />
                <Route path="/submit-blog" element={<SubmitBlog />} />
                <Route path="/earn" element={<DigitalIncomeKit />} />
                <Route path="/community" element={<Community />} />

                {/* Blog Category Pages */}
                <Route path="/blog-posts/analyzers-category" element={<AnalyzersCategoryPage />} />
                <Route path="/blog-posts/calculators-category" element={<CalculatorsCategoryPage />} />
                <Route path="/blog-posts/formatters-category" element={<FormattersCategoryPage />} />
                <Route path="/blog-posts/ai-tools-category" element={<AIToolsCategoryPage />} />
                <Route path="/blog-posts/validators-category" element={<ValidatorsCategoryPage />} />
                <Route path="/blog-posts/converters-category" element={<ConvertersCategoryPage />} />
                <Route path="/blog-posts/generators-category" element={<GeneratorsCategoryPage />} />
                <Route path="/blog-posts/editors-category" element={<EditorsCategoryPage />} />
                <Route path="/blog-posts/games-category" element={<GamesCategoryPage />} />
                <Route path="/blog-posts/pdf-category" element={<PDFCategoryPage />} />
                <Route path="/blog-posts/dev-tools-category" element={<DevToolsCategoryPage />} />

                {/* Converter Tools */}
                <Route path="/tools/pdf-converter" element={<PDFConverter />} />
                <Route path="/tools/pdf-to-word" element={<PDFToWord />} />
                <Route path="/tools/word-to-pdf" element={<WordToPDF />} />
                <Route path="/tools/pdf-to-jpg" element={<PDFToJPG />} />
                <Route path="/tools/pdf-to-png" element={<PDFToPNG />} />
                <Route path="/tools/jpg-to-pdf" element={<JPGToPDF />} />
                <Route path="/tools/pdf-to-excel" element={<PDFToExcel />} />
                <Route path="/tools/excel-to-pdf" element={<ExcelToPDF />} />
                <Route path="/tools/pdf-to-ppt" element={<PDFToPPT />} />
                <Route path="/tools/ppt-to-pdf" element={<PPTToPDF />} />
                <Route path="/tools/lock-pdf" element={<LockPDF />} />
                <Route path="/tools/unlock-pdf" element={<UnlockPDF />} />
                <Route path="/tools/rotate-pdf" element={<RotatePDF />} />
                <Route path="/tools/delete-pdf-pages" element={<DeletePDFPages />} />
                <Route path="/tools/extract-pdf-pages" element={<ExtractPDFPages />} />
                <Route path="/tools/watermark-pdf" element={<WatermarkPDF />} />
                <Route path="/tools/rearrange-pdf" element={<RearrangePDF />} />
                <Route path="/tools/pdf-text-extractor" element={<PDFTextExtractor />} />
                <Route path="/tools/pdf-editor" element={<PDFEditor />} />
                <Route path="/tools/image-converter" element={<ImageConverter />} />
                <Route path="/tools/pdf-to-image" element={<PDFToImage />} />
                <Route path="/tools/pdf-to-epub" element={<PDFToEPUB />} />
                <Route path="/tools/video-to-shorts" element={<Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}><VideoToShorts /></Suspense>} />
                <Route path="/promo/poster" element={<Suspense fallback={<div>Loading Poster Generator...</div>}><ToolPoster /></Suspense>} />
                {/* <Route path="/promo/video-shorts-poster" element={<Suspense fallback={<div>Loading Poster Generator...</div>}><ToolPoster /></Suspense>} /> */}
                <Route path="/tools/video-converter" element={<VideoConverter />} />
                <Route path="/tools/audio-converter" element={<AudioConverter />} />
                <Route path="/tools/unit-converter" element={<UnitConverter />} />
                <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
                <Route path="/tools/temperature-converter" element={<TemperatureConverter />} />
                <Route path="/tools/base64-converter" element={<Base64Converter />} />
                <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
                <Route path="/merge-pdf-online" element={<MergePDF />} />
                <Route path="/split-pdf-online" element={<SplitPDF />} />
                <Route path="/compress-pdf-online" element={<CompressPDF />} />

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
                <Route path="/tools/product-analysis" element={<ProductAnalysis />} />

                {/* Editor Tools */}
                <Route path="/tools/color-picker" element={<ColorPicker />} />
                <Route path="/tools/text-editor" element={<TextEditor />} />
                <Route path="/tools/json-editor" element={<JSONEditor />} />
                <Route path="/tools/csv-editor" element={<CSVEditor mode="editor" mode_name="editor" />} />
                <Route path="/tools/html-editor" element={<HTMLEditor />} />
                <Route path="/tools/css-editor" element={<CSSEditor />} />
                <Route path="/tools/markdown-editor" element={<MarkdownEditor mode="editor" />} />
                <Route path="/tools/social-scheduler" element={<SocialScheduler mode="scheduler" />} />
                <Route path="/tools/image-background-remover" element={<ImageBackgroundRemover mode="remover" />} />
                <Route path="/tools/ai-image-editor" element={<AIImageEditor mode="editor" />} />
                <Route path="/tools/video-editor" element={<VideoEditor mode="editor" />} />

                {/* Calculator Tools */}
                <Route path="/tools/calculator" element={<Calculator mode="calc" />} />
                <Route path="/tools/percentage-calculator" element={<PercentageCalculator mode="calc" />} />
                <Route path="/tools/bmi-calculator" element={<BMICalculator mode="calc" />} />
                <Route path="/tools/loan-calculator" element={<LoanCalculator mode="calc" />} />
                <Route path="/tools/age-calculator" element={<AgeCalculator mode="calc" />} />

                {/* Formatters */}
                <Route path="/tools/json-formatter" element={<JSONFormatter mode="formatter" />} />
                <Route path="/tools/xml-formatter" element={<XMLFormatter mode="formatter" />} />
                <Route path="/tools/sql-formatter" element={<SQLFormatter mode="formatter" />} />
                <Route path="/tools/html-formatter" element={<HTMLFormatter mode="formatter" />} />
                <Route path="/tools/css-formatter" element={<CSSFormatter mode="formatter" />} />

                {/* Validators */}
                <Route path="/tools/json-validator" element={<JSONEditor mode="validator" />} />
                <Route path="/tools/xml-validator" element={<XMLFormatter mode="validator" mode_name="validator" />} />
                <Route path="/tools/password-validator" element={<PasswordValidator mode="validator" />} />
                <Route path="/tools/email-validator" element={<EmailValidator mode="validator" />} />

                {/* Games */}
                <Route path="/tools/pool-shooter" element={<PoolBubbles mode="game" />} />


                {/* Encoders */}
                <Route path="/tools/url-encoder" element={<URLEncoder mode="encoder" />} />
                <Route path="/tools/text-to-image" element={<TextToImage mode="generator" />} />
                <Route path="/tools/thumbnail-generator" element={<ThumbnailGenerator mode="generator" />} />
                <Route path="/tools/text-to-video" element={<TextToVideo mode="generator" />} />
                <Route path="/tools/ai-prompt-assistant" element={<AIPromptAssistant mode="assistant" />} />
                <Route path="/tools/ai-website-generator" element={<AIWebsiteGenerator mode="generator" />} />
                <Route path="/tools/ai-tool-generator" element={<AIToolGenerator mode="generator" />} />
                <Route path="/tools/ip-address-lookup" element={<IPAddressLookup mode="lookup" />} />
                <Route path="/tools/whois-lookup" element={<WhoisLookup mode="lookup" />} />
                <Route path="/tools/internet-speed-test" element={<InternetSpeedTest mode="test" />} />
                <Route path="/tools/image-compressor" element={<ImageCompressor mode="compressor" />} />
                <Route path="/tools/resume-builder" element={<ResumeBuilder mode="builder" />} />
                <Route path="/tools/ocr-converter" element={<OCRConverter mode="converter" />} />

                {/* AI PDF Tools */}
                <Route path="/tools/chat-with-pdf" element={<ChatWithPDF mode="tool" />} />
                <Route path="/tools/pdf-summarizer" element={<PDFSummarizer mode="tool" />} />
                <Route path="/tools/pdf-quiz-generator" element={<PDFQuizGenerator mode="tool" />} />
                <Route path="/tools/pdf-study-notes" element={<PDFStudyNotes mode="tool" />} />
                <Route path="/tools/pdf-translator" element={<PDFTranslator mode="tool" />} />
                <Route path="/tools/image-resizer" element={<ImageResizer mode="tool" />} />
                <Route path="/tools/text-to-handwriting" element={<TextToHandwriting mode="tool" />} />
                <Route path="/tools/number-flow" element={<NumberFlow mode="tool" />} />
                <Route path="/tools/ai-remix-suite" element={<AIRemixSuite mode="suite" />} />
                <Route path="/tools/smart-pdf" element={<SmartPDF mode="tool" />} />
                <Route path="/tools/pdf-hub" element={<SmartPDFHub mode="hub" />} />
                <Route path="/tools/axevora-circle" element={<AxevoraCircle mode="circle" />} />
                <Route path="/tools/axevora-dedications" element={<AxevoraDedications mode="dedications" />} />
                <Route path="/tools/axevora-live-rooms" element={<AxevoraLiveRooms mode="rooms" />} />
                <Route path="/tools/axevora-spotlight" element={<AxevoraSpotlight mode="spotlight" />} />
                <Route path="/tools/ai-command-center" element={<AICommandCenter mode="center" />} />
                <Route path="/tools/battle-lab" element={<BattleLab mode="lab" />} />

                {/* AI Social Media Tools */}
                <Route path="/tools/ai-caption-generator" element={<AICaptionGenerator mode="gen" />} />
                <Route path="/tools/ai-hashtag-generator" element={<AIHashtagGenerator mode="gen" />} />
                <Route path="/tools/ai-reel-script-generator" element={<AIReelScriptGenerator mode="gen" />} />
                <Route path="/tools/tech-versus" element={
                  <SimpleErrorBoundary>
                    <TechVersus mode="versus" />
                  </SimpleErrorBoundary>
                } />
                <Route path="/tools/software-versus" element={<SoftwareVersus mode="versus" />} />
                <Route path="/tools/nutrition-versus" element={<NutritionVersus mode="versus" />} />
                <Route path="/tools/ai-thumbnail-text-generator" element={<AIThumbnailTextGenerator mode="gen" />} />
                <Route path="/tools/ai-bio-generator" element={<AIBioGenerator mode="gen" />} />
                <Route path="/tools/ai-blog-generator" element={<AIBlogGeneratorPage mode="gen" />} />

                {/* Dev Tools */}
                <Route path="/tools/windows-cmd-gen" element={<WindowsCommandGenerator mode="gen" />} />
                <Route path="/tools/linux-cmd-gen" element={<LinuxCommandGenerator mode="gen" />} />
                <Route path="/tools/mac-cmd-gen" element={<MacCommandGenerator mode="gen" />} />
                <Route path="/tools/android-adb-gen" element={<AndroidCommandGenerator mode="gen" />} />

                {/* Games */}
                <Route path="/tools/typing-speed-test" element={<TypingSpeedTest mode="game" />} />
                <Route path="/tools/2048-game" element={<Game2048 mode="game" />} />
                <Route path="/tools/click-speed-test" element={<ClickSpeedTest mode="game" />} />
                <Route path="/tools/reaction-time-test" element={<ReactionTimeTest mode="game" />} />
                <Route path="/tools/memory-match-game" element={<MemoryMatchGame mode="game" />} />
                <Route path="/tools/math-speed-challenge" element={<MathSpeedChallenge mode="game" />} />

                {/* Apps Support Pages */}
                <Route path="/apps/neon-block-puzzle/privacy" element={<NeonBlockPuzzlePrivacy />} />
                <Route path="/apps/2048-saga-jewel-puzzle/privacy" element={<Game2048SagaPrivacy />} />

                <Route path="/sitemap" element={<Sitemap />} />

                {/* Deals Module Routes */}
                <Route path="/deals" element={<DealsHome />} />
                <Route path="/deals/trending" element={<TrendingDeals />} />
                <Route path="/deals/categories" element={<DealsCategories />} />
                <Route path="/deals/product/:id" element={<ProductDetails />} />
                <Route path="/deals/article/:id" element={<ArticleDetails />} />

                {/* Admin Routes */}
                <Route path="/admin/blog" element={<AdminRouteGuard><BlogManager /></AdminRouteGuard>} />
                <Route path="/admin/battles" element={<AdminRouteGuard><BattleManager /></AdminRouteGuard>} />

                {/* Universal CMS Engine Admin Routes */}
                <Route path="/admin/cms" element={<AdminRouteGuard><CMSDashboard /></AdminRouteGuard>} />
                <Route path="/admin/cms/content/:contentType" element={<AdminRouteGuard><ContentManager /></AdminRouteGuard>} />
                <Route path="/admin/cms/content/:contentType/new" element={<AdminRouteGuard><ContentEditor /></AdminRouteGuard>} />
                <Route path="/admin/cms/content/:contentType/edit/:id" element={<AdminRouteGuard><ContentEditor /></AdminRouteGuard>} />

                {/* Universal Taxonomy Engine Admin Routes */}
                <Route path="/admin/taxonomy" element={<AdminRouteGuard><TaxonomyDashboard /></AdminRouteGuard>} />

                {/* Canonical Product Engine Admin Routes */}
                <Route path="/admin/products" element={<AdminRouteGuard><ProductDashboard /></AdminRouteGuard>} />

                {/* Commerce Engine Admin Routes */}
                <Route path="/admin/commerce" element={<AdminRouteGuard><CommerceDashboard /></AdminRouteGuard>} />
                <Route path="/admin/commerce/publish" element={<AdminRouteGuard><CommercePublisher /></AdminRouteGuard>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SimpleErrorBoundary>
        </BrowserRouter>
        {/* <AdMobBanner /> */}
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider >
);

export default App;
