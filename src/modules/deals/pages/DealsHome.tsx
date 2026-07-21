import DealsLayout from "../components/DealsLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const DealsHome = () => {
  return (
    <DealsLayout title="Latest Deals Engine" subtitle="Real-time discount catalog tracking system">
      <Card className="border-dashed border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Latest Deals Catalog</CardTitle>
          <CardDescription>
            Deals Engine is ready to link with Amazon and Flipkart feeds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Yeh placeholder page is module ki routing confirm karne ke liye build kiya gaya hai. Future releases me, is dynamic grid space me daily verified sales deals dynamically cards ke form me pull honge.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/deals/trending">View Trending Deals</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/deals/categories">Browse Categories</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Dynamic Product details route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Test dynamic item rendering route:
            </p>
            <Button asChild variant="secondary" size="sm">
              <Link to="/deals/product/test-product-123">Go to Test Product Page</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Dynamic Article details route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Test dynamic review article rendering route:
            </p>
            <Button asChild variant="secondary" size="sm">
              <Link to="/deals/article/test-article-123">Go to Test Article Page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DealsLayout>
  );
};

export default DealsHome;
