import DealsLayout from "../components/DealsLayout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { resolveCommerceData, CommerceProductCard } from "@/modules/commerce";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Resolve commerce data using the product ID parameter
  const commerceData = id ? resolveCommerceData(id) : null;

  return (
    <DealsLayout title="Product Analysis" subtitle={commerceData ? `Detailed technical review for ${commerceData.product.name}` : `Detailed technical review for item ID: ${id}`}>
      <div className="max-w-2xl mx-auto space-y-6">
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
      </div>
    </DealsLayout>
  );
};

export default ProductDetails;
