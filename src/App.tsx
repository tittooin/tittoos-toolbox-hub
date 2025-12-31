
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from "react";
import SimpleErrorBoundary from "./components/SimpleErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages for better performance
const Categories = lazy(() => import("./pages/Categories"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const AllTools = lazy(() => import("./pages/AllTools"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Attributions = lazy(() => import("./pages/Attributions"));
const Blog = lazy(() => import("./pages/Blog"));
const Author = lazy(() => import("./pages/Author"));
const SubmitBlog = lazy(() => import("./pages/SubmitBlog"));

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
// const ToolPoster = lazy(() => import("./pages/tools/ToolPoster")); 
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

// Games
const TypingSpeedTest = lazy(() => import("./pages/tools/TypingSpeedTest"));
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

// Dev Tools
const WindowsCommandGenerator = lazy(() => import("./pages/tools/WindowsCommandGenerator"));
const LinuxCommandGenerator = lazy(() => import("./pages/tools/LinuxCommandGenerator"));
const MacCommandGenerator = lazy(() => import("./pages/tools/MacCommandGenerator"));
const AndroidCommandGenerator = lazy(() => import("./pages/tools/AndroidCommandGenerator"));

// Admin
const BlogManager = lazy(() => import("./pages/admin/BlogManager"));
const BattleManager = lazy(() => import("./pages/admin/BattleManager"));

// App Support
const NeonBlockPuzzlePrivacy = lazy(() => import("./pages/apps/NeonBlockPuzzlePrivacy"));
const Sitemap = lazy(() => import("./pages/Sitemap"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SimpleErrorBoundary>
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
                <Route path="/submit-blog" element={<SubmitBlog />} />

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
                {/* <Route path="/promo/poster" element={<Suspense fallback={<div>Loading Poster Generator...</div>}><ToolPoster /></Suspense>} /> */}
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

                {/* Validators */}
                <Route path="/tools/json-validator" element={<JSONEditor mode="validator" />} />
                <Route path="/tools/xml-validator" element={<XMLFormatter mode="validator" />} />
                <Route path="/tools/password-validator" element={<PasswordValidator />} />
                <Route path="/tools/email-validator" element={<EmailValidator />} />


                {/* Encoders */}
                <Route path="/tools/url-encoder" element={<URLEncoder />} />
                <Route path="/tools/text-to-image" element={<TextToImage />} />
                <Route path="/tools/thumbnail-generator" element={<ThumbnailGenerator />} />
                <Route path="/tools/text-to-video" element={<TextToVideo />} />
                <Route path="/tools/ai-prompt-assistant" element={<AIPromptAssistant />} />
                <Route path="/tools/ai-website-generator" element={<AIWebsiteGenerator />} />
                <Route path="/tools/ai-tool-generator" element={<AIToolGenerator />} />
                <Route path="/tools/ip-address-lookup" element={<IPAddressLookup />} />
                <Route path="/tools/whois-lookup" element={<WhoisLookup />} />
                <Route path="/tools/internet-speed-test" element={<InternetSpeedTest />} />
                <Route path="/tools/image-compressor" element={<ImageCompressor />} />
                <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
                <Route path="/tools/ocr-converter" element={<OCRConverter />} />

                {/* AI PDF Tools */}
                <Route path="/tools/chat-with-pdf" element={<ChatWithPDF />} />
                <Route path="/tools/pdf-summarizer" element={<PDFSummarizer />} />
                <Route path="/tools/pdf-quiz-generator" element={<PDFQuizGenerator />} />
                <Route path="/tools/pdf-study-notes" element={<PDFStudyNotes />} />
                <Route path="/tools/pdf-translator" element={<PDFTranslator />} />
                <Route path="/tools/image-resizer" element={<ImageResizer />} />
                <Route path="/tools/text-to-handwriting" element={<TextToHandwriting />} />
                <Route path="/tools/number-flow" element={<NumberFlow />} />

                {/* AI Social Media Tools */}
                <Route path="/tools/ai-caption-generator" element={<AICaptionGenerator />} />
                <Route path="/tools/ai-hashtag-generator" element={<AIHashtagGenerator />} />
                <Route path="/tools/ai-reel-script-generator" element={<AIReelScriptGenerator />} />
                <Route path="/tools/tech-versus" element={
                  <SimpleErrorBoundary>
                    <TechVersus />
                  </SimpleErrorBoundary>
                } />
                <Route path="/tools/software-versus" element={<SoftwareVersus />} />
                <Route path="/tools/nutrition-versus" element={<NutritionVersus />} />
                <Route path="/tools/ai-thumbnail-text-generator" element={<AIThumbnailTextGenerator />} />
                <Route path="/tools/ai-bio-generator" element={<AIBioGenerator />} />

                {/* Dev Tools */}
                <Route path="/tools/windows-cmd-gen" element={<WindowsCommandGenerator />} />
                <Route path="/tools/linux-cmd-gen" element={<LinuxCommandGenerator />} />
                <Route path="/tools/mac-cmd-gen" element={<MacCommandGenerator />} />
                <Route path="/tools/android-adb-gen" element={<AndroidCommandGenerator />} />

                {/* Games */}
                <Route path="/tools/typing-speed-test" element={<TypingSpeedTest />} />
                <Route path="/tools/2048-game" element={<Game2048 />} />
                <Route path="/tools/click-speed-test" element={<ClickSpeedTest />} />
                <Route path="/tools/reaction-time-test" element={<ReactionTimeTest />} />
                <Route path="/tools/memory-match-game" element={<MemoryMatchGame />} />
                <Route path="/tools/math-speed-challenge" element={<MathSpeedChallenge />} />

                {/* Apps Support Pages */}
                <Route path="/apps/neon-block-puzzle/privacy" element={<NeonBlockPuzzlePrivacy />} />

                <Route path="/sitemap" element={<Sitemap />} />

                {/* Admin Routes */}
                <Route path="/admin/blog" element={<BlogManager />} />
                <Route path="/admin/battles" element={<BattleManager />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SimpleErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider >
);

export default App;
