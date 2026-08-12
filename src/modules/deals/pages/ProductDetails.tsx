import DealsLayout from "../components/DealsLayout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, AlertCircle, Bot, ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { resolveCommerceData, CommerceProductCard } from "@/modules/commerce";
import { useState, useEffect } from "react";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const [reviewData, setReviewData] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(true);

  // Resolve commerce data using the product ID parameter
  const commerceData = id ? resolveCommerceData(id) : null;
  const productName = commerceData ? commerceData.product.name : id;

  useEffect(() => {
    if (!productName) return;
    
    const fetchReviewSummary = async () => {
      try {
        const res = await fetch(`/api/commerce/review-summary?q=${encodeURIComponent(productName)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            setReviewData(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch review summary", err);
      } finally {
        setLoadingReview(false);
      }
    };
    
    fetchReviewSummary();
  }, [productName]);

  return (
    <DealsLayout title="Product Analysis" subtitle={commerceData ? `Detailed technical review for ${commerceData.product.name}` : `Detailed technical review for item ID: ${id}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link to="/deals" className="flex items-center gap-1 hover:text-primary no-underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
          </Link>
          <span>/</span>
          <span>Product Page</span>
        </div>

        {commerceData ? (
          <CommerceProductCard data={commerceData} />
        ) : (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Product Not Found
              </CardTitle>
              <CardDescription>
                The requested product identifier is not registered in the commerce catalog database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Target Product ID key: <code className="bg-muted px-1.5 py-0.5 rounded text-destructive text-xs">{id}</code>.
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Review Summary Section */}
        <Card className="mt-8 border-primary/20">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              AI Review Summary
            </CardTitle>
            <CardDescription>
              Aggregated web sentiment & technical breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loadingReview ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p>Analyzing product reviews...</p>
              </div>
            ) : reviewData ? (
              <div className="space-y-6">
                
                {/* Score Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-muted">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Overall Sentiment</p>
                    <p className="text-lg font-bold text-foreground">{reviewData.overallSentiment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-medium mb-1">User Rating</p>
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 px-3 py-1 rounded-full font-bold">
                      <Star className="h-4 w-4 fill-current" />
                      {reviewData.rating} / 5.0
                    </div>
                  </div>
                </div>

                <div className="text-base text-foreground leading-relaxed">
                  <p className="font-semibold mb-2">Consensus:</p>
                  {reviewData.consensusSummary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pros */}
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                    <h4 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-500 mb-4">
                      <ThumbsUp className="h-5 w-5" /> Pros
                    </h4>
                    <ul className="space-y-2">
                      {reviewData.pros?.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-green-500 mt-1">•</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                    <h4 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-500 mb-4">
                      <ThumbsDown className="h-5 w-5" /> Cons
                    </h4>
                    <ul className="space-y-2">
                      {reviewData.cons?.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-red-500 mt-1">•</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Could not generate review summary at this time.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </DealsLayout>
  );
};

export default ProductDetails;
