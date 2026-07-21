import { useState, useEffect } from "react";
import { 
  Link2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  BarChart3, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  Info, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import ToolTemplate from "@/components/ToolTemplate";
import { SmartProductAnalysisResult } from "../../modules/commerce/resolver/types";

const loadingMessages = [
  "Analyzing product...",
  "Checking available product information...",
  "Finding comparable products...",
  "Preparing comparison...",
];

const ProductAnalysis = () => {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [result, setResult] = useState<SmartProductAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Smart Product Analysis & Recommendation | Axevora";
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    setErrorType(null);
    setResult(null);

    try {
      const response = await fetch("/api/product-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: urlInput.trim(),
          comparisonLimit: 3,
          intent: "BEST_OVERALL",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during analysis");
      }

      if (data.status === "FAILED") {
        const errorMsg = data.warnings?.join(", ") || "Analysis failed to resolve the product.";
        setError(errorMsg);
        setErrorType(data.type || "ANALYSIS_FAILED");
      } else {
        setResult(data);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to run analysis.";
      setError(errMsg);
      if (err && typeof err === 'object' && 'type' in err) {
        setErrorType((err as { type: string }).type);
      }
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (conf?: "HIGH" | "MEDIUM" | "LOW") => {
    if (conf === "HIGH") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (conf === "MEDIUM") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-rose-500/10 text-rose-500 border-rose-500/20";
  };

  const getCompletenessLabel = (completeness?: string) => {
    switch (completeness) {
      case "IDENTITY_ONLY": return "Identity Only";
      case "BASIC": return "Basic Information";
      case "COMMERCE_READY": return "Commerce Ready";
      case "COMPARISON_READY": return "Comparison Ready";
      default: return completeness || "Unknown";
    }
  };

  const getCompletenessColor = (completeness?: string) => {
    switch (completeness) {
      case "COMPARISON_READY": return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "COMMERCE_READY": return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "BASIC": return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "PARTIAL": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "SKIPPED": return <Info className="h-4 w-4 text-muted-foreground" />;
      case "FAILED": return <XCircle className="h-4 w-4 text-rose-500" />;
      default: return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMerchantName = (id?: string) => {
    if (!id) return "";
    if (id === "amazon_in") return "Amazon India";
    return id.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  // Safe reference link extraction (neutral wording, original URL is safe)
  const productReferenceUrl = result?.productIntelligence?.identity.resolvedUrl || 
                               result?.productIntelligence?.identity.canonicalProductUrl ||
                               result?.productIntelligence?.identity.inputUrl;

  return (
    <ToolTemplate
      title="Smart Product Analysis"
      description="Paste a product link to extract intelligence, inspect available catalog details, view comparable specs, and evaluate buy recommendations."
      icon={BarChart3}
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Analysis Form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/50 via-primary to-transparent opacity-50" />
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Product Link Analyzer</CardTitle>
            <CardDescription>
              Submit an Amazon India link to instantly trigger product identification and details extraction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="Paste product link (e.g., https://www.amazon.in/dp/...) "
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={loading}
                  className="pl-9 h-11 border-border/80 bg-background/50 focus-visible:ring-primary"
                  required
                />
              </div>
              <Button type="submit" disabled={loading || !urlInput.trim()} className="h-11 px-6 font-semibold shadow-sm transition-all hover:shadow">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Analyze
                  </span>
                )}
              </Button>
            </form>

            {loading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                <span>{loadingMessages[loadingMessageIndex]}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="border-rose-500/25 bg-rose-500/10 shadow-sm">
            <XCircle className="h-4 w-4 text-rose-500" />
            <AlertTitle className="font-semibold">Analysis Error</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              <p className="font-medium">{error}</p>
              {errorType === "UNTRUSTED_SHORT_LINK_HOST" && (
                <p className="text-xs text-muted-foreground mt-2 border-t border-rose-500/10 pt-2">
                  Security Warning: The submitted host name is untrusted for public domain resolution. Only verified hosts (e.g. amzn.to) are permitted.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Result UI */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Warning Alerts Banner */}
            {result.warnings && result.warnings.length > 0 && (
              <Alert variant="default" className="border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="font-semibold text-sm">Pipeline Notice</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                    {result.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Stages Diagnostic Progress */}
            <Card className="border-border/40 bg-card/30">
              <CardHeader className="py-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pipeline Stage Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "URL Resolution", status: result.stages.resolution },
                    { label: "Product Facts", status: result.stages.intelligence },
                    { label: "Candidate Discovery", status: result.stages.discovery },
                    { label: "Recommendation Engine", status: result.stages.comparison }
                  ].map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-background/30 p-2.5 rounded-lg border border-border/20">
                      {getStageStatusIcon(stage.status)}
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-foreground truncate">{stage.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stage.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Product Info and Details */}
            {result.productIntelligence && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Target Product Description & Identity Card */}
                <Card className="md:col-span-2 border-border/50 bg-card/40 flex flex-col md:flex-row gap-6 p-6">
                  
                  {/* Product Image component if exists */}
                  {result.productIntelligence.productFacts.mediaUrls?.value?.[0] && (
                    <div className="w-full md:w-44 h-44 flex-shrink-0 bg-white dark:bg-zinc-950 border border-border/40 rounded-lg overflow-hidden flex items-center justify-center p-2.5">
                      <img 
                        src={result.productIntelligence.productFacts.mediaUrls.value[0]} 
                        alt={result.productIntelligence.productFacts.title?.value || "Product Image"} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {result.productIntelligence.identity.merchantId && (
                          <Badge variant="outline" className="uppercase text-[9px] font-bold tracking-wide">
                            {getMerchantName(result.productIntelligence.identity.merchantId)}
                          </Badge>
                        )}
                        <Badge variant="outline" className={getCompletenessColor(result.productIntelligence.completeness)}>
                          {getCompletenessLabel(result.productIntelligence.completeness)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
                        {result.productIntelligence.productFacts.title?.value || "Product Details Extracted"}
                      </CardTitle>
                    </div>

                    {result.productIntelligence.productFacts.description?.value && (
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Product Summary</div>
                        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed truncate-3-lines">
                          {result.productIntelligence.productFacts.description.value}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Brand Name</div>
                        <p className="text-xs font-semibold text-foreground/90">
                          {result.productIntelligence.productFacts.brandId?.value || 
                           result.productIntelligence.taxonomyHints?.rawBrand || 
                           "Generic / Brand Not Resolved"}
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Category Classification</div>
                        <p className="text-xs font-semibold text-foreground/90">
                          {result.productIntelligence.productFacts.taxonomyIds?.value?.[0] || 
                           result.productIntelligence.taxonomyHints?.rawCategory || 
                           "Unresolved Category"}
                        </p>
                      </div>
                    </div>

                    {/* Neutral Reference link instead of blind purchase CTA */}
                    {productReferenceUrl && (
                      <div className="pt-2">
                        <a 
                          href={productReferenceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                        >
                          View source merchant page
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Commerce Facts Card */}
                <Card className="border-border/50 bg-card/40 flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-md font-bold">Commerce Data</CardTitle>
                      <CardDescription className="text-xs">Verified list specifications</CardDescription>
                    </div>

                    {/* Price rendering (Never show ₹0 if missing) */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Price Estimation</div>
                      {result.productIntelligence.commerceFacts.price?.value && 
                       result.productIntelligence.commerceFacts.price.value.amount > 0 ? (
                        <div>
                          <div className="text-3xl font-extrabold text-primary tracking-tight">
                            {result.productIntelligence.commerceFacts.price.value.currency === "INR" ? "₹" : ""}
                            {result.productIntelligence.commerceFacts.price.value.amount.toLocaleString()}
                          </div>
                          {result.productIntelligence.commerceFacts.price.confidence && (
                            <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                              Price Verified ({result.productIntelligence.commerceFacts.price.confidence} Confidence)
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic py-1 flex items-center gap-1">
                          <Info className="h-3.5 w-3.5" />
                          Price details currently unavailable
                        </div>
                      )}
                    </div>

                    {/* Availability rendering (Never assume false if missing) */}
                    {result.productIntelligence.commerceFacts.availability?.value !== undefined && (
                      <div className="space-y-1 border-t border-border/20 pt-3">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Availability Status</div>
                        <Badge 
                          variant="secondary" 
                          className={
                            result.productIntelligence.commerceFacts.availability.value 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }
                        >
                          {result.productIntelligence.commerceFacts.availability.value ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Recommendation Result Presentation Box */}
            {result.comparisonResult?.recommendation && (
              <Card className="border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-bold">Purchase Analysis Insight</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Recommendation Outcome
                    </div>
                    
                    {/* Render exact recommendation outcomes based on rules */}
                    <div className="text-lg font-bold tracking-tight text-foreground">
                      {result.comparisonResult.recommendation.outcome === "WINNER" ? (
                        <span className="flex items-center gap-2">
                          <span>🏆 Winner Recommended:</span>
                          <span className="text-primary underline decoration-dotted underline-offset-4">
                            {result.comparisonResult.recommendation.winnerId}
                          </span>
                        </span>
                      ) : result.comparisonResult.recommendation.outcome === "NO_CLEAR_WINNER" ? (
                        <span className="text-amber-500 flex items-center gap-1.5">
                          ⚖️ Closely Matched Alternatives (No Clear Winner)
                        </span>
                      ) : result.comparisonResult.recommendation.outcome === "INSUFFICIENT_EVIDENCE" ? (
                        <span className="text-rose-500 flex items-center gap-1.5">
                          🔍 Insufficient Evidence for Recommendation
                        </span>
                      ) : result.comparisonResult.recommendation.outcome === "VALUE_RECOMMENDATION_UNAVAILABLE" ? (
                        <span className="text-amber-500 flex items-center gap-1.5">
                          🏷️ Value Recommendation Unavailable
                        </span>
                      ) : (
                        <span>Comparison Analysis Completed</span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mt-2.5">
                      {result.comparisonResult.recommendation.explanation}
                    </p>
                  </div>

                  {/* Highlight reasons logs */}
                  {result.comparisonResult.recommendation.reasons && 
                   result.comparisonResult.recommendation.reasons.length > 0 && (
                    <div className="space-y-2 border-t border-border/20 pt-3">
                      <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Key Recommendation Factors</h4>
                      <ul className="list-disc pl-5 text-xs space-y-1 text-foreground/80 leading-relaxed">
                        {result.comparisonResult.recommendation.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Score details */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className={getConfidenceColor(result.comparisonResult.confidence)}>
                      Confidence: {result.comparisonResult.confidence}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-semibold bg-muted text-muted-foreground border border-border/40">
                      Strategy Target: {result.comparisonResult.recommendation.intent}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pros & Cons Section */}
            {result.comparisonResult?.recommendation?.pros && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pros Card */}
                <Card className="border-border/50 bg-card/30">
                  <CardHeader className="pb-3 border-b border-border/10">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <ThumbsUp className="h-4 w-4" />
                      Pros Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {Object.entries(result.comparisonResult.recommendation.pros).map(([prodName, prosList]) => (
                      prosList && prosList.length > 0 && (
                        <div key={prodName} className="space-y-1.5">
                          <div className="text-xs font-bold text-foreground truncate">{prodName}</div>
                          <ul className="space-y-1">
                            {prosList.map((pro, index) => (
                              <li key={index} className="text-xs text-foreground/80 flex items-start gap-2">
                                <span className="text-emerald-500 font-bold select-none">✓</span>
                                <span className="leading-tight">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>

                {/* Cons Card */}
                <Card className="border-border/50 bg-card/30">
                  <CardHeader className="pb-3 border-b border-border/10">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-500">
                      <ThumbsDown className="h-4 w-4" />
                      Cons Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {Object.entries(result.comparisonResult.recommendation.cons).map(([prodName, consList]) => (
                      consList && consList.length > 0 && (
                        <div key={prodName} className="space-y-1.5">
                          <div className="text-xs font-bold text-foreground truncate">{prodName}</div>
                          <ul className="space-y-1">
                            {consList.map((con, index) => (
                              <li key={index} className="text-xs text-foreground/80 flex items-start gap-2">
                                <span className="text-rose-500 font-bold select-none">✗</span>
                                <span className="leading-tight">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Comparison Specifications Matrix Section */}
            <div>
              {result.comparisonResult && result.comparisonResult.dimensions && result.comparisonResult.dimensions.length > 0 ? (
                <Card className="border-border/50 bg-card/40 overflow-hidden shadow-sm">
                  <CardHeader className="border-b border-border/10 bg-muted/20">
                    <CardTitle className="text-base font-bold">Comparison Specifications Matrix</CardTitle>
                    <CardDescription className="text-xs">Direct technical fact check mapping</CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    {/* Desktop Matrix: Standard Grid Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border/30">
                            <th className="p-3.5 font-bold text-muted-foreground w-1/4">Attribute</th>
                            {result.comparisonResult.comparisonSet.map((prodName) => (
                              <th key={prodName} className="p-3.5 font-bold text-foreground text-center">
                                {prodName}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.comparisonResult.dimensions.map((dim) => (
                            <tr key={dim.name} className="border-b border-border/10 hover:bg-card/65 transition-colors">
                              <td className="p-3.5 font-semibold text-foreground/85">{dim.label}</td>
                              {result.comparisonResult!.comparisonSet.map((prodName) => {
                                const val = dim.values[prodName] || "UNKNOWN";
                                return (
                                  <td key={prodName} className="p-3.5 text-center text-foreground/90 font-medium">
                                    {val === "UNKNOWN" ? (
                                      <span className="text-muted-foreground/50 italic text-[11px]">Unavailable</span>
                                    ) : (
                                      val
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Stacked Cards Layout */}
                    <div className="md:hidden space-y-4 p-4">
                      {result.comparisonResult.comparisonSet.map((prodName) => (
                        <Card key={prodName} className="border-border/40 bg-background/40">
                          <CardHeader className="p-3 border-b border-border/10 bg-muted/10">
                            <CardTitle className="text-xs font-bold text-primary truncate">{prodName}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 space-y-2 text-xs">
                            {result.comparisonResult!.dimensions.map((dim) => {
                              const val = dim.values[prodName] || "UNKNOWN";
                              if (val === "UNKNOWN") return null; // Gracefully hide missing facts on mobile cards
                              return (
                                <div key={dim.name} className="flex justify-between items-start gap-4 border-b border-border/5 py-1.5 last:border-0">
                                  <span className="text-muted-foreground text-[11px] font-medium">{dim.label}</span>
                                  <span className="font-semibold text-foreground text-right">{val}</span>
                                </div>
                              );
                            })}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* NO_COMPARABLE_PRODUCTS state - product summary is visible, comparison is shown as unavailable */
                <Card className="border-dashed border-border/80 bg-card/15 shadow-none">
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2.5 text-amber-500/70" />
                    <p className="text-sm font-semibold text-foreground/90">Specification Comparison Unavailable</p>
                    <p className="text-xs text-muted-foreground/80 mt-1 max-w-md mx-auto">
                      {result.comparableDiscovery?.status === "NO_COMPARABLE_PRODUCTS" 
                        ? "No comparable items match this product's category in the catalog to generate a specifications matrix." 
                        : "Insufficient features or specifications available for comparison matrix building."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        )}
      </div>
    </ToolTemplate>
  );
};

export default ProductAnalysis;
