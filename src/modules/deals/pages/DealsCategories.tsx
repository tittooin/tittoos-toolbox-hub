import DealsLayout from "../components/DealsLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid } from "lucide-react";
import { Link } from "react-router-dom";

const DealsCategories = () => {
  return (
    <DealsLayout title="Browse Categories" subtitle="Find discounts by interest and technology channels">
      <Card className="border-dashed border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
            <Grid className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Store Categories Map</CardTitle>
          <CardDescription>
            Seamless navigation across electronics, apparel, and lifestyle items.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Yeh category selector page foundation hai. Future updates me modular categorization schemas dynamically load honge aur filter state query strings pass karenge.
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

export default DealsCategories;
