import DealsLayout from "../components/DealsLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingDeals = () => {
  return (
    <DealsLayout title="Trending Deals" subtitle="Most popular deals verified by shoppers today">
      <Card className="border-dashed border-purple-500/20 bg-purple-500/5">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-purple-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Trending Hot-List</CardTitle>
          <CardDescription>
            High converting products based on rating velocity tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Yeh hot-deals list placeholder hai. Jaise hi Amazon API integration complete hoga, automation engines highest clicks and price drop items ko is grid me automatically route karenge.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/deals">Back to All Deals</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DealsLayout>
  );
};

export default TrendingDeals;
