import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from "react";
import SimpleErrorBoundary from "./components/SimpleErrorBoundary";
const ADS_ENABLED = false; // Toggle this when AdSense is live

// Lazily load pages to reduce initial bundle size
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Categories = lazy(() => import("./pages/Categories"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const AllTools = lazy(() => import("./pages/AllTools"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Attributions = lazy(() => import("./pages/Attributions"));
const Blog = lazy(() => import("./pages/Blog"));
const Author = lazy(() => import("./pages/Author"));
const SubmitBlog = lazy(() => import("./pages/SubmitBlog"));
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
const PasswordGenerator = lazy(() => import("./pages/tools/PasswordGenerator"));
const QRGenerator = lazy(() => import("./pages/tools/QRGenerator"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const ImageConverter = lazy(() => import("./pages/tools/ImageConverter"));
const PDFToEPUB = lazy(() => import("./pages/tools/PDFToEPUB"));
const PDFToImage = lazy(() => import("./pages/tools/PDFToImage"));
const VideoToShorts = lazy(() => import("./pages/tools/VideoToShorts"));
const ToolPoster = lazy(() => import('./pages/promo/ToolPoster'));
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
const ThumbnailGenerator = lazy(() => import("./pages/tools/ThumbnailGenerator"));
const TextToImage = lazy(() => import("./pages/tools/TextToImage"));
const TextToVideo = lazy(() => import("./pages/tools/TextToVideo"));
const AIPromptAssistant = lazy(() => import("./pages/tools/AIPromptAssistant"));
const AIWebsiteGenerator = lazy(() => import("./pages/tools/AIWebsiteGenerator"));
const AIToolGenerator = lazy(() => import("./pages/tools/AIToolGenerator"));
const ImageBackgroundRemover = lazy(() => import("./pages/tools/ImageBackgroundRemover"));
const WebsiteSpeedChecker = lazy(() => import("./pages/tools/WebsiteSpeedChecker"));
const AIImageEditor = lazy(() => import("./pages/tools/AIImageEditor"));
const VideoEditor = lazy(() => import("./pages/tools/VideoEditor"));
const OCRConverter = lazy(() => import("./pages/tools/OCRConverter"));
const ResumeBuilder = lazy(() => import("./pages/tools/ResumeBuilder"));
const MergePDF = lazy(() => import("./pages/tools/MergePDF"));
const SplitPDF = lazy(() => import("./pages/tools/SplitPDF"));
const CompressPDF = lazy(() => import("./pages/tools/CompressPDF"));
const IPAddressLookup = lazy(() => import("./pages/tools/IPAddressLookup"));
const WhoisLookup = lazy(() => import("./pages/tools/WhoisLookup"));
const InternetSpeedTest = lazy(() => import("./pages/tools/InternetSpeedTest"));
const TypingSpeedTest = lazy(() => import("./pages/tools/TypingSpeedTest"));
const Game2048 = lazy(() => import("./pages/tools/Game2048"));
import Game2048Debug from "./pages/tools/Game2048Debug";
const ClickSpeedTest = lazy(() => import("./pages/tools/ClickSpeedTest"));
const ReactionTimeTest = lazy(() => import("./pages/tools/ReactionTimeTest"));
const MemoryMatchGame = lazy(() => import("./pages/tools/MemoryMatchGame"));
const MathSpeedChallenge = lazy(() => import("./pages/tools/MathSpeedChallenge"));
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor"));
const BlogManager = lazy(() => import("./pages/admin/BlogManager"));
const BattleManager = lazy(() => import("./pages/admin/BattleManager"));
const ChatWithPDF = lazy(() => import("./pages/tools/ChatWithPDF"));
const PDFSummarizer = lazy(() => import("./pages/tools/PDFSummarizer"));
const PDFQuizGenerator = lazy(() => import("./pages/tools/PDFQuizGenerator"));
const PDFStudyNotes = lazy(() => import("./pages/tools/PDFStudyNotes"));
const PDFTranslator = lazy(() => import("./pages/tools/PDFTranslator"));
const ImageResizer = lazy(() => import("./pages/tools/ImageResizer"));
const TextToHandwriting = lazy(() => import("./pages/tools/TextToHandwriting"));
const NumberFlow = lazy(() => import("./pages/tools/NumberFlow"));
const WindowsCommandGenerator = lazy(() => import("./pages/tools/WindowsCommandGenerator"));
const LinuxCommandGenerator = lazy(() => import("./pages/tools/LinuxCommandGenerator"));
const MacCommandGenerator = lazy(() => import("./pages/tools/MacCommandGenerator"));
const AndroidCommandGenerator = lazy(() => import("./pages/tools/AndroidCommandGenerator"));
const NeonBlockPuzzlePrivacy = lazy(() => import("./pages/apps/NeonBlockPuzzlePrivacy"));

const AICaptionGenerator = lazy(() => import("./pages/tools/AICaptionGenerator"));
const AIHashtagGenerator = lazy(() => import("./pages/tools/AIHashtagGenerator"));
const AIReelScriptGenerator = lazy(() => import("./pages/tools/AIReelScriptGenerator"));
const AIThumbnailTextGenerator = lazy(() => import("./pages/tools/AIThumbnailTextGenerator"));

const AIBioGenerator = lazy(() => import("./pages/tools/AIBioGenerator"));

// Validators
const PasswordValidator = lazy(() => import("./pages/tools/PasswordValidator"));
const EmailValidator = lazy(() => import("./pages/tools/EmailValidator"));


// Blog Category Pages
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
const TechVersus = lazy(() => import("./pages/versus/TechVersus"));
const SoftwareVersus = lazy(() => import("./pages/versus/SoftwareVersus"));
const NutritionVersus = lazy(() => import("./pages/versus/NutritionVersus"));

const DevToolsCategoryPage = lazy(() => import("./pages/blog-posts/dev-tools-category"));

const queryClient = new QueryClient();


// MINIMAL DEBUG APP
import React from 'react';

const App = () => {
  return (
    <div style={{ padding: 50, background: 'red', color: 'white', fontSize: 30 }}>
      <h1>NUCLEAR TEST</h1>
      <p>If you see this, React is working.</p>
      <p>The issue was in one of the Providers.</p>
    </div>
  );
};

export default App;

