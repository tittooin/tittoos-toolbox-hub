
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
          <Route path="/tools/pdf-converter" element={<PDFConverter />} />
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/qr-generator" element={<QRGenerator />} />
          <Route path="/tools/color-picker" element={<ColorPicker />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/text-analyzer" element={<TextAnalyzer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
