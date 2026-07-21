import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Database
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PublishingWorkflow } from "@/workflows/PublishingWorkflow";
import merchantsData from "@/data/generated_merchants.json";

// Form state interface
interface PublisherFormState {
  // Step 1: Product Specs
  productName: string;
  productType: string;
  brandId: string;
  categoryId: string;
  shortDescription: string;
  longDescription: string;
  mediaUrls: string[];

  // Step 2: Store Listing Details
  merchantId: string;
  externalProductId: string;
  merchantProductUrl: string;

  // Step 3: Pricing & Affiliate Mappings
  priceAmount: string;
  originalPrice: string;
  currencyCode: string;
  affiliateNetworkRef: string;
  affiliateTrackingRef: string;
  manualAffiliateUrl: string;

  // Step 4: Editorial Content
  enableDeal: boolean;
  dealTitle: string;
  dealDescription: string;
  dealExpiryDate: string;
  dealIsTrending: boolean;

  enableArticle: boolean;
  articleTitle: string;
  articleExcerpt: string;
  articleCategory: string;
  articleContentHtml: string;
  articleAuthor: string;
  articleTags: string;
}

const initialFormState: PublisherFormState = {
  productName: "",
  productType: "physical",
  brandId: "",
  categoryId: "",
  shortDescription: "",
  longDescription: "",
  mediaUrls: [""],
  merchantId: "",
  externalProductId: "",
  merchantProductUrl: "",
  priceAmount: "",
  originalPrice: "",
  currencyCode: "INR",
  affiliateNetworkRef: "",
  affiliateTrackingRef: "",
  manualAffiliateUrl: "",
  enableDeal: false,
  dealTitle: "",
  dealDescription: "",
  dealExpiryDate: "",
  dealIsTrending: false,
  enableArticle: false,
  articleTitle: "",
  articleExcerpt: "",
  articleCategory: "Deals",
  articleContentHtml: "",
  articleAuthor: "Founder",
  articleTags: ""
};

const STORAGE_KEY = "axevora_commerce_publisher_draft";

const CommercePublisher = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PublisherFormState>(initialFormState);
  const [githubToken, setGithubToken] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    productId: string;
    listingId: string;
    affiliateId: string;
    articleSlug?: string;
  } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Load draft and GitHub Token on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
        toast.info("Draft auto-restored successfully!");
      } catch (e) {
        console.error("Failed to parse saved draft", e);
      }
    }

    const savedToken = localStorage.getItem("github_token");
    if (savedToken) {
      setGithubToken(savedToken);
    }
  }, []);

  // Save draft on changes (excluding token)
  useEffect(() => {
    // Check if form has dirty values to avoid saving initial empty state
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormState);
    if (isDirty) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Handle saving GitHub PAT separately
  const handleSaveGithubToken = (token: string) => {
    setGithubToken(token);
    localStorage.setItem("github_token", token);
    toast.success("GitHub Token saved to local storage!");
  };

  // Clear draft / reset form
  const handleClearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormState);
    setCurrentStep(1);
    setPublishResult(null);
    setPublishError(null);
    toast.success("Draft cleared and form reset!");
  };

  // Merchant-aware defaulting logic
  const handleMerchantChange = (merchantId: string) => {
    setFormData(prev => {
      const isAmazon = merchantId.toLowerCase().includes("amazon");
      
      let nextTrackingRef = prev.affiliateTrackingRef;
      let nextNetworkRef = prev.affiliateNetworkRef;

      if (isAmazon) {
        // Apply Amazon-specific defaults
        if (!prev.affiliateTrackingRef || prev.affiliateTrackingRef === "") {
          nextTrackingRef = "axevora06-21";
        }
        if (!prev.affiliateNetworkRef || prev.affiliateNetworkRef === "") {
          nextNetworkRef = "amazon_associates";
        }
      } else {
        // Clear if changing from Amazon to prevent stale configs carry-forward
        if (prev.affiliateTrackingRef === "axevora06-21") {
          nextTrackingRef = "";
        }
        if (prev.affiliateNetworkRef === "amazon_associates") {
          nextNetworkRef = "";
        }
      }

      return {
        ...prev,
        merchantId,
        affiliateTrackingRef: nextTrackingRef,
        affiliateNetworkRef: nextNetworkRef
      };
    });
  };

  // Step 1: Product Specifications validation
  const validateStep1 = () => {
    if (!formData.productName.trim()) {
      toast.error("Product name is required.");
      return false;
    }
    if (!formData.productType) {
      toast.error("Product type is required.");
      return false;
    }
    return true;
  };

  // Step 2: Store Listing Details validation
  const validateStep2 = () => {
    if (!formData.merchantId) {
      toast.error("Merchant selection is required.");
      return false;
    }
    if (!formData.externalProductId.trim()) {
      toast.error("External Product ID (ASIN / Code) is required.");
      return false;
    }
    if (!formData.merchantProductUrl.trim()) {
      toast.error("Merchant Product URL is required.");
      return false;
    }
    return true;
  };

  // Step 3: Pricing & Affiliate Mappings validation
  const validateStep3 = () => {
    if (!formData.priceAmount.trim() || isNaN(Number(formData.priceAmount)) || Number(formData.priceAmount) < 0) {
      toast.error("Please enter a valid positive Current Price.");
      return false;
    }
    if (formData.originalPrice.trim() && (isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) < 0)) {
      toast.error("Please enter a valid positive Original Price.");
      return false;
    }
    if (!formData.affiliateNetworkRef.trim()) {
      toast.error("Affiliate Network Reference is required.");
      return false;
    }
    if (!formData.affiliateTrackingRef.trim()) {
      toast.error("Affiliate Tracking Reference is required.");
      return false;
    }
    return true;
  };

  // Step 4: Editorial Content validation
  const validateStep4 = () => {
    if (formData.enableArticle) {
      if (!formData.articleTitle.trim()) {
        toast.error("Article Title is required when Create Article is enabled.");
        return false;
      }
      if (!formData.articleContentHtml.trim()) {
        toast.error("Article Content HTML is required when Create Article is enabled.");
        return false;
      }
    }
    return true;
  };

  // Handle steps navigation
  const handleNextStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();
    if (currentStep === 4) isValid = validateStep4();

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Ingestion publishing execution
  const handlePublish = async () => {
    if (!githubToken.trim()) {
      toast.error("GitHub PAT (Personal Access Token) is required to publish.");
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    setPublishResult(null);
    const toastId = toast.loading("Executing atomic Git ingestion on GitHub...");

    try {
      const workflow = new PublishingWorkflow(githubToken);
      
      const payload: any = {
        product: {
          name: formData.productName,
          type: formData.productType,
          brandId: formData.brandId || undefined,
          taxonomyIds: formData.categoryId ? [formData.categoryId] : [],
          shortDescription: formData.shortDescription || undefined,
          longDescription: formData.longDescription || undefined,
          mediaUrls: formData.mediaUrls.filter(Boolean)
        },
        listing: {
          merchantId: formData.merchantId,
          externalProductId: formData.externalProductId,
          merchantProductUrl: formData.merchantProductUrl
        },
        price: {
          amount: Number(formData.priceAmount),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          currencyCode: formData.currencyCode
        },
        affiliate: {
          networkRef: formData.affiliateNetworkRef,
          trackingRef: formData.affiliateTrackingRef,
          manualAffiliateUrl: formData.manualAffiliateUrl || undefined
        }
      };

      if (formData.enableDeal) {
        payload.deal = {
          title: formData.dealTitle || undefined,
          description: formData.dealDescription || undefined,
          expiryDate: formData.dealExpiryDate || undefined,
          isTrending: formData.dealIsTrending
        };
      }

      if (formData.enableArticle) {
        payload.cms = {
          title: formData.articleTitle,
          excerpt: formData.articleExcerpt || undefined,
          content: formData.articleContentHtml,
          category: formData.articleCategory || undefined,
          tags: formData.articleTags ? formData.articleTags.split(",").map(t => t.trim()).filter(Boolean) : [],
          author: formData.articleAuthor || undefined
        };
      }

      const result = await workflow.publish(payload);

      // Successfully published
      setPublishResult({
        productId: result.productId,
        listingId: result.listingId,
        affiliateId: result.affiliateId,
        articleSlug: formData.enableArticle ? formData.articleTitle.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') : undefined
      });

      toast.success("Manual Ingestion successfully completed!", { id: toastId });
      // Clear draft locally on success
      localStorage.removeItem(STORAGE_KEY);

    } catch (err: any) {
      console.error(err);
      setPublishError(err.message || "Manual Ingestion process failed. Please retry.");
      toast.error("Ingestion workflow failed.", { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  // Helper arrays for Step 1
  const productTypes = [
    { value: "physical", label: "Physical Product" },
    { value: "digital", label: "Digital Product" },
    { value: "service", label: "Service" },
    { value: "subscription", label: "Subscription" },
    { value: "bundle", label: "Bundle" },
    { value: "license", label: "License" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full w-fit mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Dynamic Ingestion Wizard
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Publish Product & Commerce Details
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Multi-step configuration wizard linked directly to the atomic git-backed publishing engine.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/commerce">Back to Dashboard</Link>
          </Button>
        </section>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>STEP {currentStep} OF 5: {
              currentStep === 1 ? "Product Specifications" :
              currentStep === 2 ? "Merchant & Listing" :
              currentStep === 3 ? "Pricing & Affiliate" :
              currentStep === 4 ? "Editorial Content" :
              "Review & Git Authorization"
            }</span>
            <span>{Math.round(((currentStep - 1) / 4) * 100)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Success/Error States */}
        {publishResult && (
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl text-green-600 font-bold">Ingestion Successful!</CardTitle>
              <CardDescription>
                Product details and commerce layers have been committed to GitHub repository.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground">
              <div className="rounded-xl border bg-card p-4 space-y-2 font-mono text-xs">
                <div><span className="text-muted-foreground">Canonical Product ID:</span> <span className="font-bold">{publishResult.productId}</span></div>
                <div><span className="text-muted-foreground">Merchant Listing ID:</span> <span className="font-bold">{publishResult.listingId}</span></div>
                <div><span className="text-muted-foreground">Affiliate Mapping ID:</span> <span className="font-bold">{publishResult.affiliateId}</span></div>
                {publishResult.articleSlug && (
                  <div><span className="text-muted-foreground">Editorial Article Link:</span> <Link to={`/blog/${publishResult.articleSlug}`} className="text-blue-600 font-bold hover:underline">/blog/{publishResult.articleSlug}</Link></div>
                )}
              </div>
              <div className="flex gap-4">
                <Button onClick={handleClearDraft} variant="outline" className="w-full">
                  Publish Another Product
                </Button>
                <Button asChild className="w-full">
                  <Link to="/admin/commerce">Commerce Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Publish Error Sheet */}
        {publishError && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                <AlertCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl text-destructive font-bold">Ingestion Failed</CardTitle>
              <CardDescription>
                An error occurred while executing the publishing workflow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground bg-card border rounded-lg p-3 font-mono text-xs">
                {publishError}
              </p>
              <div className="flex gap-4">
                <Button onClick={handlePublish} disabled={isPublishing} className="w-full">
                  {isPublishing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Retrying Publishing...
                    </>
                  ) : (
                    "Retry Publishing"
                  )}
                </Button>
                <Button onClick={() => setPublishError(null)} variant="outline" className="w-full">
                  Edit Form Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wizard Form Sheets */}
        {!publishResult && !publishError && (
          <Card className="bg-card shadow-sm border border-muted">
            <CardContent className="pt-6 space-y-6">

              {/* STEP 1: Product Specifications */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-lg font-bold text-foreground">Step 1: Product Specifications</h3>
                    <p className="text-xs text-muted-foreground">Fill in core specifications representing base brand catalog data.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Product Name <span className="text-destructive">*</span></label>
                    <Input 
                      placeholder="e.g. Apple iPhone 16 Pro (256GB)" 
                      value={formData.productName} 
                      onChange={e => setFormData({ ...formData, productName: e.target.value })} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Product Type <span className="text-destructive">*</span></label>
                      <select 
                        className="w-full h-10 border rounded-lg px-3 bg-background text-sm outline-none focus:border-primary"
                        value={formData.productType}
                        onChange={e => setFormData({ ...formData, productType: e.target.value })}
                      >
                        {productTypes.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Brand Name (Optional)</label>
                      <Input 
                        placeholder="e.g. Apple" 
                        value={formData.brandId} 
                        onChange={e => setFormData({ ...formData, brandId: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Category Class Reference (Optional)</label>
                    <Input 
                      placeholder="e.g. smartphones" 
                      value={formData.categoryId} 
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Short Description (Optional)</label>
                    <Input 
                      placeholder="e.g. Latest iOS flagship smartphone with Pro Camera system." 
                      value={formData.shortDescription} 
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Long Description / Specs (Optional)</label>
                    <Textarea 
                      placeholder="Add detailed bullet specifications or raw HTML overview here..."
                      rows={4}
                      value={formData.longDescription}
                      onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-foreground">Media URLs (Optional)</label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="xs" 
                        onClick={() => setFormData(prev => ({ ...prev, mediaUrls: [...prev.mediaUrls, ""] }))}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add URL
                      </Button>
                    </div>

                    {formData.mediaUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          placeholder="e.g. https://axevora.com/assets/images/iphone-image.png" 
                          value={url}
                          onChange={e => {
                            const newUrls = [...formData.mediaUrls];
                            newUrls[index] = e.target.value;
                            setFormData({ ...formData, mediaUrls: newUrls });
                          }}
                        />
                        {formData.mediaUrls.length > 1 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => {
                              const newUrls = formData.mediaUrls.filter((_, idx) => idx !== index);
                              setFormData({ ...formData, mediaUrls: newUrls });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Store Listing Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-lg font-bold text-foreground">Step 2: Store Listing Details</h3>
                    <p className="text-xs text-muted-foreground">Select merchant store identity and map external product descriptors.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Merchant ID <span className="text-destructive">*</span></label>
                    <select
                      className="w-full h-10 border rounded-lg px-3 bg-background text-sm outline-none focus:border-primary"
                      value={formData.merchantId}
                      onChange={e => handleMerchantChange(e.target.value)}
                    >
                      <option value="">Select Target Merchant...</option>
                      {merchantsData.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">External Product ID (ASIN / SKU Code) <span className="text-destructive">*</span></label>
                    <Input 
                      placeholder="e.g. B0D94RQL4N" 
                      value={formData.externalProductId} 
                      onChange={e => setFormData({ ...formData, externalProductId: e.target.value })} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Normal Product URL <span className="text-destructive">*</span></label>
                    <Input 
                      placeholder="e.g. https://www.amazon.in/dp/B0D94RQL4N" 
                      value={formData.merchantProductUrl} 
                      onChange={e => setFormData({ ...formData, merchantProductUrl: e.target.value })} 
                    />
                    <span className="text-[10px] text-muted-foreground leading-relaxed block">
                      Normal non-affiliate product landing URL on the store. Avoid pasting pre-formatted affiliate tracking tags inside this field.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: Pricing & Affiliate Mappings */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-lg font-bold text-foreground">Step 3: Pricing & Affiliate Mappings</h3>
                    <p className="text-xs text-muted-foreground">Configure retail pricing rules and append affiliate tracking properties.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Current Price <span className="text-destructive">*</span></label>
                      <Input 
                        type="number"
                        placeholder="e.g. 119900" 
                        value={formData.priceAmount} 
                        onChange={e => setFormData({ ...formData, priceAmount: e.target.value })} 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Original Price (MRP - Optional)</label>
                      <Input 
                        type="number"
                        placeholder="e.g. 129900" 
                        value={formData.originalPrice} 
                        onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Currency Code</label>
                      <Input 
                        placeholder="INR" 
                        value={formData.currencyCode} 
                        onChange={e => setFormData({ ...formData, currencyCode: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Affiliate Network Reference <span className="text-destructive">*</span></label>
                      <Input 
                        placeholder="e.g. amazon_associates" 
                        value={formData.affiliateNetworkRef} 
                        onChange={e => setFormData({ ...formData, affiliateNetworkRef: e.target.value })} 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground">Affiliate Tracking ID <span className="text-destructive">*</span></label>
                      <Input 
                        placeholder="e.g. axevora06-21" 
                        value={formData.affiliateTrackingRef} 
                        onChange={e => setFormData({ ...formData, affiliateTrackingRef: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Manual Tracked Affiliate URL (Optional Overrides)</label>
                    <Input 
                      placeholder="e.g. https://www.amazon.in/dp/B0D94RQL4N?tag=axevora06-21" 
                      value={formData.manualAffiliateUrl} 
                      onChange={e => setFormData({ ...formData, manualAffiliateUrl: e.target.value })} 
                    />
                    <span className="text-[10px] text-muted-foreground leading-relaxed block">
                      Founder-provided actual tracked Affiliate Destination URL. If this manual link is entered, CTA redirections will override dynamic builder logic and route directly to it.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: Editorial Content */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b pb-2">
                    <h3 className="text-lg font-bold text-foreground">Step 4: Editorial & Articles (Optional)</h3>
                    <p className="text-xs text-muted-foreground">Select whether to configure promotional deal highlights and create CMS review articles.</p>
                  </div>

                  {/* Deal Toggle */}
                  <div className="space-y-4 border p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold">Configure Deal Presentation</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Toggle this to list the product inside Deals Engine promotions.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 accent-primary" 
                        checked={formData.enableDeal} 
                        onChange={e => setFormData({ ...formData, enableDeal: e.target.checked })} 
                      />
                    </div>

                    {formData.enableDeal && (
                      <div className="space-y-3 pt-2 border-t border-dashed">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-foreground">Offer Title / Headline</label>
                          <Input 
                            placeholder="e.g. iOS flagship price drop alert!" 
                            value={formData.dealTitle} 
                            onChange={e => setFormData({ ...formData, dealTitle: e.target.value })} 
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-foreground">Offer Description / Subtitle</label>
                          <Input 
                            placeholder="e.g. Save 10% on direct retail rates this summer." 
                            value={formData.dealDescription} 
                            onChange={e => setFormData({ ...formData, dealDescription: e.target.value })} 
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground">Expiry Date (Optional)</label>
                            <Input 
                              type="date"
                              value={formData.dealExpiryDate} 
                              onChange={e => setFormData({ ...formData, dealExpiryDate: e.target.value })} 
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-8">
                            <input 
                              type="checkbox" 
                              id="is-trending-checkbox"
                              className="h-4 w-4 accent-primary" 
                              checked={formData.dealIsTrending} 
                              onChange={e => setFormData({ ...formData, dealIsTrending: e.target.checked })} 
                            />
                            <label htmlFor="is-trending-checkbox" className="text-xs font-semibold text-foreground select-none cursor-pointer">
                              Highlight as Trending Deal
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CMS Article Toggle */}
                  <div className="space-y-4 border p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold">Create Review Article (CMS Integration)</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Toggle this to automatically draft and link an editorial article in the CMS.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 accent-primary" 
                        checked={formData.enableArticle} 
                        onChange={e => setFormData({ ...formData, enableArticle: e.target.checked })} 
                      />
                    </div>

                    {formData.enableArticle && (
                      <div className="space-y-3 pt-2 border-t border-dashed">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-foreground">Article Title <span className="text-destructive">*</span></label>
                          <Input 
                            placeholder="e.g. Detailed Review: Is iPhone 16 Pro worth the upgrade?" 
                            value={formData.articleTitle} 
                            onChange={e => setFormData({ ...formData, articleTitle: e.target.value })} 
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground">Article Category</label>
                            <Input 
                              placeholder="Deals" 
                              value={formData.articleCategory} 
                              onChange={e => setFormData({ ...formData, articleCategory: e.target.value })} 
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground">Article Author</label>
                            <Input 
                              value={formData.articleAuthor} 
                              onChange={e => setFormData({ ...formData, articleAuthor: e.target.value })} 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-foreground">Excerpt / Meta Description</label>
                          <Input 
                            placeholder="Enter short post summary..." 
                            value={formData.articleExcerpt} 
                            onChange={e => setFormData({ ...formData, articleExcerpt: e.target.value })} 
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-foreground">Tags (Comma-separated)</label>
                          <Input 
                            placeholder="apple, iphone, deals" 
                            value={formData.articleTags} 
                            onChange={e => setFormData({ ...formData, articleTags: e.target.value })} 
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-foreground">Article Content HTML <span className="text-destructive">*</span></label>
                          <Textarea 
                            placeholder="Write structured HTML post body..."
                            rows={8}
                            value={formData.articleContentHtml}
                            onChange={e => setFormData({ ...formData, articleContentHtml: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Git Authorization */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="border-b pb-2">
                    <h3 className="text-lg font-bold text-foreground">Step 5: Review & Git Authorization</h3>
                    <p className="text-xs text-muted-foreground">Perform final verification on variables and enter GitHub personal token credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-5 rounded-2xl border text-xs">
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Product Specifications</h4>
                      <div><span className="text-muted-foreground">Name:</span> {formData.productName}</div>
                      <div><span className="text-muted-foreground">Type:</span> {formData.productType}</div>
                      <div><span className="text-muted-foreground">Brand:</span> {formData.brandId || "Optional/None"}</div>
                      <div><span className="text-muted-foreground">Category Reference:</span> {formData.categoryId || "Optional/None"}</div>
                      <div><span className="text-muted-foreground">Price:</span> {formData.priceAmount} {formData.currencyCode}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Ingestion Mappings</h4>
                      <div><span className="text-muted-foreground">Merchant ID:</span> {formData.merchantId}</div>
                      <div><span className="text-muted-foreground">External Product ID:</span> {formData.externalProductId}</div>
                      <div><span className="text-muted-foreground">Affiliate Network:</span> {formData.affiliateNetworkRef}</div>
                      <div><span className="text-muted-foreground">Affiliate Tracking Reference:</span> {formData.affiliateTrackingRef}</div>
                      <div><span className="text-muted-foreground">Create Deal:</span> {formData.enableDeal ? "Enabled" : "Disabled"}</div>
                      <div><span className="text-muted-foreground">Create Article:</span> {formData.enableArticle ? "Enabled" : "Disabled"}</div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-800 dark:text-yellow-200 rounded-xl">
                    <div className="flex gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <span className="font-bold">Security Boundary Checklist:</span> To maintain local privacy, your GitHub PAT (Personal Access Token) is processed directly inside memory during git commit orchestration. It is <span className="font-bold">never</span> stored inside the local form draft settings (`axevora_commerce_publisher_draft`).
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      GitHub Personal Access Token (PAT) <span className="text-destructive">*</span>
                    </label>
                    <Input 
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxx" 
                      value={githubToken} 
                      onChange={e => handleSaveGithubToken(e.target.value)} 
                    />
                    <span className="text-[10px] text-muted-foreground leading-relaxed block">
                      Token requires write permissions for the repository (tittooin/tittoos-toolbox-hub) to execute multi-file JSON database updates.
                    </span>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearDraft}
                  >
                    Clear Form / Reset
                  </Button>
                </div>

                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrevStep}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                  )}

                  {currentStep < 5 ? (
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleNextStep}
                    >
                      Next Step <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handlePublish}
                      disabled={isPublishing}
                    >
                      {isPublishing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Publishing Ingestion...
                        </>
                      ) : (
                        "Confirm Ingestion & Commit"
                      )}
                    </Button>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CommercePublisher;
